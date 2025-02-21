import "./css/home.css";
import React, { useState, useEffect } from "react";
import { Search, Heart, ShoppingBag, Filter, X } from "lucide-react";
import logo from "../assets/prada-logo-svgrepo-com.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import apiPath from "./path/apipath";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
   <Link> <div 
      className="group relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="border-none shadow-none hover:shadow-none bg-transparent">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
          <img
            src={product.photos?.[0] } 
            alt="Product"
            className={`h-full w-full object-cover object-center transition-all duration-700 ease-in-out
              ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          <button className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-gray-100 transition-colors">
            <Heart size={20} className="text-gray-800" />
          </button>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium text-gray-900">{product.product_name}</h3>
            <span className="text-lg font-medium text-gray-900">${product.price}</span>
          </div>
          <p className="text-sm text-gray-500">{product.category}</p>
        </div>
      </div>
    </div></Link>
  );
};

function Home({ useremail, setEMAIL }) {
  const [user, setUser] = useState({ email: "", username: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState([]); // Initialize as empty array
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getProducts = async () => {
    try {
      const res = await axios.get(`${apiPath()}/getproduct`);
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
        setUser({ email: res.data.email, username: res.data.username });
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
    getProducts();
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

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesPrice = (!minPrice || product.price >= minPrice) && (!maxPrice || product.price <= maxPrice);
    const matchesSearch = product.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPrice && matchesSearch;
  });

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b">
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
              />
            </div>
            <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full text-sm font-medium transition-colors">
              Search
            </button>
          </div>
          <Heart className="w-6 h-6 cursor-pointer hover:text-gray-600" />
          <ShoppingBag className="w-6 h-6 cursor-pointer hover:text-gray-600" />

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

      <div className="flex min-h-screen bg-white">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="fixed right-4 top-4 z-50 lg:hidden bg-white p-2 rounded-full shadow-lg"
        >
          <Filter size={24} />
        </button>

        <div className={`fixed lg:relative right-0 top-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 
          ${isFilterOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
          
          <button
            onClick={() => setIsFilterOpen(false)}
            className="lg:hidden absolute right-4 top-4"
          >
            <X size={24} />
          </button>

          <div className="p-8">
            <h2 className="text-xl font-bold mb-8">Filters</h2>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Categories</h3>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input 
                      type="checkbox" 
                      id={category} 
                      className="rounded-full"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                    />
                    <label htmlFor={category} className="ml-3 text-sm text-gray-700">
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
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
        </div>

        <div className="flex-1 px-6 py-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-w-7xl mx-auto">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <p className="text-center text-gray-500">No products found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;