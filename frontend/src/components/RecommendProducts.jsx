import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "./ProductCard";
import LoadingSpinner from "./LoadingSpinner";

const RecommendProducts = () => {
  const {
    recommendProducts,
    loading: isLoading,
    fetchRecommededProducts,
  } = useProductStore();

  useEffect(() => {
    fetchRecommededProducts();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-emerald-400">
        People also bought
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
        {recommendProducts?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default RecommendProducts;
