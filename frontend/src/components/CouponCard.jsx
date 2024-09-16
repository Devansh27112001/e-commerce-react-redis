import { motion } from "framer-motion";
import { useState } from "react";
import useCartStore from "../stores/useCartStore";

const CouponCard = () => {
  const [couponCode, setCouponCode] = useState("");

  const { coupon, isCouponApplied } = useCartStore();

  const handleApplyCouponCode = () => {
    console.log(couponCode);
  };

  const handleRemoveCouponCode = () => {
    console.log("Remove coupon code");
  };
  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="coupon"
            className="text-sm block mb-2 font-medium text-gray-300"
          >
            Do you have a gift card or voucher?
          </label>
          <input
            type="text"
            name="coupon"
            id="coupon"
            className="w-full rounded-lg block border border-gray-600 bg-gray-700 focus:outline-none px-3 py-2
          text-sm focus:ring-emerald-500 text-white placeholder-gray-200 focus:ring-1 focus:border-emerald-500"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            required
          />
        </div>
        <motion.button
          className="w-full flex justify-center bg-emerald-600 items-center rounded-lg px-5 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          whileHover={{ scale: 1.05 }}
          whileFocus={{ scale: 0.95 }}
          onClick={handleApplyCouponCode}
        >
          Apply Code
        </motion.button>
      </div>
      {coupon && isCouponApplied && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">Applid Coupon</h3>
          <p>
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
          <motion.button
            type="button"
            className="mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 
            px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none
             focus:ring-4 focus:ring-red-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRemoveCouponCode}
          >
            Remove Coupon
          </motion.button>
        </div>
      )}
      {coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">
            Your Available Coupon:
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default CouponCard;
