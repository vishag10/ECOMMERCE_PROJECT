import React, { useState, useEffect } from "react";
import logo from "../assets/prada-logo-svgrepo-com.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import apiPath from "./path/apipath";
import { ToastContainer, toast } from 'react-toastify';
import { Plus, Minus, ShoppingCart, Search, Heart, ShoppingBag } from "lucide-react";

function Product() {
  const [user, setUser] = useState({ email: "", username: "", accounttype: "", _id: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const { _id } = useParams();

  const getproduct = async () => {
    try {
      const res = await axios.get(`${apiPath()}/oneproduct/${_id}`);
      console.log(res.data);
      setProduct(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getUser = async () => {
    const token = localStorage.getItem("token");
    console.log("Token before request:", token);

    try {
      const res = await axios.get(`${apiPath()}/homebuyerseller`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        console.log("User Data:", res.data);
        setUser({
          email: res.data.email,
          username: res.data.username,
          accounttype: res.data.accounttype,
          _id: res.data._id,
        });
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
    getproduct();
  }, []);

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

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const variants = product.photos
    ? [
        { id: 1, img: product.photos[0], color: "Blue" },
        { id: 2, img: product.photos[0], color: "Silver" },
        { id: 3, img: product.photos[0], color: "Green" },
        { id: 4, img: product.photos[0], color: "Black" },
      ]
    : [];

  const handleQuantityChange = (increment) => {
    setQuantity(prev => Math.max(1, prev + increment));
  };

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b">
        <ToastContainer />
        <div className="flex items-center">
          <img src={logo} className="w-18 h-16 mt-1.5" alt="Logo" />
        </div>

        <div className="hidden lg:flex items-center space-x-8">
          <a href="#" className="text-sm font-medium hover:text-gray-600">New & Featured</a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">Men</a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">Women</a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">Kids</a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">Sale</a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">SNKRS</a>
        </div>

        <div className="flex items-center space-x-6 relative">
          <div className="hidden md:flex items-center bg-gray-100 rounded-full">
            <div className="flex items-center px-4 py-2">
              <Search className="w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search"
                className="bg-transparent border-none outline-none ml-2 text-sm w-32"
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
              className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
         
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-sm p-4 lg:p-8">
            
            <div className="relative">
              <div className="sticky top-8">
                <img 
                  src={product.photos ? product.photos[0] : ""} 
                  alt="Watch" 
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </div>
            </div>

         
            <div className="space-y-6 lg:space-y-8">
              
              

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">New</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.product_name}</h1>
                <p className="text-gray-600 text-lg">
                  {product.description || "CONQUEST, L3.720.4.92.6, Automatic watch, ∅ 38.00 mm, Stainless steel. Date, Self-winding mechanical movement beating at 25'200 vibrations per hour"}
                </p>
              </div>

              
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">Available Variations</h2>
                <div className="flex flex-wrap gap-4">
                  {variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(index)}
                      className={`w-20 h-20 rounded-xl transition-transform transform hover:scale-105 ${
                        selectedVariant === index 
                          ? 'ring-2 ring-blue-500 ring-offset-2' 
                          : 'ring-1 ring-gray-200'
                      }`}
                    >
                      <img 
                        src={variant.img} 
                        alt={variant.color} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </button>
                  ))}
                </div>
              </div>

            
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">Quantity</h2>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 rounded-full border hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={24} />
                  </button>
                  <span className="text-2xl font-medium w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 rounded-full border hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl lg:text-4xl font-bold text-gray-900">₹{product.price || "203,000.00"}</p>
                  <span className="text-gray-500">inclusive of all taxes</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg font-medium">
                    <ShoppingCart size={24} />
                    Add to Cart
                  </button>
                  <button className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-colors text-lg font-medium">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;