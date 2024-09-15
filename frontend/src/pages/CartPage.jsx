import { useEffect } from "react";
import useCartStore from "../stores/useCartStore";
import EmptyCartUI from "../components/EmptyCartUI";

const CartPage = () => {
  const { cart } = useCartStore();
  return (
    <div className="py-8 md:py-16">
      <div className="max-w-screen-xl px-4 2xl:px-0 mx-auto">
        <div className="mt-6 sm:mt-8 lg:flex lg:items-start xl:gap-8">
          {cart?.length === 0 && <EmptyCartUI />}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
