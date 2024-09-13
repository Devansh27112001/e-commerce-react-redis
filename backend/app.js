import express from "express";
import morgan from "morgan";

import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import couponRouter from "./routes/coupon.route.js";
import paymentRouter from "./routes/payment.route.js";
import analyticsRouter from "./routes/analytic.route.js";
const app = express();
// Middlewares
app.use(morgan("dev"));
app.use(
  express.json({
    limit: "10mb",
  })
);
app.use(cookieParser()); // for parsing body of the request

// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/analytics", analyticsRouter);

export default app;
