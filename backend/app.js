import express from "express";
import morgan from "morgan";
import path from "path";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";
import couponRouter from "./routes/coupon.route.js";
import paymentRouter from "./routes/payment.route.js";
import analyticsRouter from "./routes/analytic.route.js";
const app = express();
const __dirname = path.resolve();

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

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  // If the user visits any other route other than "/", then serve the index.html file from the frontend folder.
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

export default app;
