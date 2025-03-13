import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const CategoryCarousel = ({ title, products }) => {
  const carouselRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemWidth = 300; // Approx width of each product card

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -itemWidth, behavior: "smooth" });
      setCurrentSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: itemWidth, behavior: "smooth" });
      setCurrentSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    }
  };

  if (!Array.isArray(products) || products.length === 0) return null; 

  return (
    <div className="relative mb-12 w-full mx-auto">
      {/* 🔹 Category Title */}
      <h2 className="text-xl font-bold text-gray-900 text-start mb-4">{title || "Category"}</h2>

      {/* 🔹 Left Button */}
      <button
        className=" z-40 absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors cursor-pointer"
        onClick={scrollLeft}
      >
        <ChevronLeft size={24} />
      </button>

      {/* 🔹 Product List */}
      <div ref={carouselRef} className="flex overflow-x-hidden pb-4 gap-6 hide-scrollbar scroll-smooth">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* 🔹 Right Button */}
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors cursor-pointer"
        onClick={scrollRight}
      >
        <ChevronRight size={24} />
      </button>

     
    </div>
  );
};

// ✅ *PropTypes for validation*
CategoryCarousel.propTypes = {
  title: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      photos: PropTypes.arrayOf(PropTypes.string),
      product_name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      discount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      category: PropTypes.string,
    })
  ).isRequired,
};

// ✅ *Export optimized component*
export default React.memo(CategoryCarousel);