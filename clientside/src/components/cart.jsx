import React, { useState, useEffect } from "react";
import logo from "../assets/prada-logo-svgrepo-com.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import apiPath from "./path/apipath";
import { ToastContainer, toast } from 'react-toastify';
import { MinusCircle, PlusCircle, ChevronUp, ChevronDown, Search, Heart, ShoppingBag } from "lucide-react";

function CartPage(){
    const [user, setUser] = useState({ email: "", username: "" });
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [showSummary, setShowSummary] = useState(false);

    const products = [
        {
          name: "TOYSHOPPEE Parental Handle with Front-Back Basket",
          seller: "TOY SHOPPEE",
          originalPrice: 4999,
          price: 1099,
          discount: "78% Off",
          delivery: "Sat Mar 8",
          image: "/api/placeholder/100/100"
        },
        {
          name: "Karishma Kreations Religious Lord Jesus Crusifix Cross",
          seller: "KARISHMAKREATIONS",
          originalPrice: 999,
          price: 107,
          discount: "89% Off",
          delivery: "Wed Feb 26",
          image: "/api/placeholder/100/100"
        },
        {
          name: "Syrma Holy Bible Nail Cross Pendant",
          seller: "MURLIWALAA",
          originalPrice: 998,
          price: 174,
          discount: "82% Off",
          delivery: "Fri Feb 28",
          image: "/api/placeholder/100/100"
        }
      ];
    
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

      const PriceSummary = () => (
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Price (12 items)</span>
            <span>₹53,166</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹28,242</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span>Coupons for you</span>
            <span>-₹200</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="flex justify-between">
            <span>Protect Promise Fee</span>
            <span>₹45</span>
          </div>
          <div className="border-t pt-3 font-medium">
            <div className="flex justify-between text-lg">
              <span>Total Amount</span>
              <span>₹24,769</span>
            </div>
          </div>
          <p className="text-green-600">You will save ₹28,397 on this order</p>
        </div>
      );
    
    return(
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
      {/* Mobile Price Summary Toggle */}
      <div className="lg:hidden sticky top-0 z-10 bg-white shadow-md">
        <button 
          onClick={() => setShowSummary(!showSummary)}
          className="w-full p-4 flex justify-between items-center"
        >
          <span className="font-medium">Total: ₹24,769</span>
          {showSummary ? <ChevronUp /> : <ChevronDown />}
        </button>
        <div className={`${showSummary ? 'block' : 'hidden'} p-4 border-t`}>
          <PriceSummary />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Product List */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {products.map((product, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full sm:w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">Seller: {product.seller}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xl font-bold">₹{product.price}</span>
                      <span className="text-gray-500 line-through">₹{product.originalPrice}</span>
                      <span className="text-green-600">{product.discount}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <button className="text-gray-500">
                          <MinusCircle size={20} />
                        </button>
                        <input
                          type="number"
                          value="1"
                          className="w-12 text-center border rounded"
                        />
                        <button className="text-gray-500">
                          <PlusCircle size={20} />
                        </button>
                      </div>
                      <div className="flex gap-4">
                        <button className="text-gray-600 text-sm">SAVE FOR LATER</button>
                        <button className="text-gray-600 text-sm">REMOVE</button>
                      </div>
                    </div>
                  </div>
                  <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <p className="text-sm">Delivery by {product.delivery}</p>
                    <p className="text-green-600 text-sm">Free</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Order Summary */}
        <div className="hidden lg:block w-80 bg-white p-4 shadow-lg sticky top-0 h-screen">
          <h2 className="text-lg font-medium mb-4">PRICE DETAILS</h2>
          <div className="space-y-3">
      <div className="flex justify-between">
        <span>Price (12 items)</span>
        <span>₹53,166</span>
      </div>
      <div className="flex justify-between text-green-600">
        <span>Discount</span>
        <span>-₹28,242</span>
      </div>
      <div className="flex justify-between text-green-600">
        <span>Coupons for you</span>
        <span>-₹200</span>
      </div>
      <div className="flex justify-between">
        <span>Delivery Charges</span>
        <span className="text-green-600">Free</span>
      </div>
      <div className="flex justify-between">
        <span>Protect Promise Fee</span>
        <span>₹45</span>
      </div>
      <div className="border-t pt-3 font-medium">
        <div className="flex justify-between text-lg">
          <span>Total Amount</span>
          <span>₹24,769</span>
        </div>
      </div>
      <p className="text-green-600">You will save ₹28,397 on this order</p>
    </div>
          <button className="w-full bg-orange-500 text-white py-3 rounded mt-4">
            PLACE ORDER
          </button>
        </div>

        {/* Mobile Place Order Button */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
          <button className="w-full bg-orange-500 text-white py-3 rounded">
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>



        </>
    )
}

export default  CartPage;