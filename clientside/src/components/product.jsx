import React, { useState, useEffect, useRef } from "react";
import logo from "../assets/prada-logo-svgrepo-com.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import apiPath from "./path/apipath";
import { ToastContainer, toast } from 'react-toastify';
import { Plus, Minus, ShoppingCart, Search, Heart, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";

function Product() {
  const [user, setUser] = useState({ email: "", username: "", accounttype: "", _id: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [product, setProduct] = useState({ photos: [] });
  const { _id } = useParams();
  const [cart, setCart] = useState({});
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);
  const autoPlayInterval = 3000; 

  const getproduct = async () => {
    try {
      const res = await axios.get(`${apiPath()}/oneproduct/${_id}`);
      console.log(res.data);
      setProduct(res.data);
    } catch (error) {
      console.error(error);
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
        setUser({
          email: res.data.email,
          username: res.data.username,
          accounttype: res.data.accounttype,
          _id: res.data._id,
        });
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error);
      if (error.response?.data?.msg === "Login time expired please login again") {
        localStorage.removeItem("token");
        setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
      }
    }
  };

  useEffect(() => {
    getUser();
    getproduct();
  }, []);

  useEffect(() => {
    if (user._id && product._id) {
      setCart({ user_id: user._id, product_id: product._id });
    }
  }, [user, product]);

 
  useEffect(() => {
    if (!product.photos || product.photos.length <= 1) return;

    const play = () => {
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex(prevIndex =>
          prevIndex === product.photos.length - 1 ? 0 : prevIndex + 1
        );
      }, autoPlayInterval);
    };

    play();

   
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [product.photos]);

  const resetTimer = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = setInterval(() => {
        setCurrentImageIndex(prevIndex =>
          prevIndex === product.photos?.length - 1 ? 0 : prevIndex + 1
        );
      }, autoPlayInterval);
    }
  };

  const handlePrevSlide = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === 0 ? (product.photos?.length - 1 || 0) : prevIndex - 1
    );
    resetTimer();
  };

  const handleNextSlide = () => {
    setCurrentImageIndex(prevIndex =>
      prevIndex === (product.photos?.length - 1 || 0) ? 0 : prevIndex + 1
    );
    resetTimer();
  };

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

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(0);

  
  const mockPhotos = [
    "https://www.longines.com/media/catalog/product/cache/8db0cbef53b094d206272ae26deca8a4/l/3/l3.720.4.92.6_0001.png",
    "https://www.longines.com/media/catalog/product/cache/8db0cbef53b094d206272ae26deca8a4/l/3/l3.720.4.92.6_0002.png",
    "https://www.longines.com/media/catalog/product/cache/8db0cbef53b094d206272ae26deca8a4/l/3/l3.720.4.92.6_0003.png",
    "https://www.longines.com/media/catalog/product/cache/8db0cbef53b094d206272ae26deca8a4/l/3/l3.720.4.92.6_0004.png"
  ];

  
  const displayPhotos = product.photos && product.photos.length > 0 ? product.photos : mockPhotos;


  const variants = displayPhotos.map((photo, index) => ({
    id: index + 1,
    img: photo,
    color: ["Blue", "Silver", "Green", "Black"][index % 4] 
  }));

  
  const handleVariantSelect = (index) => {
    setSelectedVariant(index);
    setCurrentImageIndex(index); 
    resetTimer();
  };

  const handleQuantityChange = (increment) => {
    setQuantity(prev => Math.max(1, prev + increment));
  };

  const handleCart = async () => {
    try {
      const res = await axios.post(`${apiPath()}/addcart`, cart);
      toast.success(res.data.msg, { position: "top-right", autoClose: 3000, theme: "dark" });
      setIsAddedToCart(true); 
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoToCart = () => {
    navigate("/cart"); 
  };

  const checkCartStatus = async () => {
    try {
      if (!user._id || !product._id) return;

      const res = await axios.get(`${apiPath()}/getcartcheck/${user._id}`);
      const cartItems = res.data;

      const isProductInCart = cartItems.some(item => item.product_id === product._id);

      setIsAddedToCart(isProductInCart);
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  useEffect(() => {
    if (user._id && product._id) {
      checkCartStatus();
    }
  }, [user, product]);

 
  const calculateDiscountedPrice = () => {
    if (product.discount && product.discount > 0) {
      const discountAmount = (product.price * product.discount) / 100;
      return product.price - discountAmount;
    }
    return product.price;
  };

  const discountedPrice = calculateDiscountedPrice();

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b">
        <ToastContainer />
        <Link to={"/"}><div className="flex items-center">
                  <img src={logo} className="w-18 h-16 mt-1.5" alt="Logo" />
                </div></Link> 

        <div className="hidden lg:flex items-center space-x-8">
          <a href="#" className="text-sm font-medium hover:text-gray-600">    </a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">    </a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">    </a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">    </a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">    </a>
          <a href="#" className="text-sm font-medium hover:text-gray-600">    </a>
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
          {/* <Heart className="w-6 h-6 cursor-pointer hover:text-gray-600" /> */}
          <Link to={"/cart"}><ShoppingBag className="w-6 h-6 cursor-pointer hover:text-gray-600" /></Link>

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

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-2xl shadow-sm p-4 lg:p-8">
            
            <div className="relative">
              <div className="sticky top-8 space-y-4">
                <div className="relative overflow-hidden rounded-xl shadow-lg" ref={carouselRef}>
                  <div className="relative aspect-square">
                    {displayPhotos.map((photo, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                          currentImageIndex === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                      >
                        <img
                          src={photo}
                          alt={`Product view ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handlePrevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors focus:outline-none"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={handleNextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors focus:outline-none"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>

                
                <div className="flex justify-center gap-2 mt-2">
                  {displayPhotos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        resetTimer();
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        currentImageIndex === index
                          ? 'bg-blue-500 w-6'
                          : 'bg-gray-300'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

           
            <div className="space-y-6 lg:space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">New</span>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.product_name}</h1>
                <p className="text-gray-600 text-lg">
                  {product.description || "Fresh and organic."}
                </p>
              </div>

              
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">Available Variations</h2>
                <div className="flex flex-wrap gap-4">
                  {variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantSelect(index)}
                      className={`w-20 h-20 rounded-xl transition-transform transform hover:scale-105 ${
                        selectedVariant === index
                          ? 'ring-2 ring-blue-500 ring-offset-2'
                          : 'ring-1 ring-gray-200'
                      }`}
                    >
                      <img
                        src={variant.img}
                        alt={variant.color}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </button>
                  ))}
                </div>
              </div>

             
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">Quantity</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 rounded-full border hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={24} />
                  </button>
                  <span className="text-2xl font-medium w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 rounded-full border hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={24} />
                  </button>
                </div>
              </div>

              
              <div className="space-y-4 pt-6">
                <div className="flex items-baseline gap-2">
                  {product.discount && product.discount > 0 ? (
                    <>
                      <p className="text-3xl lg:text-4xl font-bold text-gray-900">
                        ₹{discountedPrice.toFixed(2)}
                      </p>
                      <p className="text-xl text-gray-500 line-through">
                        ₹{product.price}
                      </p>
                      <span className="text-green-600 text-lg font-medium">
                        ({product.discount}% off)
                      </span>
                    </>
                  ) : (
                    <p className="text-3xl lg:text-4xl font-bold text-gray-900">
                      ₹{product.price || "203,000.00"}
                    </p>
                  )}
                  <span className="text-gray-500">inclusive of all taxes</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isAddedToCart ? (
                    <button
                      onClick={handleGoToCart}
                      className="w-full bg-green-600 text-white py-4 px-6 rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-lg font-medium"
                    >
                      Go to Cart
                    </button>
                  ) : (
                    <button
                      onClick={handleCart}
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg font-medium"
                    >
                      <ShoppingCart size={24} />
                      Add to Cart
                    </button>
                  )}
                  <button className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl hover:bg-gray-800 transition-colors text-lg font-medium">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;