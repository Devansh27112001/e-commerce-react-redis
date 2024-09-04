import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (!accessToken)
      return res.status(401).json({
        status: "failed",
        message: "Unauthorized - No access token provided",
      });

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      console.log(decoded);
      const user = await User.findById(decoded.userId).select("-password");
      if (!user)
        return res.status(401).json({
          status: "failed",
          message: "User not found for the provided access token",
        });

      req.user = user; //This user will be used in the adminRoute to check if the user is an admin
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          status: "failed",
          message: "Unauthorized - Access token expired",
        });
      } else {
        throw error;
      }
    }
  } catch (err) {
    console.log("Error in authMiddleware:protectRoute", err.message);
    res.status(401).json({ status: "failed", message: "Unauthorized" });
  }
};
export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res
      .status(403)
      .json({ status: "failed", message: "Access denied - Admin only" });
  }
};
