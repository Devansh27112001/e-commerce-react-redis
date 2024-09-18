import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

export const createCheckoutSession = async (req, res) => {
  try {
    const { products, couponCode } = req.body;
    console.log(products);

    // Check whether there are products is a valid array
    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ status: "failed", message: "Invalid or empty products array" });
    }

    let totalAmount = 0;
    const lineItems = products.map((product) => {
      //stripe wants you to send in the format of cents => $10 * 100 = $1000
      const amount = Math.round(product.price * 100);
      totalAmount += amount * product.quantity;
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: amount,
        },
        quantity: product.quantity || 1,
      };
    });

    let coupon = null;
    if (couponCode) {
      coupon = await Coupon.findOne({
        code: couponCode,
        userId: req.user._id,
        isActive: true,
      });
      if (coupon) {
        totalAmount -= Math.round(
          (coupon.discountPercentage * totalAmount) / 100
        );
      }
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
      discounts: coupon
        ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
        : [],
      // This metadata is used in the /checkout-success route where in we get the sesson from the session id passed in the req.body and from there we use session.metadata to get the couponCode and the userId to update the status of that coupon
      metadata: {
        userId: req.user._id.toString(),
        couponCode: couponCode || "",
        products: JSON.stringify(
          products.map((product) => ({
            id: product._id,
            quantity: product.quantity,
            price: product.price,
          }))
        ),
      },
    });
    // in cents
    if (totalAmount >= 20000) {
      await createNewCoupon(req.user._id);
    }
    res.status(200).json({
      status: "success",
      id: session.id,
      totalAmount: totalAmount / 100,
    });
  } catch (error) {
    console.log(
      "Error in paymentController:createCheckoutSession",
      error.message
    );
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};

export const checkoutSuccess = async (req, res) => {
  try {
    const { sessionId } = req.body;
    // From this sessionId, retrieve the session from stripe.
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // If payment was successful and a coupon was used, get the couponCode from the metadata and deactivate it. This couponCode was set in the controller for the /create-checkout-session in the metadata field.
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          {
            isActive: false,
          }
        );
      }
      // We create a new order
      const products = JSON.parse(session.metadata.products);
      const newOrder = await Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        // Converts from cents to dollars
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
      });

      await newOrder.save();
      res.status(200).json({
        status: "success",
        message:
          "Payment successful, order created and coupon deactivated if used",
        orderId: newOrder._id,
      });
    }
  } catch (error) {
    console.log("Error processing successful checkout", error.message);
    res.status(500).json({
      status: "failed",
      message: "Error processing successful checkout",
      error: error.message,
    });
  }
};

async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });
  return coupon.id;
}

async function createNewCoupon(userId) {
  const newCoupon = new Coupon({
    code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    discountPercentage: 10,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    userId: userId,
  });

  await newCoupon.save();
  return newCoupon;
}
