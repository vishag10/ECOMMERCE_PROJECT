import React, { useState } from "react";
import { Link } from "react-router-dom";


const ProductCard = React.memo(({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <Link to={`/product/${product._id}`}>
        <div 
          className="group relative w-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="border-none shadow-none hover:shadow-none bg-transparent">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.photos?.[0]} 
                alt="Product"
                className={`h-full w-full object-cover object-center transition-all duration-700 ease-in-out
                  ${isHovered ? 'scale-110' : 'scale-100'}`}
                loading="lazy"
              />
              {product.discount && (
                <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 m-2 rounded-full shadow-lg transform -rotate-12 font-medium text-sm">
                  {product.discount}% OFF
                </div>
              )}
            </div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between">
                <h3 className="text-base font-medium text-gray-900">{product.product_name}</h3>
                <span className="text-base font-medium text-gray-900">₹{product.price}</span>
              </div>
              <p className="text-xs text-gray-500">{product.category}</p>
            </div>
          </div>
        </div>
      </Link>
    );
  });

  export default ProductCard;