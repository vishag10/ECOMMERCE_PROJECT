import React, { useState, useEffect } from "react";
import axios from "axios";
import apiPath from "./path/apipath";
import { useNavigate } from "react-router-dom";

function AdminHome() {
  const [admin, setUser] = useState({ email: "", username: "", admin_id: "" });
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();

  const getAdmin = async () => {
    const token = localStorage.getItem("token");
    console.log("Token before request:", token);

    if (!token) {
      setTimeout(() => navigate("/adminlogin"), 3000);
      return;
    }

    try {
      const res = await axios.get(`${apiPath()}/home`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        console.log("User Data:", res.data);
        setUser({
          email: res.data.email,
          username: res.data.username,
          admin_id: res.data.admin_id,
        });
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      if (
        error.response?.data?.msg === "Login time expired please login again"
      ) {
        localStorage.removeItem("token");
        setTimeout(() => navigate("/adminlogin"), 3000);
      }
    }
  };

  useEffect(() => {
    getAdmin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/adminlogin");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  console.log(admin);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="font-bold text-xl">Admin Dashboard</div>
          <div className="relative">
            <img
              src={`https://ui-avatars.com/api/?name=${admin.username}&background=random`}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer border-2 border-white"
              onClick={toggleDropdown}
            />
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{admin.username}</p>
                  <p className="text-xs text-gray-500 truncate">{admin.email}</p>
                </div>
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col items-center">
              <img
                src={`https://ui-avatars.com/api/?name=${admin.username}&background=random`}
                alt="Profile"
                className="w-16 h-16 rounded-full mb-2"
              />
              <h3 className="font-medium text-gray-800">{admin.username}</h3>
              <p className="text-xs text-gray-500">{admin.email}</p>
            </div>
          </div>
          <div className="mt-4">
            <div
              className={`px-4 py-3 cursor-pointer ${
                activeTab === "products"
                  ? "bg-blue-100 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("products")}
            >
              <span>Products</span>
            </div>
            <div
              className={`px-4 py-3 cursor-pointer ${
                activeTab === "sellers"
                  ? "bg-blue-100 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("sellers")}
            >
              <span>Sellers</span>
            </div>
            <div
              className={`px-4 py-3 cursor-pointer ${
                activeTab === "buyers"
                  ? "bg-blue-100 text-blue-600 border-l-4 border-blue-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("buyers")}
            >
              <span>Buyers</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {activeTab === "products" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Products Management</h2>
              <p className="text-gray-600 mb-6">View and manage all products in the system.</p>
              <div className="bg-white rounded-md shadow-md p-6">
                {/* Products content will go here */}
                <p className="text-gray-500">Product listing and management interface</p>
              </div>
            </div>
          )}
          {activeTab === "sellers" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Sellers Management</h2>
              <p className="text-gray-600 mb-6">View and manage all sellers in the system.</p>
              <div className="bg-white rounded-md shadow-md p-6">
                {/* Sellers content will go here */}
                <p className="text-gray-500">Seller listing and management interface</p>
              </div>
            </div>
          )}
          {activeTab === "buyers" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Buyers Management</h2>
              <p className="text-gray-600 mb-6">View and manage all buyers in the system.</p>
              <div className="bg-white rounded-md shadow-md p-6">
                {/* Buyers content will go here */}
                <p className="text-gray-500">Buyer listing and management interface</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminHome;