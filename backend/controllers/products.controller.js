import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // get all products
    res.status(200).json({
      status: "Success",
      products,
    });
  } catch (err) {
    console.log("Error in productsController:getAllProducts", err.message);
    res
      .status(500)
      .json({ status: "failed", message: "Server error", error: err.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featuredProducts");
    // Redis will store the featuredProducts in string format. So we nedd to parse it in order to get an actual object.
    if (featuredProducts) {
      return res.status(200).json({
        status: "Success",
        featuredProducts: JSON.parse(featuredProducts),
      });
    }

    // If not in redis, we will fecth it from database
    // The lean() option returns a plain javascript object instead of mongoose object/ mongodb document which makes it easier to work with and also improves the performance
    featuredProducts = await Product.find({ isFeatured: true }).lean();
    if (!featuredProducts)
      return res
        .status(404)
        .json({ status: "failed", message: "No featured products found" });

    // Store it in redis for future quick access
    await redis.set("featuredProducts", JSON.stringify(featuredProducts));
    res.status(200).json({
      status: "Success",
      featuredProducts,
    });
  } catch (error) {
    console.log(
      "Error in productsController:getFeaturedProducts",
      error.message
    );
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};
