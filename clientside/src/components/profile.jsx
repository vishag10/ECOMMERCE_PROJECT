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
import { Trash } from "lucide-react";

function Profile({ useremail, setEMAIL }) {
  const [user, setUser] = useState({ email: "", username: "", accounttype: "", _id: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();
  const [updateuser, setupdateUser] = useState({ email: "", username: "", phone: "" });
  const [address, setAddress] = useState([]); 


  const deleteAddress =async (_id)=>{
      try {
        const res = await axios.delete(`${apiPath()}/deleteaddress/${_id}`)
        const {msg}=res.data;
        if (res.status === 200) {
          const { msg } = res.data;
          toast.success(msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => window.location.reload(), 3000);
        }

      } catch (error) {
        console.log(error);
        
      }
  }
  

  const getAddress = async () => {
    const token = localStorage.getItem("token");
    console.log("Token before request:", token);

    if (!token) {
      setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
      return;
    }

    try {
      const res = await axios.get(`${apiPath()}/getaddress/${user._id}`);
      if (res.status === 200) {
        console.log("address:", res.data);
        setAddress(res.data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getAddress();
  }, [user._id]);

  const [isEditing, setIsEditing] = useState({
    username: false,
    email: false,
    phone: false
  });

  const toggleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${apiPath()}/sellerupdate`, profile);
      if (res.status === 200) {
        const { msg } = res.data;
        toast.success(msg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => window.location.reload(), 3000);
      }
    } catch (error) {
      console.log(error);
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

  const getProfile = async () => {
    if (!user.email) return;

    try {
      const res = await axios.post(`${apiPath()}/getuser`, { email: user.email });
      if (res.status === 200) {
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

  const [activeSection, setActiveSection] = useState('profile');

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

      <div className="flex gap-6 p-6 bg-gray-50 min-h-screen">
        <div className="w-64">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm text-gray-500">
                  Hello, {profile ? profile.username : "Loading..."}
                </div>
              </div>
            </div>
          </div>

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
              {user.accounttype === "seller" ? (
                <div className="flex flex-col items-center space-y-3">
                  <Link to={"/sellitem"} state={{ _id: user._id }}>
                    <button className="cursor-pointer w-40 px-4 py-2 text-sm bg-[#1877F2] text-white rounded-md hover:bg-[#166FE5] transition">
                      Sell Item
                    </button>
                  </Link>
                 <Link to={`/sellerproducts/${user._id}`}> <button className="cursor-pointer w-40 px-4 py-2 text-sm bg-[#1877F2] text-white rounded-md hover:bg-[#166FE5] transition">
                    Sell Status
                  </button></Link>
                  <button className="cursor-pointer mb-2 w-40 px-4 py-2 text-sm bg-[#1877F2] text-white rounded-md hover:bg-[#166FE5] transition">
                    Order Status
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3">
                  <button className="cursor-pointer mb-2 w-40 px-4 py-2 text-sm bg-[#1877F2] text-white rounded-md hover:bg-[#166FE5] transition">
                    Order Status
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
          {activeSection === 'profile' ? (
            <>
              {profile ? (
                <>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium">Personal Information</h2>
                      <button
                        className="cursor-pointer text-blue-500"
                        onClick={() => {
                          toggleEdit("username");
                          if (isEditing.username) handleUpdate();
                        }}
                      >
                        {isEditing.username ? "Save" : "Edit"}
                      </button>
                    </div>
                    <input
                      type="text"
                      name="username"
                      value={profile.username}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded-md bg-gray-50"
                      readOnly={!isEditing.username}
                    />
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium">Email Address</h2>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded-md bg-gray-50"
                      readOnly={!isEditing.email}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium">Mobile Number</h2>
                      <button
                        className="cursor-pointer text-blue-500"
                        onClick={() => {
                          toggleEdit("phone");
                          if (isEditing.phone) handleUpdate();
                        }}
                      >
                        {isEditing.phone ? "Save" : "Edit"}
                      </button>
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded-md bg-gray-50"
                      readOnly={!isEditing.phone}
                    />
                  </div>
                </>
              ) : (
                <div>Loading profile data...</div>
              )}
            </>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium">Manage Addresses</h2>
              </div>
              <Link to={"/address"} state={{ _id: user._id }}>
                <button className="cursor-pointer flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-blue-500 hover:border-blue-500 transition-colors">
                  <Plus className="w-5 h-5" />
                  <span>Add A New Address</span>
                </button>
              </Link>

              <div className="mt-4 space-y-4">
                {address.map((addr, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-lg shadow-sm bg-gray-50">
                    <div>
                      <p className="font-semibold">{addr.line}</p>
                      <p className="text-sm text-gray-600">{addr.district}, {addr.pincode}</p>
                      <p className="text-sm text-gray-600">Phone: {addr.phone}</p>
                    </div>
                    <button className="p-2 text-red-500 hover:text-red-700" onClick={() => deleteAddress(addr._id)}>
                      <Trash className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;