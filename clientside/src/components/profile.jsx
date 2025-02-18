import "./css/home.css";
import React, { useState, useEffect } from "react";
import { Search, Heart, ShoppingBag, User } from "lucide-react";
import logo from "../assets/prada-logo-svgrepo-com.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import apiPath from "./path/apipath";
import { User as UserIcon, Box, UserCog, Plus } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile({ useremail, setEMAIL }) {
  const [user, setUser] = useState({ email: "", username: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

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

  const getProfile = async () => {
    if (!user.email) return;

    try {
      const res = await axios.post(`${apiPath()}/getuser`, { email: user.email });
      if (res.status === 200) {
        console.log("User Data:", res.data);
        setProfile(res.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user.email) {
      getProfile();
    }
  }, [user.email]);

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

  const [activeSection, setActiveSection] = useState('profile');

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
                    className=" cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-gray-200 rounded-lg"
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
      <div className="flex gap-6 p-6 bg-gray-50 min-h-screen">
        {/* Left Sidebar */}
        <div className="w-64">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-500">
                  Hello, {profile ? profile.username : "Loading..."} {/* Conditional rendering */}
                </div>
                <div className="font-medium"></div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-lg shadow-sm">
            
            <div>
              <div className="flex items-center gap-2 p-4">
                <UserCog className="w-5 h-5 text-blue-500" />
                <span className="text-gray-600">ACCOUNT SETTINGS</span>
              </div>
              <div className="pl-11 pb-2">
                <div
                  className={`py-2 cursor-pointer ${activeSection === 'profile' ? 'text-blue-500' : 'text-gray-700'}`}
                  onClick={() => setActiveSection('profile')}
                >
                  Profile Information
                </div>
                <div
                  className={`py-2 cursor-pointer ${activeSection === 'address' ? 'text-blue-500' : 'text-gray-700'}`}
                  onClick={() => setActiveSection('address')}
                >
                  Manage Addresses
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
          {activeSection === 'profile' ? (
            <>
              {profile ? ( // Conditional rendering for profile data
                <>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium">Personal Information</h2>
                      <button className="text-blue-500">Edit</button>
                    </div>
                    <input
                      type="text"
                      value={profile.username}
                      className="w-full p-2 border rounded-md bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium">Email Address</h2>
                      <button className="text-blue-500">Edit</button>
                    </div>
                    <input
                      type="email"
                      value={profile.email}
                      className="w-full p-2 border rounded-md bg-gray-50"
                      readOnly
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium">Mobile Number</h2>
                      <button className="text-blue-500">Edit</button>
                    </div>
                    <input
                      type="tel"
                      value={profile.phone}
                      className="w-full p-2 border rounded-md bg-gray-50"
                      readOnly
                    />
                  </div>
                </>
              ) : (
                <div>Loading profile data...</div> // Fallback UI while profile is being fetched
              )}
            </>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Manage Addresses</h2>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-blue-500 hover:border-blue-500 transition-colors">
                <Plus className="w-5 h-5" />
                <span>Add A New Address</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;