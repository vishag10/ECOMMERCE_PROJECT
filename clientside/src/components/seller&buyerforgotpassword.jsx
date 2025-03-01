import "./css/adminlogin.css"
import React, { useState, useRef } from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import buyer from "../assets/Adobe Express - file (3).png"
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import apiPath from "./path/apipath";

function BuyerForget() {

  const [data, setData] = useState({ email: ""});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiPath()}/sellerforgot`, data);
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
                    theme: "dark",
                    }); 
      }
      } 
     catch (error) {
      if(error.response){
        alert(error.response.data.msg);
      }
    }
  };

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  
  const x = useTransform(mouseX, [0, window.innerWidth], [-5, 5]);
  const y = useTransform(mouseY, [0, window.innerHeight], [-5, 5]);

  
  const handleMouseMove = (e) => {
    const rect = imageRef.current?.getBoundingClientRect();
    if (rect) {
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setMousePosition({ x, y });
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-6">
      <ToastContainer />
      <div className="w-full max-w-6xl flex flex-col md:flex-row rounded-xl shadow-lg bg-white overflow-hidden">
        {/* Left Side - Image */}
        <motion.div 
          className="hidden md:block md:w-1/2 relative overflow-hidden min-h-[500px]"
          ref={imageRef}
          onMouseMove={handleMouseMove}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="absolute inset-0 z-0"
            style={{ x, y }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <motion.div
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="relative h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/50" />
              <img
                src={buyer}
                alt="Login illustration"
                className="w-full h-full object-cover"
              />
              
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              >
                <div className="absolute inset-0 bg-purple-500/10" />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative z-10 p-8 md:p-14 h-full flex flex-col justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-white mb-4"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
            >
              Turn your ideas into reality.
            </motion.h2>
            <motion.p
              className="text-white/90 text-base md:text-lg"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
            >
              Start for free and get attractive offers from the community
            </motion.p>
          </motion.div>
        </motion.div>

        
        <div className="w-full md:w-1/2 bg-white p-6 md:p-14">
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <motion.div 
                  className="w-10 h-10 border-2 border-purple-800 rounded flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="w-5 h-5 text-purple-800 text-xl">+</div>
                </motion.div>
              </div>
              <h2 className="text-2xl md:text-2xl font-semibold text-gray-800 mb-3">Forgot password</h2>
              <p className="text-gray-600 text-sm">See what is going on with your business</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="mail@example.com"
                  name="email" onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
                  value={data.email}
                />
              </motion.div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer w-full bg-purple-800 text-white text-base py-3 px-4 rounded-md hover:bg-purple-700 transition duration-200"
              >
                Send
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default BuyerForget;