import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import useCartStore from "../stores/useCartStore";

const FeaturedProductsCard = ({ featuredProducts }) => {
  const [slider, setSlider] = useState({ currentIndex: 0, itemsPerPage: 4 });
  const { addToCart } = useCartStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlider({ ...slider, itemsPerPage: 1 });
      } else if (window.innerWidth < 1024) {
        setSlider({ ...slider, itemsPerPage: 2 });
      } else if (window.innerWidth < 1280) {
        setSlider({ ...slider, itemsPerPage: 3 });
      } else {
        setSlider({ ...slider, itemsPerPage: 4 });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextPage = () => {
    setSlider((previousSliderState) => ({
      ...previousSliderState,
      currentIndex:
        previousSliderState.currentIndex + previousSliderState.itemsPerPage,
    }));
  };

  const previousPage = () => {
    setSlider((previousSliderState) => ({
      ...previousSliderState,
      currentIndex:
        previousSliderState.currentIndex - previousSliderState.itemsPerPage,
    }));
  };

  const isStartDisabled = slider.currentIndex === 0;
  const isEndDisabled =
    slider.currentIndex + slider.itemsPerPage >= featuredProducts?.length;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl sm:text-5xl text-center font-bold text-emerald-400 mb-4">
          Featured
        </h2>
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${
                  slider.currentIndex * (100 / slider.itemsPerPage)
                }%)`,
              }}
            >
              {featuredProducts?.map((product) => (
                <div
                  key={product._id}
                  className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2"
                >
                  <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30">
                    <div className="overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110 ease-in-out"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {product.name}
                      </h3>
                      <p className="texte-emerald-300 mb-4 font-medium">
                        ${product.price.toFixed(2)}
                      </p>
                      <button
                        className="w-full flex justify-center items-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={previousPage}
            disabled={isStartDisabled}
            className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2  rounded-full transition-colors duration-300 ${
              isStartDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextPage}
            disabled={isEndDisabled}
            className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2  rounded-full transition-colors duration-300 ${
              isEndDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-500"
            }`}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductsCard;
