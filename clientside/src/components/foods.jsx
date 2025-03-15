import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiPath from './path/apipath';
import logo from "../assets/prada-logo-svgrepo-com.svg";
import { Search, ShoppingBag } from 'lucide-react'; // Using lucide-react icons

export default function Foods() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", username: "", user_id: "" });
  const [products, setProducts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredProductId, setHoveredProductId] = useState(null);

  const getUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
      return;
    }
    try {
      const res = await axios.get(`${apiPath()}/homebuyerseller`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setUser({ email: res.data.email, username: res.data.username, user_id: res.data._id });
      }
    } catch (error) {
      if (error.response?.data?.msg === "Login time expired please login again") {
        localStorage.removeItem("token");
        setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
      }
    }
  }, [navigate]);

  const getProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${apiPath()}/getproducts`);
      if (res.status === 200) {
        // Filter for only food category items
        const foodProducts = res.data.filter(product => product.category === "food");
        setProducts(foodProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    }
  }, []);

  useEffect(() => {
    getUser();
    getProducts();
  }, [getUser, getProducts]);

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

    setUser({ email: "", username: "", user_id: "" });
    setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter(product => 
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      <ToastContainer />
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 py-4 bg-white border-b shadow-sm">
        <Link to={"/"}>
          <div className="flex items-center">
            <img src={logo} className="w-14 h-12 md:w-18 md:h-16 mt-1.5" alt="Logo" />
          </div>
        </Link>

        <div className="flex items-center space-x-3 md:space-x-6 relative">
          <div className="flex items-center bg-gray-100 rounded-full">
            <div className="flex items-center px-2 md:px-4 py-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search foods..."
                value={searchQuery}
                onChange={handleSearch}
                className="bg-transparent border-none outline-none ml-2 text-sm w-24 md:w-32"
              />
            </div>
          </div>
          
          <Link to={"/cart"}>
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-amber-600 transition-colors" />
          </Link>

          {user.username ? (
            <div className="relative">
              <button
                className="cursor-pointer w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white font-semibold rounded-full bg-amber-600 hover:bg-amber-700 focus:outline-none transition-colors"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.username.charAt(0).toUpperCase()}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
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
              className="bg-amber-600 text-white px-4 md:px-6 py-2 rounded-full text-sm font-medium hover:bg-amber-700 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* Header Section */}
      <div className="bg-amber-100 py-6 md:py-12 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-bold text-amber-800">Delicious Food Selections</h1>
          <p className="mt-2 md:mt-4 text-sm md:text-base text-amber-700">Explore our curated collection of fresh and authentic food items</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No food products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id}>
                <div
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                  onMouseEnter={() => setHoveredProductId(product._id)}
                  onMouseLeave={() => setHoveredProductId(null)}
                >
                  <div className="h-48 sm:h-56 relative overflow-hidden">
                    <img
                      src={product.photos?.[0] || "/placeholder-food.jpg"}
                      alt={product.product_name || "Food Item"}
                      className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${
                        hoveredProductId === product._id ? "scale-110" : "scale-100"
                      }`}
                      loading="lazy"
                    />
                    {product.discount && (
                      <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1 m-2 rounded-full shadow-lg transform -rotate-12 font-medium text-sm">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                          {product.product_name || "Unnamed Product"}
                        </h3>
                        <span className="text-lg font-bold text-amber-600">
                          ₹{product.price || "N/A"}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span>{product.cname || "Unknown Vendor"}</span>
                        <span className="mx-2">•</span>
                        <span>{product.clocation || "Unknown Location"}</span>
                      </div>
                      
                      {product.quantity && product.quantity < 20 ? (
                        <p className="text-xs text-red-500 font-medium">
                          Only {product.quantity} left in stock!
                        </p>
                      ) : null}
                    </div>
                    
                    <button className="mt-3 w-full bg-amber-100 hover:bg-amber-200 text-amber-800 font-medium py-2 rounded-lg transition-colors text-sm">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-amber-800 text-amber-100 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="text-center">
            <p className="text-sm">© {new Date().getFullYear()} Food Category Store. All rights reserved.</p>
            <p className="text-xs mt-2">Enjoy our delicious food selections!</p>
          </div>
        </div>
      </footer>
    </div>
  );
}