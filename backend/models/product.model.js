import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A name for the product is required"],
      minLength: [3, "Product name must be at least 3 characters"],
    },
    description: {
      type: String,
      description: [true, "A description for the product is required"],
    },
    price: {
      type: Number,
      min: 0,
      required: [true, "A price for the product is required"],
    },
    image: {
      type: String,
      required: [true, "An image for the product is required"],
    },
    category: {
      type: String,
      required: [true, "A category for the product is required"],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
