import { XCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
const PurchaseCancel = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-gray-800 shadow-xl overflow-hidden relative rounded-lg z-10"
      >
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <XCircle className="text-red-500 h-20 w-20 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-red-500 mb-2">
            Purchase Cancelled
          </h1>
          <p className="text-gray-300 text-center mb-6">
            Your order has been cancelled and no charges have been made.
          </p>
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-gray-300 text-sm text-center">
              If you encountered any problems during the checkout process,
              please contact our support team.
            </p>
          </div>
          <div className="space-y-4">
            <Link
              className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              to="/"
            >
              <ArrowLeft className="mr-1 mt-[2px]" size={18} />
              Return to shopping
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PurchaseCancel;
