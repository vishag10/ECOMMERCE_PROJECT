import React from "react";
import PropTypes from "prop-types"; // Import PropTypes for validation
import { Search, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/prada-logo-svgrepo-com.svg";
import { ToastContainer } from "react-toastify";

const Navbar = ({
  user,
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleLogout,
  toggleDropdown,
  dropdownOpen,
  navigate,
}) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm transition-all duration-300">
      <ToastContainer />
      <div className="flex items-center">
        <img src={logo} className="w-18 h-16 mt-1.5" alt="Logo" />
      </div>
      <div className="hidden lg:flex items-center space-x-8">
        <Link to={"/offer"} className="text-sm font-medium hover:text-gray-600">
          Offer sales
        </Link>
        
        <Link to={"/food"} className="text-sm font-medium hover:text-gray-600">
          Foods
        </Link>
        
      </div>
      <div className="flex items-center space-x-6 relative">
        <div className="hidden md:flex items-center bg-gray-100 rounded-full">
          <div className="flex items-center px-4 py-2">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent border-none outline-none ml-2 text-sm w-32"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
            />
          </div>
        </div>
        <Link to={"/cart"}>
          <ShoppingBag className="w-6 h-6 cursor-pointer hover:text-gray-600" />
        </Link>
        {user.username ? (
          <div className="relative">
            <button
              className="cursor-pointer w-10 h-10 flex items-center justify-center text-white font-semibold rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none"
              onClick={toggleDropdown}
            >
              {user.username.charAt(0).toUpperCase()}
            </button>
            {dropdownOpen && (
              <div className="z-50 absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-200 rounded-lg"
                  onClick={() => navigate("/profile")}
                >
                  Profile
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-200 rounded-lg"
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
  );
};

// ✅ *PropTypes for validation*
Navbar.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
  }).isRequired,
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
  dropdownOpen: PropTypes.bool.isRequired,
  navigate: PropTypes.func.isRequired,
};

// ✅ *Export optimized component*
export default React.memo(Navbar);
