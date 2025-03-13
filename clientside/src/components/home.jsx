import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Search, Heart, ShoppingBag, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import logo from "../assets/prada-logo-svgrepo-com.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import apiPath from "./path/apipath";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Footer from "./Footer";
import MainCarousel from "./Carousel";
import MainCarouselZero from "./carousal2";


const SpecialDiscountSection = React.memo(({ products }) => {
  // Filter only products that have a discount
  const discountedProducts = products.filter(product => product.discount);
  
  if (discountedProducts.length === 0) return null;
  
  return (
    <div className="w-4/5 mx-auto my-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 relative inline-block">
          Special Discounts
          <span className="absolute -bottom-2 left-0 w-full h-1 bg-red-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
        </h2>
        <p className="text-gray-500 mt-2">Limited time offers you don't want to miss!</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-8">
        {discountedProducts.slice(0, 8).map((product) => (
          <Link to={`/product/${product._id}`} key={product._id}>
            <div className="group relative">
              {/* Circular product image */}
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-200 shadow-md hover:shadow-lg hover:border-gray-300 transition-all duration-300">
                <img
                  src={product.photos?.[0]} 
                  alt={product.product_name}
                  className="h-full w-full object-cover object-center transition-all duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              
              {/* Discount badge positioned at bottom right of circle */}
              <div className="absolute -bottom-2 -right-2 bg-red-500 text-white font-bold text-sm w-12 h-12 flex items-center justify-center rounded-full shadow-lg">
                {product.discount}%
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});



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
}, (prevProps, nextProps) => {
  // Only re-render if the product ID changes
  return prevProps.product._id === nextProps.product._id;
});

<MainCarousel/>
const CategoryCarousel = React.memo(({ title, products }) => {
  const carouselRef = useRef(null);
  
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
    
  if (products.length === 0) return null;

  const displayProducts = products.slice(0, 10);
  
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex space-x-2">
          <button 
            onClick={scrollLeft}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={scrollRight}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto pb-4 gap-6 hide-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {displayProducts.map((product) => (
          <div key={product._id} className="w-64 flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if title or products array changes
  return prevProps.title === nextProps.title && 
         prevProps.products.length === nextProps.products.length;
});

function Home({ useremail, setEMAIL }) {
  const [user, setUser] = useState({ email: "", username: "", user_id: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const getProducts = useCallback(async () => {
    if (!user.user_id) return;
    
    try {
      const res = await axios.post(`${apiPath()}/getproduct`, { user_id: user.user_id });
      if (res.status === 200) {
        setProducts(res.data);

        const uniqueCategories = [...new Set(res.data.map(product => product.category))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, [user.user_id]);

  const getUser = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
      return;
    }

    try {
      const res = await axios.get(`${apiPath()}/homebuyerseller`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setUser({ 
          email: res.data.email, 
          username: res.data.username, 
          user_id: res.data._id 
        });
      }
    } catch (error) {
      if (error.response?.data?.msg === "Login time expired please login again") {
        localStorage.removeItem("token");
        setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
      }
    }
  }, [navigate]);

  useEffect(() => {
    getUser();
  }, [useremail, getUser]);

  useEffect(() => {
    if (user.user_id) {
      getProducts();
    }
  }, [user.user_id, getProducts]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("useremail");

    toast.error("Logged out!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });

    setUser({ email: "", username: "", user_id: "" });
    setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
  }, [navigate]);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  const applyFilters = useCallback((productsToFilter) => {
    return productsToFilter.filter(product => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice = (!minPrice || product.price >= Number(minPrice)) && 
                        (!maxPrice || product.price <= Number(maxPrice));
      const matchesSearch = !searchQuery || 
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [selectedCategories, minPrice, maxPrice, searchQuery]);

  const filteredProducts = useMemo(() => applyFilters(products), 
    [products, applyFilters]);

  const filteredProductsByCategory = useMemo(() => {
    const result = {};
    categories.forEach(category => {
      const categoryProducts = products.filter(product => product.category === category);
      result[category] = applyFilters(categoryProducts);
    });
    return result;
  }, [products, applyFilters, categories]);

  const handleSearch = useCallback((e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      console.log("Searching for:", searchQuery);
    }
  }, [searchQuery]);


  const handleUnavailable=async()=>{
    toast.warn("currently unavailable", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm transition-all duration-300">
        <ToastContainer />
        <div className="flex items-center">
          <img src={logo} className="w-18 h-16 mt-1.5" alt="Logo" />
        </div>

        <div className="hidden lg:flex items-center space-x-8">
         <button onClick={handleUnavailable}><a href="#" className="text-sm font-medium hover:text-gray-600">Offer sales</a></button> 
          <button onClick={handleUnavailable}><a href="#" className="text-sm font-medium hover:text-gray-600">Daily damaka</a></button>
          <button onClick={handleUnavailable}><a href="#" className="text-sm font-medium hover:text-gray-600">foods</a></button>
          <button onClick={handleUnavailable}><a href="#" className="text-sm font-medium hover:text-gray-600">combo</a></button>
          <button onClick={handleUnavailable}><a href="#" className="text-sm font-medium hover:text-gray-600">Sale</a></button>
          <a href="#" className="text-sm font-medium hover:text-gray-600">    </a>
        </div>

        <div className="flex items-center space-x-6 relative">
          <div className="hidden md:flex items-center bg-gray-100 rounded-full">
            <div className="flex items-center px-4 py-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent border-none outline-none ml-2 text-sm w-32"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
              />
            </div>
            <button 
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
          <Link to={"/cart"}><ShoppingBag className="w-6 h-6 cursor-pointer hover:text-gray-600" /></Link>

          {user.username ? (
            <div className="relative">
              <button
                className="cursor-pointer w-10 h-10 flex items-center justify-center text-white font-semibold rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.username.charAt(0).toUpperCase()}
              </button>

              {dropdownOpen && (
                <div className="z-50 absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                  <button
                    className="cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-200 rounded-lg"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>
                  <button
                    className="cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-200 rounded-lg"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={"/buyerorsellerlogin"}
              className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
      <div className="flex min-h-screen bg-white pt-24 flex-col">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="fixed left-4 top-29 z-50 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300"
          aria-label="Toggle filters"
        >
          <Filter size={20} />
        </button>
        <div 
          className={`fixed left-0 right-0 bg-white shadow-lg z-40 transition-all duration-500 ease-in-out overflow-hidden
            ${isFilterOpen ? 'top-24 max-h-screen' : 'top-24 max-h-0'}`}
        >
          <div className="container mx-auto p-6 relative">
            <button
              onClick={() => setIsFilterOpen(false)}
              className="absolute right-6 top-6 p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
            <div className="mt-6 max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500">Active filters:</span>
                
               
                {selectedCategories.map(category => (
                  <span key={category} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                    {category}
                    <button 
                      onClick={() => handleCategoryChange(category)} 
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                {(minPrice || maxPrice) && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                    Price: {minPrice || '0'} - {maxPrice || '∞'}
                    <button 
                      onClick={() => {
                        setMinPrice('');
                        setMaxPrice('');
                      }} 
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {searchQuery && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                    Search: {searchQuery}
                    <button 
                      onClick={() => setSearchQuery('')} 
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {(selectedCategories.length > 0 || minPrice || maxPrice || searchQuery) && (
                  <button 
                    onClick={() => {
                      setSelectedCategories([]);
                      setMinPrice('');
                      setMaxPrice('');
                      setSearchQuery('');
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
        <div className="mt-10 mb-10">
          <MainCarousel />
        </div>
        <SpecialDiscountSection products={products} />
        <div className="w-4/5 mx-auto space-y-10">

         
          {(selectedCategories.length > 0 || minPrice || maxPrice || searchQuery) && (
            <div className="text-sm text-gray-500 mb-4">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} 
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedCategories.length > 0 && ` in ${selectedCategories.length} ${selectedCategories.length === 1 ? 'category' : 'categories'}`}
              {(minPrice || maxPrice) && ` priced ${minPrice ? `from ₹${minPrice}` : ''} ${maxPrice ? `to ₹${maxPrice}` : ''}`}
            </div>
          )}
          {categories.map(category => (
            filteredProductsByCategory[category]?.length > 0 && (
              <CategoryCarousel 
                key={category}
                title={category.charAt(0).toUpperCase() + category.slice(1)} 
                products={filteredProductsByCategory[category]} 
              />
            )
          ))}
          {categories.every(category => !filteredProductsByCategory[category]?.length) && filteredProducts.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-6 text-gray-900">All Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product._id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )} 
           
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-500 mb-4">No products found matching your filters.</p>
              <button 
                onClick={() => {
                  setSelectedCategories([]);
                  setMinPrice('');
                  setMaxPrice('');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
        <div className="mt-10 mb-10">
        <h2 className="text-xl font-bold mb-6 text-gray-900" style={{ marginLeft: "10%" }}>
  Reviews
</h2>

          <MainCarouselZero/>
        </div>
      </div>
      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Footer */}
      <Footer/>
    </>
  );
}

export default React.memo(Home);