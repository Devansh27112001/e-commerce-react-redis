import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.status(200).json(coupon || null);
  } catch (error) {
    console.log("Error in couponController:getCoupon", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};

export const valodateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      userId: req.user._id,
      isActive: true,
    });
    if (!coupon) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid coupon code",
      });
    }

    if (coupon.expiryDate < Date.now()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(404).json({
        status: "failed",
        message: "Coupon expired",
      });
    }

    res.status(200).json({
      status: "success",
      message: "coupon valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in couponController:valodateCoupon", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};
