import { motion } from "framer-motion";
import useCartStore from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

const OrderSummary = () => {
  const { totalAmount, subTotal, coupon, isCouponApplied } = useCartStore();
  const savings = subTotal - totalAmount;
  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <p className="text-xl font-semibold text-emerald-400">Order summary</p>
      <div className="space-y-4">
        <div className="space-y-2">
          <dl className="flex justify-between items-center gap-4">
            <dt className="text-base font-normal text-gray-300">
              Original price
            </dt>
            <dd className="text-base font-medium text-white">
              ${subTotal.toFixed(2)}
            </dd>
          </dl>
          {savings > 0 && (
            <dl className="flex justify-between items-center gap-4">
              <dt className="text-base font-normal text-gray-300">Savings</dt>
              <dd className="text-base font-medium text-emerald-400">
                ${savings.toFixed(2)}
              </dd>
            </dl>
          )}
          {coupon && isCouponApplied && (
            <dl className="flex justify-between items-center gap-4">
              <dt className="text-base font-normal text-gray-300">
                Coupon ({coupon.code})
              </dt>
              <dd className="text-base font-medium text-emerald-400">
                -{coupon.discountPercentage}%
              </dd>
            </dl>
          )}
          <dl className="flex justify-between items-center gap-4 border-t border-gray-600 pt-2">
            <dt className="text-base font-bold text-white">Total</dt>
            <dd className="text-base font-bold text-emerald-400">
              ${totalAmount.toFixed(2)}
            </dd>
          </dl>
        </div>

        <motion.button
          className="flex w-full items-center justify-center bg-emerald-600 py-2.5 px-5 text-sm rounded-lg text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300"
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
        >
          Proceed to checkout
        </motion.button>
        <div className="flex justify-center items-center gap-2">
          <span className="text-sm font-normal text-gray-400">or</span>
          <Link
            to="/"
            className="inline-flex  gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline"
          >
            Continue shopping
            <MoveRight size={16} className="self-center" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderSummary;
