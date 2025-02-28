import React, { useState, useEffect } from "react";
import axios from "axios";
import apiPath from "./path/apipath";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminHome() {
  const [admin, setUser] = useState({ email: "", username: "", admin_id: "" });
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);

  const handleBlockUser = async(user_id) => {
    try {
      const res = await axios.put(`${apiPath()}/blockuser`, { user_id }); 
    
      if (res.status === 200) {
  
        setSellers(sellers.map(seller => 
          seller._id === user_id ? { ...seller, isBlocked: !seller.isBlocked } : seller
        ));
        
        setBuyers(buyers.map(buyer => 
          buyer._id === user_id ? { ...buyer, isBlocked: !buyer.isBlocked } : buyer
        ));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user status. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }
  
  const fetchUsers = async () => {
    try {
      const sellerRes = await axios.get(`${apiPath()}/getseller`);
      
      if (sellerRes.status === 200) {
        setSellers(sellerRes.data);
      }
  
      const buyerRes = await axios.get(`${apiPath()}/getbuyer`);
      
      if (buyerRes.status === 200) {
        setBuyers(buyerRes.data);
      }
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const res = await axios.delete(`${apiPath()}/deleteproduct/${productId}`);
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
      toast.error("Failed to delete product. Please try again later.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  
  const getProducts = async () => {
    try {
      const res = await axios.get(`${apiPath()}/allproductsadmin`);
      if (res.status === 200) {
        setProducts(res.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getProducts();
    fetchUsers();
  }, []); 
  
  useEffect(() => {
    console.log("Sellers:", sellers);
    console.log("Buyers:", buyers);
  }, [sellers, buyers]);
  
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
    toast.error("Logged out!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
    setTimeout(() =>  navigate("/adminlogin"), 3000);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <ToastContainer />
      {/* Fixed Navigation Bar */}
      <nav className="bg-blue-600 text-white p-4 shadow-md fixed top-0 left-0 right-0 z-10">
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

      {/* Main Content - Adjusted for fixed navbar */}
      <div className="flex pt-16 flex-1">
        {/* Fixed Sidebar */}
        <div className="w-64 bg-white shadow-md fixed left-0 top-16 bottom-0 overflow-y-auto">
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

        {/* Scrollable Content Area - Adjusted to account for fixed sidebar */}
        <div className="flex-1 ml-64 p-6 overflow-y-auto">
          {activeTab === "products" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Products Management</h2>
              <p className="text-gray-600 mb-6">View and manage all products in the system.</p>
              <div className="bg-white rounded-md shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Product Listing</h3>
                
                {products && products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <div key={product._id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <div className="h-48 bg-gray-200 overflow-hidden">
                         
                            <img 
                              src={product.photos[0]} 
                              alt={product.product_name} 
                              className="w-full h-full object-cover"
                            />
                          
                        </div>
                        
                        <div className="p-4">
                          <h4 className="font-semibold text-lg mb-1">{product.product_name}</h4>
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Category:</span> {product.category}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Price:</span> ₹{product.price}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Quantity:</span> {product.quantity} units
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            <span className="font-medium">Seller:</span> {product.cname}
                          </div>
                          
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition-colors"
                          >
                            Delete Product
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {products ? "No products found" : "Loading products..."}
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "sellers" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Sellers Management</h2>
              <p className="text-gray-600 mb-6">View and manage all sellers in the system.</p>
              <div className="bg-white rounded-md shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Seller Listing</h3>
                
                {sellers && sellers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sellers.map((seller) => (
                      <div key={seller._id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <div className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                              {seller.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">{seller.username}</h4>
                              <div>
                                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  Seller
                                </span>
                                {seller.isBlocked && (
                                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full ml-1">
                                    Blocked
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex">
                              <span className="font-medium w-20">Email:</span>
                              <span className="text-gray-700">{seller.email}</span>
                            </div>
                            <div className="flex">
                              <span className="font-medium w-20">Phone:</span>
                              <span className="text-gray-700">{seller.phone}</span>
                            </div>
                            <div className="flex">
                              <span className="font-medium w-20">ID:</span>
                              <span className="text-gray-700 text-xs truncate">{seller._id}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleBlockUser(seller._id)}
                            className={`w-full ${seller.isBlocked 
                              ? "bg-green-500 hover:bg-green-600" 
                              : "bg-red-500 hover:bg-red-600"} 
                              text-white py-2 rounded transition-colors`}
                          >
                            {seller.isBlocked ? "Unblock Seller" : "Block Seller"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {sellers ? "No sellers found" : "Loading sellers..."}
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "buyers" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Buyers Management</h2>
              <p className="text-gray-600 mb-6">View and manage all buyers in the system.</p>
              <div className="bg-white rounded-md shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Buyer Listing</h3>
                
                {buyers && buyers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {buyers.map((buyer) => (
                      <div key={buyer._id} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                        <div className="p-6">
                          <div className="flex items-center mb-4">
                            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                              {buyer.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg">{buyer.username}</h4>
                              <div>
                                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  Buyer
                                </span>
                                {buyer.isBlocked && (
                                  <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full ml-1">
                                    Blocked
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            <div className="flex">
                              <span className="font-medium w-20">Email:</span>
                              <span className="text-gray-700">{buyer.email}</span>
                            </div>
                            <div className="flex">
                              <span className="font-medium w-20">Phone:</span>
                              <span className="text-gray-700">{buyer.phone}</span>
                            </div>
                            <div className="flex">
                              <span className="font-medium w-20">ID:</span>
                              <span className="text-gray-700 text-xs truncate">{buyer._id}</span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => handleBlockUser(buyer._id)}
                            className={`w-full ${buyer.isBlocked 
                              ? "bg-green-500 hover:bg-green-600" 
                              : "bg-red-500 hover:bg-red-600"} 
                              text-white py-2 rounded transition-colors`}
                          >
                            {buyer.isBlocked ? "Unblock Buyer" : "Block Buyer"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {buyers ? "No buyers found" : "Loading buyers..."}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminHome;