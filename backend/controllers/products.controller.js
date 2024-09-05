import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import Product from "../models/product.model.js";

async function updateFeaturedProductsCache() {
  try {
    // Get all the featured products from the database
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    await redis.set("featuredProducts", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log(
      "Error in updateFeaturedProductsCache function:",
      error.message
    );
  }
}

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

export const createProduct = async (req, res) => {
  try {
    const { name, description, image, price, category } = req.body;

    let cloudinaryResponse = null;
    if (image) {
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    // clodinary puts the image in the .secureUrl key
    const product = await Product.create({
      name,
      description,
      price,
      category,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
    });
    res.status(201).json({
      status: "Success",
      product,
    });
  } catch (error) {
    console.log("Error in productsController:createProduct", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.name,
    });
  }
};

// Delete the product from the database and also delete the image fro the cloudinary
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: "failed",
        message: "Product not found",
      });
    }
    if (product.image) {
      // Example https://res.cloudinary.com/dzyzvgvtb/image/upload/v1725458892/name-of-image.jpg
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        // It will be in the products folder in cloudinary like 'products/name-of-image.jpg'
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted from cloudinary");
      } catch (error) {
        console.log("Error deleting image from cloudinary:", error.message);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "Success",
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("Error in productsController:deleteProduct", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const recommendedProducts = await Product.aggregate([
      {
        $sample: { size: 3 },
      },
      {
        $project: { _id: 1, name: 1, description: 1, image: 1, price: 1 },
      },
    ]);

    res.status(200).json({
      status: "Success",
      products: recommendedProducts,
    });
  } catch (error) {
    console.log(
      "Error in productsController:getRecommendedProducts",
      error.message
    );
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    const products = await Product.find({ category });
    res.status(200).json({
      statis: "Success",
      products,
    });
  } catch (error) {
    console.log(
      "Error in productsController:getProductsByCategory",
      error.message
    );
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};

export const toggleFeatured = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      // Update the redis cache
      // This function is called after updating our database. So when we fetch the featured products from the database, we will get an array which will have the latest featured product also. We then set that featuredProducts array in redis.
      await updateFeaturedProductsCache();
      res.status(200).json({
        status: "success",
        updatedProduct,
      });
    } else {
      res.status(404).json({
        status: "failed",
        message: "Product not found",
      });
    }
  } catch (error) {
    console.log("Error in productsController:toggleFeatured", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};
