import { Link, useParams } from "react-router-dom";
import React from 'react';
import { Edit, Trash2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from "react";
import axios from "axios";
import apiPath from "./path/apipath";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const DeleteConfirmationModal = ({ isOpen, productName, onCancel, onConfirm }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 max-w-md shadow-xl">
        <div className="flex items-center mb-4 text-red-500">
          <AlertCircle className="mr-2" size={24} />
          <h3 className="text-lg font-semibold">Confirm Deletion</h3>
        </div>
        
        <p className="mb-6 text-gray-700">
          Are you sure you want to delete <span className="font-semibold">{productName}</span>? This action cannot be undone.
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, handleDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const confirmDelete = () => {
    setShowDeleteModal(true);
  };
  
  const cancelDelete = () => {
    setShowDeleteModal(false);
  };
  
  const proceedWithDelete = () => {
    handleDelete(product._id);
    setShowDeleteModal(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        productName={product.product_name}
        onCancel={cancelDelete}
        onConfirm={proceedWithDelete}
      />
      
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
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200"
            onClick={confirmDelete}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
            
          <Link to={`/productedit/${product._id}`}>
            <button
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
          </Link>
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
        // Update products state directly instead of reloading the page
        setProducts(products.filter(product => product._id !== productId));
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Products</h1>
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