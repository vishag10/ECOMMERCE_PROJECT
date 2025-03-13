import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);


  return (
    <Link to={`/product/${product._id}`}>
      <div
        className="group relative w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="border-none shadow-none hover:shadow-none bg-transparent">
          <div className="h-64 w-64 relative aspect-square overflow-hidden rounded-lg bg-gray-100 ">
            <img
              src={product.photos?.[0] || "/placeholder.jpg"} 
              alt={product.product_name || "Product Image"}
              className={`h-64 w-64 object-cover object-center transition-all duration-700 ease-in-out ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              loading="lazy"
            />
            {product.discount ? (
              <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 m-2 rounded-full shadow-lg transform -rotate-12 font-medium text-sm">
                {product.discount}% OFF
              </div>
            ) : null}
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between">
              <h3 className="text-base font-medium text-gray-900">
                {product.product_name || "Unnamed Product"}
              </h3>
              <span className="text-base font-medium text-gray-900">
                ₹{product.price || "N/A"}
              </span>
            </div>
            <p className="text-xs text-gray-500">
              {product.category || "Uncategorized"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ✅ *PropTypes for validation*
ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    photos: PropTypes.arrayOf(PropTypes.string),
    product_name: PropTypes.string.isRequired,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    discount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    category: PropTypes.string,
  }).isRequired,
};


export default React.memo(ProductCard);