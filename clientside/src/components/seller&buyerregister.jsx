import "./css/adminlogin.css";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiPath from "./path/apipath";
import axios from "axios";
import { validateForm } from "./formValidation";

const BuyerRegister = () => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [data, setData] = useState({ 
        username: "", 
        email: "", 
        phone: "", 
        password: "", 
        cpassword: "", 
        accounttype: "buyer" 
    });
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        cpassword: ""
    });
    const [touched, setTouched] = useState({
        username: false,
        email: false,
        phone: false,
        password: false,
        cpassword: false
    });
    const navigate = useNavigate();

    // Validate fields on change if they've been touched
    useEffect(() => {
        if (Object.values(touched).some(field => field)) {
            const { errors: validationErrors } = validateForm(data);
            setErrors(validationErrors);
        }
    }, [data, touched]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Set all fields as touched for validation
        const allTouched = Object.keys(touched).reduce(
            (acc, field) => ({ ...acc, [field]: true }), {}
        );
        setTouched(allTouched);
        
        // Validate the form
        const { isValid, errors: validationErrors } = validateForm(data);
        setErrors(validationErrors);
        
        if (!isValid) {
            // Show error toast for form validation failure
            toast.error("Please fix the errors in the form", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            return;
        }
        
        try {
            const res = await axios.post(`${apiPath()}/addbuyerseller`, data);

            if (res.status === 201) {
                const { msg } = res.data; 
                toast.success(msg, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                }); 
                setData({ username: "", email: "", password: "", cpassword: "", phone: "", accounttype: "buyer" }); 
                setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.msg, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } else {
                toast.error("An error occurred. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-600 p-4">
            <ToastContainer />
            <div className="w-full max-w-2xl flex flex-col rounded-xl shadow-lg bg-white overflow-hidden p-8 md:p-12">
                <motion.div
                    className="w-full"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-semibold text-purple-800 mb-2">Register</h2>
                        <p className="text-gray-600 text-sm">Choose your account type and get started!</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                            <select
                                className="w-full px-5 py-3 border border-purple-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                                name="accounttype"
                                onChange={handleChange}
                                value={data.accounttype}
                            >
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input 
                                type="email" 
                                className={`w-full px-5 py-3 border ${errors.email ? "border-red-500" : "border-purple-400"} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                                name="email" 
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={data.email} 
                                placeholder="mail@gmail.com" 
                            />
                            {touched.email && errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input 
                                type="text" 
                                className={`w-full px-5 py-3 border ${errors.username ? "border-red-500" : "border-purple-400"} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                                name="username" 
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={data.username} 
                                placeholder="Username" 
                            />
                            {touched.username && errors.username && (
                                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input 
                                type="text" 
                                className={`w-full px-5 py-3 border ${errors.phone ? "border-red-500" : "border-purple-400"} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                                name="phone" 
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={data.phone}  
                                placeholder="Phone Number" 
                            />
                            {touched.phone && errors.phone && (
                                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input 
                                type="password" 
                                className={`w-full px-5 py-3 border ${errors.password ? "border-red-500" : "border-purple-400"} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                                name="password" 
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={data.password}
                            />
                            {touched.password && errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input 
                                type="password" 
                                className={`w-full px-5 py-3 border ${errors.cpassword ? "border-red-500" : "border-purple-400"} rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600`}
                                name="cpassword" 
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={data.cpassword}
                            />
                            {touched.cpassword && errors.cpassword && (
                                <p className="text-red-500 text-xs mt-1">{errors.cpassword}</p>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={termsAccepted}
                                onChange={() => setTermsAccepted(!termsAccepted)}
                                className="mr-2 accent-purple-600"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-700">I accept the Terms & Conditions</label>
                        </div>

                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`cursor-pointer w-full py-3 rounded-md text-white transition duration-200 ${termsAccepted ? "bg-purple-800 hover:bg-purple-700" : "bg-gray-400 cursor-not-allowed"}`}
                            disabled={!termsAccepted}
                        >
                            Create Account
                        </motion.button>

                        <div className="text-center mt-4">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link to="/buyerorsellerlogin" className="text-purple-700 hover:underline">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default BuyerRegister;