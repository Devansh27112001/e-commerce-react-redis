import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  user: null,
  isLoading: false,
  checkingAuth: true,

  signup: async ({ name, email, password, confirmPassword }) => {
    set({ isLoading: true });
    if (password !== confirmPassword) {
      set({ isLoading: false });
      return toast.error("Passwords do not match");
    }

    try {
      const res = await axios.post("/auth/signup", {
        name,
        email,
        password,
      });
      set({ user: res.data.user, isLoading: false });
      toast.success("Account created successfully");
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },

  login: async ({ email, password }) => {
    set({ isLoading: true });
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });
      set({ user: res.data.user, isLoading: false });
      toast.success("Logged in successfully");
    } catch (error) {
      set({ isLoading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  isAuthenticated: async () => {
    set({ checkingAuth: true });
    try {
      const res = await axios.get("/auth/profile");
      set({ user: res.data.user, checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false });
    }
  },

  logout: async () => {
    try {
      await axios.post("/auth/logout");
      set({ user: null });
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    }
  },

  refreshToken: async () => {
    if (get().checkingAuth) {
      return;
    }
    try {
      set({ checkingAuth: true });
      await axios.post("/auth/refresh-token");
      set({ checkingAuth: false });
    } catch (error) {
      set({ user: null, checkingAuth: false });
      throw error;
    }
  },
}));
