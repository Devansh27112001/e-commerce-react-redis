import Product from "../models/product.model.js";

export const getCart = async (req, res) => {
  try {
    // This will give us all the products that are in the cart. But they do not have the quantity.
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    const cartItems = products.map((product) => {
      const item = req.user.find((item) => item.id === product._id);
      return {
        ...product.toJSON(),
        quantity: item ? item.quantity : 0,
      };
    });
    res.json(cartItems);
  } catch (error) {
    console.log("Error in cartController:getCart", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};

// Will add a product to the cart with the quanity of 1.
export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;

    // This is a protected route so we can get the current user details from the req.user
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in cartController:addToCart", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};

// Will remove the product from the cart regardless of the quantity.
export const deleteAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in cartController:deleteAllFromCart", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};

// Will update the quantity of the product in the cart.
export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({
        status: "failed",
        message: "Product not found in cart",
      });
    }
  } catch (error) {
    console.log("Error in cartController:updateQuantity", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};
