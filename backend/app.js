import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import productRouter from "./routes/product.route.js";
const app = express();
// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser()); // for parsing body of the request

// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

export default app;
