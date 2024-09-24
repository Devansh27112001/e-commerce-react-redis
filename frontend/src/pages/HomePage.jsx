import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { categories } from "../lib/index";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProductsCard from "../components/FeaturedProductsCard";
const HomePage = () => {
  const {
    loading: isLoading,
    fetchFeaturedProducts,
    products,
  } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);
  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4">
          Explore Our Categories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover the latest trends in fashion
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            return <CategoryItem category={category} key={category.name} />;
          })}
        </div>
        {!isLoading && products?.length > 0 && (
          <FeaturedProductsCard featuredProducts={products} />
        )}
      </div>
    </div>
  );
};

export default HomePage;
