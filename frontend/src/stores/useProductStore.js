import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProductStore = create((set, get) => ({
  products: [],
  loading: false,

  setProducts: (products) => set({ products }),

  createProduct: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((previousState) => ({
        products: [...previousState.products, res.data.product],
        loading: false,
      }));
      toast.success("Product created successfully");
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/products");
      set({ products: res.data.products, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "Failed to fetch products");
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.delete(`/products/${id}`);
      set((previousState) => ({
        products: previousState.products.filter((product) => {
          product._id !== id;
        }),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "failed to delete product");
    }
  },

  toggleFeaturedProduct: async (id) => {
    set({ loading: true });
    try {
      const res = await axios.patch(`/products/${id}`);
      // This will update the isFeatured property of the product in the store
      set((previousState) => ({
        products: previousState.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: res.data.updatedProduct.isFeatured }
            : product
        ),
        loading: false,
      }));
    } catch (error) {
      set({ loading: false });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
}));
