import  { useState, useEffect } from "react";
import logo from "../assets/prada-logo-svgrepo-com.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import apiPath from "./path/apipath";
import { ToastContainer, toast } from "react-toastify";
import { Search } from "lucide-react";

function CartPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ email: "", username: "", _id: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]); 
  const [products, setProducts] = useState([]); 
  const [quantities, setQuantities] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [order, setOrder] = useState({
    address: "",
    products: [],
    total_price: 0
  });

  const getCart = async () => {
    try {
      if (!user._id) {
        console.error("User ID is not available.");
        return;
      }

      const res = await axios.get(`${apiPath()}/getcartcheck/${user._id}`);
      

      if (Array.isArray(res.data)) {
        setCartItems(res.data);
      } else if (typeof res.data === "object") {
        setCartItems([res.data]);
      } else {
        console.error("Unexpected response format:", res.data);
        setCartItems([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCartItems([]);
    }
  };


  const getProducts = async () => {
    if (cartItems.length === 0) return; 

    try {
      const productIds = cartItems.map((item) => item.product_id);
      const res = await axios.post(`${apiPath()}/getproducts`, { _id: productIds });
     

      if (res.data && Array.isArray(res.data)) {  
        setProducts(res.data);
       
        const initialQuantities = {};
        res.data.forEach(product => {
          initialQuantities[product._id] = 1;
        });
        setQuantities(initialQuantities);
      } else if (typeof res.data === "object") {
        setProducts([res.data]);
        setQuantities({ [res.data._id]: 1 });
      } else {
        console.error("Unexpected response format:", res.data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };


  
  const getUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/buyerorsellerlogin");

    try {
      const res = await axios.get(`${apiPath()}/homebuyerseller`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200) {
        setUser({
          email: res.data.email,
          username: res.data.username,
          accounttype: res.data.accounttype,
          _id: res.data._id,
        });
      }
    } catch (error) {
      console.error("User fetch error:", error);
      localStorage.removeItem("token");
      navigate("/buyerorsellerlogin");
    }
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

    setUser({ email: "", username: "", _id: "" });
    setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
  };

  const calculatePriceDetails = () => {
    let totalPrice = 0;
    let totalDiscount = 0;

    products.forEach(product => {
      const quantity = quantities[product._id] || 1;
      const productTotal = product.price * quantity;
      totalPrice += productTotal;
      
      if (product.discount) {
        totalDiscount += Math.round(productTotal * (product.discount / 100));
      }
    });

    const totalAmount = totalPrice - totalDiscount;
    
    return {
      totalPrice,
      totalDiscount,
      totalAmount
    };
  };

  const PriceSummary = () => {
    const { totalPrice, totalDiscount, totalAmount } = calculatePriceDetails();

    return (
      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Price ({products.length} items)</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>-₹{totalDiscount.toFixed(2)}</span>
        </div>
        <div className="border-t pt-3 font-medium">
          <div className="flex justify-between text-lg">
            <span>Total Amount</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };


  const increaseQuantity = (product) => {
    const productId = product._id;

    if (product.quantity === 0) {
        toast.warn('⚠ Not enough stock for product');
        return; 
    }

    setQuantities(prev => {
        const currentQuantity = prev[productId] || 0;
        
        if (currentQuantity < product.quantity) {
            return {
                ...prev,
                [productId]: currentQuantity + 1
            };
        } else {
            toast.error(`Product reached its maximum quantity: ${product.quantity}`);
            return prev; 
        }
    });
};


  const decreaseQuantity = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 1) - 1, 1)
    }));
  };

  const handleItemDelete = async (id) => {
    try {
      const res = await axios.delete(`${apiPath()}/deletecart/${id}`);
  
      if (res.status === 201) {
        toast.success(res.data.msg, {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
  
        setTimeout(() => {
          window.location.reload();
        }, 3000); 
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearCart = async () => {
    try {
      if (!user._id) return;
      
      const res = await axios.delete(`${apiPath()}/clearcart/${user._id}`);
      
      if (res.status === 200 || res.status === 201) {
        console.log("Cart cleared successfully");
      } else {
        console.error("Failed to clear cart:", res.data);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  


  const handleAddOrder = async () => {
    try {
      if(!address)
      {
         toast.warn('Please add the addresss')
        setTimeout(() => {
          navigate("/profile")
        }, 1000); 
        return;
      }
      const { totalAmount } = calculatePriceDetails();
  
      // Step 1: Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        console.error("Failed to load Razorpay script.");
        toast.error("Razorpay SDK failed to load. Check your network.", {
          position: "top-right",
          autoClose: 3000,
          theme: "dark",
        });
        return;
      }
  
      // Step 2: Create an order on the backend
      const orderResponse = await axios.post(`${apiPath()}/razorpay-create-order`, {
        amount: totalAmount * 100, // Convert to paise
        currency: "INR",
      });
  
      if (orderResponse.status !== 200) {
        throw new Error("Failed to create Razorpay order");
      }
  
      const { id: order_id, amount } = orderResponse.data;
  
      // Step 3: Initialize Razorpay Checkout
      const options = {
        key: "rzp_test_3Nt8Vtk7SZEtCI", // Use your Razorpay Test Key
        amount: amount,
        currency: "INR",
        name: "Your Store",
        description: "E-commerce Order Payment",
        order_id: order_id,
        handler: async function (response) {
          console.log("Payment Successful:", response);


          
          // Step 4: Verify Payment on the backend
          const verifyResponse = await axios.post(`${apiPath()}/razorpay-verify-payment`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
  
          if (verifyResponse.data.success) {
            console.log("Payment Verified:", verifyResponse.data);
          
      
      const { totalAmount } = calculatePriceDetails();
    
      const orderProducts = products.map(product => ({
        product_id: product._id,
        product_name: product.product_name,
        quantity: quantities[product._id] || 1,
        price: product.price,
        discount: product.discount || 0
      }));
      
      const orderData = {
        address: address, 
        products: orderProducts,
        total_price: totalAmount
      };
      
      setOrder(orderData);
      const user_id=user._id;
      
      const res = await axios.post(`${apiPath()}/addtoorder`,{ user_id, orderData });

      console.log("orderedData",orderData)
      
      if (res.status === 201 || res.status === 200) {
       
        await clearCart();
        
        setShowConfirmation(true);

        setTimeout(() => {
          setShowConfirmation(false);
          window.location.reload();
        }, 2000);

        const orderdProducts = orderData.products;

        const updateQuantity = await axios.put(`${apiPath()}/updateorderquantity`, { orderdProducts });
        
        if (updateQuantity.status === 200) {
          console.log("✅ Quantity updated successfully");
        } else {
          console.error("❌ Error updating quantity");
        }
        
         
      }
          } else {
            toast.error("Payment verification failed!", { position: "top-right", autoClose: 3000, theme: "dark" });
          }
        },
        prefill: {
          name: user.username,
          email: user.email,
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };
  
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      if(error.response){
        alert(error.response.data.msg);
      }
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment. Please try again.", { position: "top-right", autoClose: 3000, theme: "dark" });
    }
  };
  


  const [address,setAddress]=useState()

  const handleAddress = async () => {
    try {
      const address_id = user._id;
      
  
      // ✅ Send address_id as JSON body
      const res = await axios.post(`${apiPath()}/getorderaddress`, { address_id });
  
      // ✅ Axios response is in res.data
  
      setAddress(res.data)
      
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };
  
  
  useEffect(()=>
  {
    handleAddress()
  },[user._id])

  useEffect(() => {
    getUser();
    
  }, []);

  useEffect(() => {
    if (user._id) {
      getCart();
    }
  }, [user._id]);

  useEffect(() => {
    if (cartItems.length > 0) {
      getProducts();
    }
  }, [cartItems]);

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm sticky top-0 z-50">
        <ToastContainer />
        <Link to="/">
          <img src={logo} className="w-18 h-16 mt-1.5" alt="Logo" />
        </Link>

        <div className="flex items-center space-x-6">
          <Search className="w-6 h-6 cursor-pointer text-gray-700 hover:text-black transition" />
          {/* <Heart className="w-6 h-6 cursor-pointer text-gray-700 hover:text-red-500 transition" />
          <ShoppingBag className="w-6 h-6 cursor-pointer text-gray-700 hover:text-black transition" /> */}
          
          {user.username ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center text-lg font-bold hover:bg-black transition"
              >
                {user.username.charAt(0).toUpperCase()}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-200 transition"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/buyerorsellerlogin"
              className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      <div className="min-h-screen bg-gray-50">
        {products.length > 0 ? (
          <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
            <div className="w-full lg:w-3/4 p-4">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white p-6 rounded-lg shadow-md mb-6"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="w-32 sm:w-48">
                      <img
                        src={product.photos[0]}
                        alt={product.product_name}
                        className="w-full h-auto object-cover rounded"
                      />
                     
                      <div className="flex items-center justify-between mt-4">
                        <button
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                          onClick={() => decreaseQuantity(product._id)}
                        >
                          <span className="text-gray-500">-</span>
                        </button>

                        <input
                          type="text"
                          value={quantities[product._id] || 1}
                          readOnly
                          className="w-12 text-center border border-gray-300 mx-2 rounded"
                        />

                        <button
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition"
                          onClick={() => increaseQuantity(product)}
                        >
                          <span className="text-gray-500">+</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold">{product.product_name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500">Seller: {product.seller}</span>
                          <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center">
                            ✓<span className="ml-1">Assured</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center mb-4">
                        {product.discount > 0 && (
                          <span className="text-gray-500 line-through text-sm">₹{(product.price * (quantities[product._id] || 1)).toFixed(2)}</span>
                        )}

                        <span className="text-2xl font-bold ml-4">
                          ₹{product.discount > 0
                            ? Math.round((product.price - (product.price * product.discount / 100)) * (quantities[product._id] || 1))
                            : (product.price * (quantities[product._id] || 1)).toFixed(2)}
                        </span>

                        {product.discount > 0 && (
                          <span className="ml-4 text-green-600">{product.discount}% Off</span>
                        )}
                      </div>

                      <div className="mb-6">
                        <span className="text-sm">
                          Delivery by Mar 10 |{" "}
                          <span className="line-through">₹80</span>{" "}
                          <span className="text-green-600">Free</span>
                        </span>
                      </div>

                      <div className="flex items-center">
                        <button className="mr-6 text-gray-700 font-medium hover:text-gray-900 transition">
                          SAVE FOR LATER
                        </button>
                        <button 
                          className="text-red-600 font-medium bg-red-50 px-4 py-2 rounded hover:bg-red-100 transition"
                          onClick={() => handleItemDelete(product._id)}
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-1/4 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-medium mb-4">PRICE DETAILS</h2>
              <PriceSummary />
              <button 
                className="w-full bg-orange-500 text-white py-3 rounded mt-6 hover:bg-orange-600 transition"
                onClick={handleAddOrder}
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto p-8">
            <div className="py-16 text-center">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-medium mb-4 text-gray-800">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <Link to="/" className="inline-block bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 transition">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
      
    
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 mb-4">Your order has been placed successfully.</p>
            <p className="font-medium">Total: ₹{calculatePriceDetails().totalAmount.toFixed(2)}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default CartPage;