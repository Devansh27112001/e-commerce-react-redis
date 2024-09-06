import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controllers/analytic.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();
    // The bew Date will look something like '2024-09-06T21:05:39.551Z'
    const endDate = new Date();

    // The .getTime() will convert the date into milliseconds and we subtract 7 days from it and create a Date out of it.
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesdata = await getDailySalesData(startDate, endDate);
    res.status(200).json({
      status: "success",
      analyticsData,
      dailySalesdata,
    });
  } catch (error) {
    console.log("Error in analytic route", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
});
export default router;
