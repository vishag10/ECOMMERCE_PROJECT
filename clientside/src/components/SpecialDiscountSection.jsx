import React from "react";
import PropTypes from "prop-types"; 
import { Link } from "react-router-dom";

const SpecialDiscountSection = ({ products }) => {
  // Ensure products is an array before filtering
  const discountedProducts = Array.isArray(products) ? products.filter(product => product.discount) : [];

  if (discountedProducts.length === 0) return null;

  return (
    <div className="w-4/5 mx-auto my-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Special Discounts</h2>
        <p className="text-gray-500 mt-2">Limited time offers you don't want to miss!</p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {discountedProducts.slice(0, 8).map((product) => (
          <Link to={`/product/${product._id}`} key={product._id}>
            <div className="group relative">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 shadow-md">
                <img
                  src={product.photos?.[0] || "/placeholder.jpg"} // Fallback image
                  alt={product.product_name || "Discounted Product"}
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-red-500 text-white font-bold text-sm w-12 h-12 flex items-center justify-center rounded-full shadow-lg">
                {product.discount || 0}%
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

// ✅ *PropTypes for validation*
SpecialDiscountSection.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      photos: PropTypes.arrayOf(PropTypes.string), // Array of image URLs
      product_name: PropTypes.string.isRequired,
      discount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired, // Ensure products prop is required
};

// ✅ *Export optimized component*
export default React.memo(SpecialDiscountSection);
