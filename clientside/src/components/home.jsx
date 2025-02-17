import "./css/home.css";
import React, { useState, useEffect } from "react";
import { Search, Heart, ShoppingBag, User } from "lucide-react";
import logo from "../assets/prada-logo-svgrepo-com.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import apiPath from "./path/apipath";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home({ useremail, setEMAIL }) {
  const [user, setUser] = useState({ email: "", username: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
  }, [useremail]);

 const handleLogout = () => {
     localStorage.removeItem("token");
     localStorage.removeItem("useremail");
   
     toast.error("Logged out!", {
       position: "top-right",
       autoClose: 3000, // Shorter duration
       hideProgressBar: false,
       closeOnClick: true,
       pauseOnHover: true,
       draggable: true,
       theme: "dark",
     });
   
     // setEMAIL("");
     setUser({ email: "", username: "" });
   
     setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
 
   };

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b">
        <ToastContainer />
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} className="w-18 h-16 mt-1.5" alt="Logo" />
        </div>

        {/* Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          <a href="#" className="text-sm font-medium hover:text-gray-600">
            New & Featured
          </a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">
            Men
          </a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">
            Women
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

        {/* Right Section */}
        <div className="flex items-center space-x-6 relative">
          {/* Search Bar */}
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

          {/* Profile Section */}
          {user.username ? (
            <div className="relative">
              {/* Profile Circle */}
              <button
                className="w-10 h-10 flex items-center justify-center text-white font-semibold rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.username.charAt(0).toUpperCase()}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                  <button
                    className=" cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>
                  <button
                    className=" cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
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
    </>
  );
}

export default Home;
