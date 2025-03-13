import React from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import { X } from "lucide-react";

const Filters = ({
  categories,
  selectedCategories,
  setSelectedCategories,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  searchQuery,
  setSearchQuery,
  onClose,
}) => {
  
  // Toggle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="fixed left-0 right-0 bg-white shadow-lg z-40 transition-all duration-500 ease-in-out overflow-hidden top-24">
      <div className="container mx-auto p-6 relative">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100">
          <X size={20} />
        </button>

        {/* Filter Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* 🟢 Category Filter */}
          <div>
            <h3 className="text-lg font-medium mb-4">Categories</h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={category}
                    className="rounded-full"
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <label htmlFor={category} className="ml-3 text-sm text-gray-700 capitalize">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* 🟢 Price Range Filter */}
          <div>
            <h3 className="text-lg font-medium mb-4">Price Range</h3>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <span className="text-gray-400">to</span>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Section */}
        <div className="mt-6 max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-500">Active filters:</span>
            
            {/* Active Category Filters */}
            {selectedCategories.map((category) => (
              <span key={category} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                {category}
                <button onClick={() => handleCategoryChange(category)} className="ml-2 text-gray-500 hover:text-gray-700">
                  <X size={14} />
                </button>
              </span>
            ))}

            {/* Active Price Filter */}
            {(minPrice || maxPrice) && (
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                Price: {minPrice || "0"} - {maxPrice || "∞"}
                <button
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </span>
            )}

            {/* Active Search Filter */}
            {searchQuery && (
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery("")} className="ml-2 text-gray-500 hover:text-gray-700">
                  <X size={14} />
                </button>
              </span>
            )}

            {/* Clear All Filters Button */}
            {(selectedCategories.length > 0 || minPrice || maxPrice || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setMinPrice("");
                  setMaxPrice("");
                  setSearchQuery("");
                }}
                className="text-sm text-blue-600 hover:text-blue-800 ml-2"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ *PropTypes for validation*
Filters.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCategories: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelectedCategories: PropTypes.func.isRequired,
  minPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setMinPrice: PropTypes.func.isRequired,
  maxPrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setMaxPrice: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

// ✅ *Export optimized component*
export default React.memo(Filters);
