import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import apiPath from "./path/apipath";

function Address() {
    
    const location = useLocation();
    const _id = location.state?._id;
    const navigate = useNavigate();
   console.log(_id);
   
    const [address, setAdress] = useState({
        line: "",
        district: "",
        pincode: "",
        phone: "",
        address_id: _id 
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!address.line || !address.district || !address.pincode || !address.phone) {
          toast.error("All fields are required!", { theme: "dark" });
          return;
        }
      
        try {
          const res = await axios.post(`${apiPath()}/addaddress`, address);
          if (res.status === 201) {
            toast.success(res.data.msg, { theme: "dark" });
            setAdress({ line: "", district: "", pincode: "", phone: ""});
            setTimeout(() => navigate("/profile"), 3000);
          }
        } catch (error) {
          console.log("Error submitting address:", error);
          toast.error("Failed to add address", { theme: "dark" });
        }
      };

    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <ToastContainer />
                <div className="bg-white shadow-lg rounded-lg p-6 w-96 border-t-4 border-blue-600">
                    <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">Add Address</h2>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium">Line</label>
                            <input
                                type="text"
                                placeholder="Enter address line"
                                name="line"
                                onChange={(e) => setAdress(prev => ({ ...prev, line: e.target.value }))}
                                value={address.line}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium">District</label>
                            <input
                                type="text"
                                placeholder="Enter district"
                                name="district"
                                onChange={(e) => setAdress(prev => ({ ...prev, district: e.target.value }))}
                                value={address.district}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium">Pincode</label>
                            <input
                                type="text"
                                placeholder="Enter pincode"
                                name="pincode"
                                onChange={(e) => setAdress(prev => ({ ...prev, pincode: e.target.value }))}
                                value={address.pincode}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium">Phone</label>
                            <input
                                type="text"
                                placeholder="Enter phone number"
                                name="phone"
                                onChange={(e) => setAdress(prev => ({ ...prev, phone: e.target.value }))}
                                value={address.phone}
                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition duration-200"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Address;
