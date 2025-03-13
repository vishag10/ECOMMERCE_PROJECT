import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiPath from './path/apipath';
import { useNavigate } from "react-router-dom";

export default function Orderstatus() {
    const { _id } = useParams();
    const user_id = _id;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [helpOpen, setHelpOpen] = useState({});

    const navigate = useNavigate();

    const getorderstatus = async () => {
        try {
            setLoading(true);
            const res = await axios.post(`${apiPath()}/orderstatus`, { user_id });
            console.log(res.data);
            setOrders(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            toast.error("Failed to fetch orders. Please try again later.", {
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

    useEffect(() => {
        getorderstatus();
    }, []);

    // Calculate delivery date (current date + 3 days)
    const calculateDeliveryDate = () => {
        const currentDate = new Date();
        const deliveryDate = new Date(currentDate);
        deliveryDate.setDate(currentDate.getDate() + 3);
        return deliveryDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const toggleHelp = (orderId) => {
        setHelpOpen(prev => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-8">
            <ToastContainer />
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">My Orders</span>
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold mb-2">No orders found</h2>
                        <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                        <button
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-md shadow-md hover:shadow-lg transition duration-300"
                            onClick={() => navigate("/")}
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <div key={order._id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-101">
                                {/* Order Header */}
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-5">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-lg font-semibold">Order #{order._id.substring(order._id.length - 8)}</h2>
                                            <p className="text-sm opacity-90">Placed on {new Date().toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-medium">₹{order.total_price}</p>
                                            <p className="text-xs opacity-90">{order.products.length} {order.products.length > 1 ? 'items' : 'item'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Delivery Status - Only Expected Date */}
                                <div className="p-5 border-b">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium text-gray-700">Delivery Status</h3>
                                        <span className="text-sm bg-green-100 text-green-700 py-1 px-3 rounded-full font-medium">
                                            Expected Delivery: {calculateDeliveryDate()}
                                        </span>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-5">
                                    <h3 className="font-medium mb-4 text-gray-700 border-b pb-2">Order Items</h3>
                                    <div className="space-y-4">
                                        {order.products.map((product) => (
                                            <div key={product.product_id} className="flex border-b pb-4 hover:bg-gray-50 p-2 rounded transition duration-200">
                                                <div className="ml-2 flex-1">
                                                    <div className="flex justify-between">
                                                        <h4 className="font-medium text-gray-800">{product.product_name}</h4>
                                                        <div className="flex items-center">
                                                            <span className="font-medium text-gray-800">₹{(product.price - (product.price * (product.discount || 0) / 100)).toFixed(0)}</span>
                                                            {product.discount > 0 && (
                                                                <>
                                                                    <span className="text-gray-500 line-through text-sm ml-2">₹{product.price}</span>
                                                                    <span className="text-green-600 text-sm ml-2 bg-green-100 px-2 py-0.5 rounded-full">{product.discount}% off</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm text-gray-500 mt-1">Qty: {product.quantity}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Delivery Address */}
                                <div className="p-5 bg-gray-50">
                                    <h3 className="font-medium mb-3 text-gray-700">Delivery Address</h3>
                                    {order.address && order.address[0] && (
                                        <div className="text-sm text-gray-700 bg-white p-3 rounded-md shadow-sm border border-gray-200">
                                            <p className="mb-1 font-medium">{order.address[0].line}</p>
                                            <p className="mb-1">{order.address[0].district} - {order.address[0].pincode}</p>
                                            <p className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                {order.address[0].phone}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Need Help Button */}
                                <div className="p-5 border-t">
                                    <button
                                        onClick={() => toggleHelp(order._id)}
                                        className="text-blue-500 font-medium px-4 py-2 border border-blue-500 rounded-md hover:bg-blue-50 transition duration-300 flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Need Help?
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-4 w-4 ml-2 transition-transform duration-300 ${helpOpen[order._id] ? 'rotate-180' : ''}`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Help Dropdown */}
                                    {helpOpen[order._id] && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200 text-sm animate-fadeIn">
                                            <h4 className="font-medium mb-3 text-gray-800">How can we help you?</h4>
                                            <div className="space-y-3">
                                                <div className="p-3 bg-white rounded hover:shadow-md transition duration-300 cursor-pointer flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">I want to return the product</p>
                                                        <p className="text-gray-500 text-xs mt-1">Initiate return and get refund</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-white rounded hover:shadow-md transition duration-300 cursor-pointer flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">Where is my order?</p>
                                                        <p className="text-gray-500 text-xs mt-1">Check delivery status and location</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-white rounded hover:shadow-md transition duration-300 cursor-pointer flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">Product quality issue</p>
                                                        <p className="text-gray-500 text-xs mt-1">Report damaged or wrong item</p>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-white rounded hover:shadow-md transition duration-300 cursor-pointer flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">Contact customer support</p>
                                                        <p className="text-gray-500 text-xs mt-1">Talk to our support team</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="mt-4 text-gray-500 text-xs">For immediate assistance, call our support at 1800-123-4567</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}