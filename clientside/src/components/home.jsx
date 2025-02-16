import "./css/home.css"
import React from 'react';
import { Search, Heart, ShoppingBag } from 'lucide-react';
import logo from "../assets/prada-logo-svgrepo-com.svg"
import { Link } from "react-router-dom";

function Home(){
    return (
        <>
          <nav className="flex items-center justify-between px-8 py-4 bg-white border-b">
      
      <div className="flex items-center">
        <img src={logo} className="w-18 h-16 mt-1.5" viewBox="0 0 24 24" fill="currentColor">
          
        </img>
      </div>

      <div className="hidden lg:flex items-center space-x-8">
        <a href="#" className="text-sm font-medium hover:text-gray-600">New & Featured</a>
        <a href="#" className="text-sm font-medium hover:text-gray-600">Men</a>
        <a href="#" className="text-sm font-medium hover:text-gray-600">Women</a>
        <a href="#" className="text-sm font-medium hover:text-gray-600">Kids</a>
        <a href="#" className="text-sm font-medium hover:text-gray-600">Sale</a>
        <a href="#" className="text-sm font-medium hover:text-gray-600">SNKRS</a>
      </div>

      <div className="flex items-center space-x-6">
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
        <Link to={"/buyerorsellerlogin"} className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800">
          Login
        </Link>
      </div>
    </nav>

        </>
    )
}

export default Home;