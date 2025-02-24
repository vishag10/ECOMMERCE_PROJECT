import { useParams } from "react-router-dom";
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from "react";
import axios from "axios";
import apiPath from "./path/apipath";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductCard = ({ product, handleDelete }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={product.photos[0]}
                    alt={product.product_name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
            </div>

            {/* Content Container */}
            <div className="p-4">
                {/* Product Name */}
                <h3 className="text-lg font-semibold text-gray-800 truncate mb-2">
                    {product.product_name}
                </h3>

                {/* Price */}
                <p className="text-xl font-bold text-gray-900 mb-4">
                    ₹{product.price}
                </p>

                {/* Buttons Container */}
                <div className="flex gap-2">
                    <button
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
                        onClick={() => console.log('Edit clicked')}
                    >
                        <Edit size={16} />
                        <span>Edit</span>
                    </button>

                    <button
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200"
                        onClick={() => handleDelete(product._id)}
                    >
                        <Trash2 size={16} />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

function SellerProducts() {
    const { _id } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getProducts = async () => {
        try {
            const res = await axios.get(`${apiPath()}/sellerproduct/${_id}`);
            console.log(res.data);
            setProducts(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch products. Please try again later.", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        try {
            const res = await axios.delete(`${apiPath()}/deleteproduct/${productId}`);
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
                });
                setTimeout(() => window.location.reload(), 3000);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete product. Please try again later.", {
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
        getProducts();
    }, [_id]);

    return (
        <div className="container m-auto p-4">
            <ToastContainer />
            <h1 className="text-3xl  font-bold text-gray-800 mb-6">Your Products</h1>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center text-gray-600">
                    <p>No products found. Add some products to get started!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} handleDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default SellerProducts;