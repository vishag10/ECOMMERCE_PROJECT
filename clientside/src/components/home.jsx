import "./css/home.css";
import React, { useState, useEffect, useRef } from "react";
import { Search, Heart, ShoppingBag, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";
import logo from "../assets/prada-logo-svgrepo-com.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import apiPath from "./path/apipath";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import carousel1 from "../assets/1.png"
import carousel2 from "../assets/2.png"
import carousel3 from "../assets/3.png"



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
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.photos?.[0]} 
              alt="Product"
              className={`h-full w-full object-cover object-center transition-all duration-700 ease-in-out
                ${isHovered ? 'scale-110' : 'scale-100'}`}
            />
            <button className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-100 transition-colors">
              <Heart size={20} className="text-gray-800" />
            </button>
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
};


const MainCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timeoutRef = useRef(null);
  
  
  const carouselImages = [
    carousel1,
    carousel2,
    carousel3,
    
  ];

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); 

    return () => {
      resetTimeout();
    };
  }, [currentSlide, carouselImages.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === 0 ? carouselImages.length - 1 : prevSlide - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => 
      prevSlide === carouselImages.length - 1 ? 0 : prevSlide + 1
    );
  };

  return (
    <div className="relative w-4/5 mx-auto h-48 md:h-56 lg:h-72 overflow-hidden rounded-lg shadow-md">
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {carouselImages.map((image, index) => (
          <div key={index} className="w-full h-full flex-shrink-0">
            <img 
              src={image} 
              alt={`Slide ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors"
        onClick={goToPrevSlide}
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50 hover:bg-white/80 p-2 rounded-full transition-colors"
        onClick={goToNextSlide}
      >
        <ChevronRight size={24} />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};


const CategoryCarousel = ({ title, products }) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef(null);
  const timeoutRef = useRef(null);
  
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


  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const autoScroll = () => {
      if (
        carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10
      ) {
        
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: 300, behavior: 'smooth' });
      }
    };
    
    timeoutRef.current = setInterval(autoScroll, 8000);
    
    return () => {
      if (timeoutRef.current) {
        clearInterval(timeoutRef.current);
      }
    };
  }, []);
  
  
  const handleScroll = () => {
    if (carouselRef.current) {
      setScrollPosition(carouselRef.current.scrollLeft);
    }
  };
  
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', handleScroll);
      return () => carousel.removeEventListener('scroll', handleScroll);
    }
  }, []);
  
  const showLeftArrow = scrollPosition > 20;
  const showRightArrow = carouselRef.current 
    ? scrollPosition < carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 20
    : true;
    
  if (products.length === 0) return null;
  
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex space-x-2">
          <button 
            onClick={scrollLeft}
            className={`p-2 rounded-full ${
              showLeftArrow 
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!showLeftArrow}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={scrollRight}
            className={`p-2 rounded-full ${
              showRightArrow 
                ? 'bg-gray-200 hover:bg-gray-300 text-gray-800' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={!showRightArrow}
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
        {products.map((product) => (
          <div key={product._id} className="w-64 flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};


function Home({ useremail, setEMAIL }) {
  const [user, setUser] = useState({ email: "", username: "",user_id:"" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState([]); 
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);
  
 
 const user_id=user.user_id
 console.log("hiiiiii"+user_id);
 
 

 const getProducts = async () => {
  try {
      const res = await axios.post(`${apiPath()}/getproduct`, { user_id: user.user_id });
      if (res.status === 200) {
          setProducts(res.data);
      }
  } catch (error) {
      console.error("Error fetching products:", error);
  }
};
  const categories = [
    "vegitables",
    "fruits",
    "fastfood",
    "biscuits",
    "grains"
  ];

  const navigate = useNavigate();

  const getUser = async () => {
    const token = localStorage.getItem("token");
    console.log("Token before request:", token);

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
        console.log("User Data:", res.data);
        setUser({ email: res.data.email, username: res.data.username,user_id:res.data._id });
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      if (error.response?.data?.msg === "Login time expired please login again") {
        localStorage.removeItem("token");
        setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
      }
    }
  };
  useEffect(() => {
    getUser();
  }, [useremail]);
  
  useEffect(() => {
    if (user.user_id) {
      getProducts();
    }
  }, [user.user_id]);

  useEffect(() => {
    getUser();
    getProducts();
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [useremail]);

  const handleLogout = () => {
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

    setUser({ email: "", username: "" });

    setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  
  const applyFilters = (productsToFilter) => {
    return productsToFilter.filter(product => {
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchesPrice = (!minPrice || product.price >= Number(minPrice)) && 
                           (!maxPrice || product.price <= Number(maxPrice));
      const matchesSearch = searchQuery ? 
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      
      return matchesCategory && matchesPrice && matchesSearch;
    });
  };

  
  const filteredProducts = applyFilters(products);
  
 
  const filteredProductsByCategory = {};
  categories.forEach(category => {
    
    const categoryProducts = products.filter(product => product.category === category);
   
    filteredProductsByCategory[category] = applyFilters(categoryProducts);
  });

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      
      console.log("Searching for:", searchQuery);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm transition-all duration-300">
        <ToastContainer />
        <div className="flex items-center">
          <img src={logo} className="w-18 h-16 mt-1.5" alt="Logo" />
        </div>

        <div className="hidden lg:flex items-center space-x-8">
          <a href="#" className="text-sm font-medium hover:text-gray-600">
            Offer sales
          </a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">
            Daily damaka
          </a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">
            foods
          </a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">
            Kids
          </a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">
            Sale
          </a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">
            SNKRS
          </a>
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
         <Link to={"/wishlist"}><Heart className="w-6 h-6 cursor-pointer hover:text-gray-600" /></Link> 
          <Link to={"/cart"}> <ShoppingBag className="w-6 h-6 cursor-pointer hover:text-gray-600" /></Link>

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
        {/* Left side filter icon */}
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="fixed left-4 top-29 z-50 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300"
          aria-label="Toggle filters"
        >
          <Filter size={20} />
        </button>

        {/* Filter dropdown */}
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

            {/* Active filters display */}
            <div className="mt-6 max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-gray-500">Active filters:</span>
                
                {/* Category filters */}
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
                
                {/* Price filter */}
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
                
                {/* Search filter */}
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
                
                {/* Clear all */}
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

        {/* Main Image Carousel */}
        <div className="mt-10 mb-10  ">
          <MainCarousel />
        </div>

        {/* Category Product Carousels - now using filtered products */}
        <div className="w-4/5 mx-auto space-y-10">
          {/* Show filter result summary if filters are active */}
          {(selectedCategories.length > 0 || minPrice || maxPrice || searchQuery) && (
            <div className="text-sm text-gray-500 mb-4">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} 
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedCategories.length > 0 && ` in ${selectedCategories.length} ${selectedCategories.length === 1 ? 'category' : 'categories'}`}
              {(minPrice || maxPrice) && ` priced ${minPrice ? `from ₹${minPrice}` : ''} ${maxPrice ? `to ₹${maxPrice}` : ''}`}
            </div>
          )}

          {/* Display Filtered Category Carousels */}
          {categories.map(category => (
            <div key={category}>
              {filteredProductsByCategory[category]?.length > 0 && (
                <CategoryCarousel 
                  title={category.charAt(0).toUpperCase() + category.slice(1)} 
                  products={filteredProductsByCategory[category]} 
                />
              )}
            </div>
          ))}

          {/* Display "All Products" grid if no categories have products after filtering */}
          {categories.every(category => !filteredProductsByCategory[category]?.length) && filteredProducts.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold mb-6 text-gray-900">All Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product._id} className="transform transition-all duration-500 ease-in-out" style={{
                    opacity: 1 - Math.min(0.3, scrollY / 1000),
                    transform: `translateY(${Math.min(20, scrollY / 50)}px)`
                  }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
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
      </div>

      {/* CSS for hiding scrollbars but allowing scroll functionality */}
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
       <footer className="bg-black text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">ABOUT PRADA</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Sustainability</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">GET HELP</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Order Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Shipping & Delivery</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Returns</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">SHOP</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Vegetables</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Fruits</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Dairy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Groceries</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">FOLLOW US</h4>
              <div className="flex space-x-4">
                <a href="#" className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded-full flex items-center justify-center transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17v-6H9v-2h2V9.5C11 7.57 12.57 6 14.5 6H16v2h-1.5c-.55 0-1 .45-1 1v2H16v2h-2.5v6H11z" />
                  </svg>
                </a>
                <a href="#" className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded-full flex items-center justify-center transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8a1.25 1.25 0 0 1-1.25-1.25A1.25 1.25 0 0 1 17.25 5.5zM12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                  </svg>
                </a>
                <a href="#" className="bg-gray-700 hover:bg-gray-600 w-10 h-10 rounded-full flex items-center justify-center transition">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-gray-400">
            <p>© 2025 prada PvtLtd. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Home;