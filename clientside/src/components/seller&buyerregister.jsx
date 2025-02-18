import "./css/adminlogin.css";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import apiPath from "./path/apipath";
import axios from "axios";
const BuyerRegister = () => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [data, setData] = useState({ username: "", email: "", phone: "", password: "", cpassword: "", accounttype: "buyer" });
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(data);
        try {
          const res = await axios.post(`${apiPath()}/addbuyerseller`, data);
          console.log(data);

          if (res.status === 201) {
            const {  msg } = res.data; 
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
            setData({ username: "", email: "", password: "", cpassword: "", profile: "", phone: "" }); 
            setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
          }
        } catch (error) {
          if(error.response){
            alert(error.response.data.msg);
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
                                name="accounttype" onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                                value={data.accounttype}
                            >
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" className="w-full px-5 py-3 border border-purple-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600" 
                            name="email" onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                            value={data.email} placeholder="mail@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <input type="text" className="w-full px-5 py-3 border border-purple-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                            name="username" onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                            value={data.username} placeholder="Username" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input type="text" className="w-full px-5 py-3 border border-purple-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                            name="phone" onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                            value={data.phone}  placeholder="Phone Number" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" className="w-full px-5 py-3 border border-purple-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                            name="password" onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                            value={data.password}  />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input type="password" className="w-full px-5 py-3 border border-purple-400 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                            name="cpassword" onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                            value={data.cpassword}  />
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
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default BuyerRegister;