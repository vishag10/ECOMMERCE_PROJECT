import React from "react";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import apiPath from "./path/apipath";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

function SellItem() {
  const location = useLocation();
  const _id = location.state?._id;
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    product_name: "",
    category: "",
    price: "",
    photos: "",
    quantity: "",
    cname: "",
    clocation: "",
    product_id: _id 
  });


  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertBase64(file);
      setProduct(prevState => ({ ...prevState, photos: base64 }));
    }
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiPath()}/addproduct`, product);
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
        setProduct({
          product_name: "",
          category: "",
          price: "",
          photos: "",
          quantity: "",
          cname: "",
          clocation: "",
          _id: ""
        });
        setTimeout(() => navigate("/profile"), 3000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <ToastContainer />
        <h2 className="text-2xl font-semibold text-center mb-4">Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              name="category"
              onChange={(e) => setProduct(prev => ({ ...prev, category: e.target.value }))}
              value={product.category}
            >
              <option value="" disabled hidden>Select Category</option>
              <option>vegitables</option>
              <option>fruits</option>
              <option>fastfood</option>
              <option>biscuits</option>
              <option>grains</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              name="product_name"
              onChange={(e) => setProduct(prev => ({ ...prev, product_name: e.target.value }))}
              value={product.product_name}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              name="price"
              onChange={(e) => setProduct(prev => ({ ...prev, price: e.target.value }))}
              value={product.price}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              name="quantity"
              onChange={(e) => setProduct(prev => ({ ...prev, quantity: e.target.value }))}
              value={product.quantity}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              name="cname"
              onChange={(e) => setProduct(prev => ({ ...prev, cname: e.target.value }))}
              value={product.cname}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Company Location</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              name="clocation"
              onChange={(e) => setProduct(prev => ({ ...prev, clocation: e.target.value }))}
              value={product.clocation}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Upload Images</label>
            <div className="flex items-center gap-3 mt-1">
              <button
                type="button"
                className="p-3 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200"
                onClick={() => document.getElementById("photos").click()}
              >
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="file"
                id="photos"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default SellItem;