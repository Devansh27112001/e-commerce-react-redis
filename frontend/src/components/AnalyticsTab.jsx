import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { User2, Package, ShoppingCart, DollarSign } from "lucide-react";
import { useAnalyticsStore } from "../stores/useAnalyticsStore";
import AnalyticsCard from "./AnalyticsCard";

function AnalyticsTab() {
  const {
    getAnalyticsData,
    loading: isDataLoading,
    users,
    products,
    totalSales,
    totalRevenue,
    dailySalesData,
  } = useAnalyticsStore();
  useEffect(() => {
    getAnalyticsData();
  }, []);

  if (isDataLoading)
    return (
      <div className="text-center text-5xl text-emerald-400 uppercase tracking-wider">
        Loading...
      </div>
    );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid sm:grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <AnalyticsCard
          title="Total Users"
          value={users}
          icon={User2}
          color={"from-emerald-500 to-teal-700"}
        />
        <AnalyticsCard
          title="Total Products"
          value={products}
          icon={Package}
          color={"from-emerald-500 to-green-700"}
        />
        <AnalyticsCard
          title="Total Sales"
          value={totalSales}
          icon={ShoppingCart}
          color={"from-emerald-500 to-cyan-700"}
        />
        <AnalyticsCard
          title="Total Revenue"
          value={`$${totalRevenue}`}
          icon={DollarSign}
          color={"from-emerald-500 to-lime-700"}
        />
      </div>
      <motion.div
        className="bg-gray-800/60 rounded-lg p-6 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={dailySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#D1D5DB" />
            <YAxis yAxisId="left" stroke="#D1D5DB" />
            <YAxis yAxisId="right" orientation="right" stroke="#D1D5DB" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="sales"
              stroke="#10B981"
              activeDot={{ r: 8 }}
              name="Sales"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              activeDot={{ r: 8 }}
              name="Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

export default AnalyticsTab;
