import { useEffect, useState } from "react";

const FeaturedProductsCard = ({ featuredProducts }) => {
  const [slider, setSlider] = useState({ currentIndex: 0, itemsPerPage: 4 });

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
    slider.currentIndex + slider.itemsPerPage >= featuredProducts.length;

  return <div>FeaturedProductsCard</div>;
};

export default FeaturedProductsCard;
