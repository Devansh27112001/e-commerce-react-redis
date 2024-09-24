import { create } from "zustand";
import axios from "../lib/axios";
import { getDailySalesData } from "../../../backend/controllers/analytic.controller";

export const useAnalyticsStore = create((set, get) => ({
  users: 0,
  products: 0,
  totalSales: 0,
  totalRevenue: 0,

  getAnalyticsData: async () => {
    try {
      const res = await axios.get("/analytics");
      console.log(res.data);
      const { users, products, totalSales, totalRevenue } =
        res.data.analyticsData;
      set({ users, products, totalSales, totalRevenue });
    } catch (error) {
      console.log(error);
    }
  },

  getDailySalesData: async () => {},
}));
