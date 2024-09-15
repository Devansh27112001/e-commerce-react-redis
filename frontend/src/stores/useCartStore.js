import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  totalAmount: 0,
  subTotal: 0,
  loading: false,

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data.cartItems });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response.data.message || "An error occured");
    }
  },

  addToCart: async (product) => {
    try {
      //
      await axios.post("/cart", { productId: product._id });
      toast.success("Product added to cart");
      set((previousState) => {
        // First check if the product that we are adding in the cart already exists in the cart
        const existingItem = previousState.cart.find(
          (item) => item._id === product._id
        );
        // if existingItem, map through the previousState.cartItems and for the item where item._id === product._id, return {...item, quantity:item.quantity + 1} else return item. If new Item and not in cartItems already, return the previousState of the cart with {...product, quantity: 1}
        const newCart = existingItem
          ? previousState.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...previousState.cart, { ...product, quantity: 1 }];

        return { cart: newCart };
      });
      get().calculateTotals();
    } catch (error) {
      toast.error(error.response.data.message || "An error occured");
    }
  },

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subTotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    let total = subTotal;
    if (coupon) {
      total = subTotal - (subTotal * coupon.discountPercentage) / 100;
    }

    set({ totalAmount: total, subTotal });
  },
}));

export default useCartStore;
