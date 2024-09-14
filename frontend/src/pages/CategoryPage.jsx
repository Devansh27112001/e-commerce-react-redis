import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";

import { useProductStore } from "../stores/useProductStore";
import LoadingSpinner from "../components/LoadingSpinner";
import ProductCard from "../components/ProductCard";

const CategoryPage = () => {
  const { category } = useParams();
  const {
    loading: isLoading,
    products,
    fetchProductsByCategory,
  } = useProductStore();

  useEffect(() => {
    fetchProductsByCategory(category);
  }, [category]);
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="min-h-screen">
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-16">
        <motion.h1
          className="text-center text-4xl sm:text-5xl font-bold text-emerald-400 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </motion.h1>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {products?.length === 0 && (
            <h2 className="text-2xl font-semibold text-gray-300 text-center col-span-full">
              No products found for this category.
            </h2>
          )}
          {products?.map((product) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CategoryPage;
