import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useAnalyticsStore = create((set, get) => ({
  users: 0,
  products: 0,
  totalSales: 0,
  totalRevenue: 0,
  dailySalesData: [],
  loading: false,

  getAnalyticsData: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/analytics");
      const { users, products, totalSales, totalRevenue } =
        res.data.analyticsData;
      set({
        users,
        products,
        totalSales,
        totalRevenue,
        dailySalesData: res.data.dailySalesdata,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "There was an erro in fetching the data"
      );
    }
  },
}));
