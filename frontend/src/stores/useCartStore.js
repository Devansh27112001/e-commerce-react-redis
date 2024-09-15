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
      set({ loading: true });
      // When we get the cartItems, we are already logged in and so we have user stored our request.
      const res = await axios.get("/cart");
      set({ cart: res.data.cartItems });
      get().calculateTotals();
      set({ loading: false });
    } catch (error) {
      set({ cart: [], loading: false });
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

  removeFromCart: async (productId) => {
    await axios.delete(`/cart`, { data: productId });
    set((prevState) => {
      return {
        cart: prevState.cart.filter((item) => item._id !== productId),
      };
    });
    get().calculateTotals();
  },
  updateQuantity: async (productId, quantity) => {
    console.log(productId, quantity);
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    await axios.put(`/cart/${productId}`, { quantity });
    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      ),
    }));
    get().calculateTotals();
  },
}));

export default useCartStore;
