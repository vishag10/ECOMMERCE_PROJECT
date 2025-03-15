import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import apiPath from "./path/apipath";

function Address() {
    const location = useLocation();
    const _id = location.state?._id;
    const navigate = useNavigate();
    
    const [address, setAdress] = useState({
        line: "",
        district: "",
        pincode: "",
        phone: "",
        address_id: _id 
    });
    
    const [errors, setErrors] = useState({
        line: "",
        district: "",
        pincode: "",
        phone: ""
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            line: "",
            district: "",
            pincode: "",
            phone: ""
        };
        
        // Validate line
        if (!address.line.trim()) {
            newErrors.line = "Address line is required";
            isValid = false;
        } else if (address.line.trim().length < 5) {
            newErrors.line = "Address line must be at least 5 characters";
            isValid = false;
        }
        
        // Validate district
        if (!address.district.trim()) {
            newErrors.district = "District is required";
            isValid = false;
        }
        
        // Validate pincode
        if (!address.pincode.trim()) {
            newErrors.pincode = "Pincode is required";
            isValid = false;
        } else if (!/^\d{6}$/.test(address.pincode)) {
            newErrors.pincode = "Pincode must be a 6-digit number";
            isValid = false;
        }
        
        // Validate phone
        if (!address.phone.trim()) {
            newErrors.phone = "Phone number is required";
            isValid = false;
        } else if (!/^\d{10}$/.test(address.phone)) {
            newErrors.phone = "Phone number must be 10 digits";
            isValid = false;
        }
        
        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdress(prev => ({ ...prev, [name]: value }));
        
        // Clear the error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error("Please fix the errors in the form", { theme: "dark" });
            return;
        }
      
        try {
            const res = await axios.post(`${apiPath()}/addaddress`, address);
            if (res.status === 201) {
                toast.success(res.data.msg, { theme: "dark" });
                setAdress({ line: "", district: "", pincode: "", phone: "", address_id: _id });
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
                                onChange={handleChange}
                                value={address.line}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.line ? 'border-red-500' : ''}`}
                            />
                            {errors.line && <p className="text-red-500 text-xs mt-1">{errors.line}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium">District</label>
                            <input
                                type="text"
                                placeholder="Enter district"
                                name="district"
                                onChange={handleChange}
                                value={address.district}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.district ? 'border-red-500' : ''}`}
                            />
                            {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium">Pincode</label>
                            <input
                                type="text"
                                placeholder="Enter pincode"
                                name="pincode"
                                onChange={handleChange}
                                value={address.pincode}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.pincode ? 'border-red-500' : ''}`}
                            />
                            {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-medium">Phone</label>
                            <input
                                type="text"
                                placeholder="Enter phone number"
                                name="phone"
                                onChange={handleChange}
                                value={address.phone}
                                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none ${errors.phone ? 'border-red-500' : ''}`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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