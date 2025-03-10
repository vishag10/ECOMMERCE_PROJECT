import React, { useState, useEffect } from "react";
import { Search, Heart, ShoppingBag,  X, MapPin } from "lucide-react";
import logo from "../assets/prada-logo-svgrepo-com.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import apiPath from "./path/apipath";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function PageWishList(){
     const [user, setUser] = useState({ email: "", username: "", accounttype: "", _id: "" });
     const [dropdownOpen, setDropdownOpen] = useState(false);

     const [wishlistItems, setWishlistItems] = useState([
        {
          _id: "67bfe6d41227465599dc9153",
          product_name: "onion",
          product_id: "67b306414cfe885cca39497f",
          category: "vegetables",
          price: 20,
          photos: ["/api/placeholder/400/400", "/api/placeholder/400/400", "/api/placeholder/400/400"],
          quantity: 300,
          cname: "shron pvtltd",
          clocation: "nadapuram",
          __v: 1
        },
        {
          _id: "67bfe6d41227465599dc9154", 
          product_name: "tomato",
          product_id: "67b306414cfe885cca39497e",
          category: "vegetables",
          price: 15,
          photos: ["/api/placeholder/400/400", "/api/placeholder/400/400", "/api/placeholder/400/400"],
          quantity: 200,
          cname: "shron pvtltd",
          clocation: "nadapuram",
          __v: 1
        },
        {
          _id: "67bfe6d41227465599dc9155",
          product_name: "carrot",
          product_id: "67b306414cfe885cca39497d",
          category: "vegetables",
          price: 25,
          photos: ["/api/placeholder/400/400", "/api/placeholder/400/400", "/api/placeholder/400/400"],
          quantity: 250,
          cname: "shron pvtltd",
          clocation: "nadapuram",
          __v: 1
        }
      ]);
    
      
      const fadeInClasses = "opacity-0 animate-fadeIn";
      
      const removeFromWishlist = (id) => {
        setWishlistItems(wishlistItems.filter(item => item._id !== id));
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
            setUser({ email: res.data.email, username: res.data.username, accounttype: res.data.accounttype, _id: res.data._id });
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
    
    return(
        <>
            <nav className="flex items-center justify-between px-8 py-4 bg-white border-b">
                    <ToastContainer />
            
                    <Link to={"/"}><div className="flex items-center">
                              <img src={logo} className="w-18 h-16 mt-1.5" alt="Logo" />
                            </div></Link> 
            
                    <div className="hidden lg:flex items-center space-x-8">
                      <a href="#" className="text-sm font-medium hover:text-gray-600">    </a>
                      <a href="#" className="text-sm font-medium hover:text-gray-600">    </a>
                      <a href="#" className="text-sm font-medium hover:text-gray-600">    </a>
                      <a href="#" className="text-sm font-medium hover:text-gray-600">    </a>
                      <a href="#" className="text-sm font-medium hover:text-gray-600">    </a>
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
                          />
                        </div>
                        <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                          Search
                        </button>
                      </div>
                      {/* <Heart className="w-6 h-6 cursor-pointer hover:text-gray-600" />
                      <ShoppingBag className="w-6 h-6 cursor-pointer hover:text-gray-600" /> */}
            
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

                  <main className="container mx-auto px-4 py-12">
        
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-2">Favorites</h1>
          <p className="text-gray-500">Items you've added to your wishlist</p>
        </div>

       
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item, index) => (
              <div 
                key={item._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:shadow-xl hover:translate-y-1 animate-fadeIn"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.photos[0]} 
                    alt={item.product_name}
                    className="w-full h-full object-cover transition duration-500 transform hover:scale-105"
                  />
                  <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none transition duration-300 group">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500 transition duration-300 transform group-hover:scale-110" />
                  </button>
                </div>
                
               
                <div className="p-4">
                  <div className="uppercase text-xs text-gray-500 tracking-wider mb-1">{item.category}</div>
                  <h3 className="font-bold text-lg mb-2 capitalize">{item.product_name}</h3>
                  <p className="font-medium mb-3">₹{item.price}</p>
                  
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{item.clocation}</span>
                  </div>
                  
                  <div className="mt-4 flex items-center space-x-2">
                    <button className="flex-1 bg-black text-white py-3 px-4 rounded-full font-bold text-sm hover:bg-gray-800 transition duration-300">
                      ADD TO CART
                    </button>
                    <button 
                      onClick={() => removeFromWishlist(item._id)}
                      className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition duration-300"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-4">Find products you love and add them to your favorites</p>
            <button className="bg-black text-white py-3 px-8 rounded-full font-bold hover:bg-gray-800 transition duration-300">
              SHOP NOW
            </button>
          </div>
        )}
      </main>
        </>
    )
}

export default PageWishList;