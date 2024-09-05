import express from "express";
import {
  addToCart,
  deleteAllFromCart,
  getCart,
  updateQuantity,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCart);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, deleteAllFromCart);
router.put("/:id", protectRoute, updateQuantity);

export default router;
