import React, { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import apiPath from "./path/apipath";

function SellItem() {
  const location = useLocation();
  const _id = location.state?._id;
  const navigate = useNavigate();
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const categoryRef = useRef(null);

  const categories = [
    "fresh produce", "fruits", "vegitables", "herbs",
    "meat & seafood", 
    "dairy & eggs", 
    "bakery", "food",
    "pantry staples", 
    "snacks & sweets", 
    "beverages", 
    "frozen foods", 
    "breakfast foods", 
    "condiments & spices", 
    "international foods", 
    "organic & natural", 
    "household & cleaning", 
    "personal care", 
    "baby & child"
];


  const [product, setProduct] = useState({
    product_name: "",
    category: "",
    price: "",
    photos: [],
    quantity: "",
    cname: "",
    clocation: "",
    product_id: _id,
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoryRef]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const base64Images = await Promise.all(files.map(convertBase64));
    setProduct((prev) => ({ ...prev, photos: [...prev.photos, ...base64Images] }));
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleCategorySelect = (category) => {
    setProduct((prev) => ({ ...prev, category }));
    setShowCategoryDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiPath()}/addproduct`, product);
      if (res.status === 201) {
        toast.success(res.data.msg, { position: "top-right", autoClose: 3000, theme: "dark" });
        setProduct({
          product_name: "",
          category: "",
          price: "",
          photos: [],
          quantity: "",
          cname: "",
          clocation: "",
          product_id: _id,
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
          <div className="mb-4 relative" ref={categoryRef}>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              name="category"
              placeholder="Enter product category"
              onChange={(e) => setProduct((prev) => ({ ...prev, category: e.target.value }))}
              value={product.category}
              onFocus={() => setShowCategoryDropdown(true)}
            />
            
            {showCategoryDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {categories.map((category, index) => (
                  <div 
                    key={index} 
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCategorySelect(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              name="product_name"
              onChange={(e) => setProduct((prev) => ({ ...prev, product_name: e.target.value }))}
              value={product.product_name}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              name="price"
              onChange={(e) => setProduct((prev) => ({ ...prev, price: e.target.value }))}
              value={product.price}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              name="quantity"
              onChange={(e) => setProduct((prev) => ({ ...prev, quantity: e.target.value }))}
              value={product.quantity}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              name="cname"
              onChange={(e) => setProduct((prev) => ({ ...prev, cname: e.target.value }))}
              value={product.cname}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Company Location</label>
            <input
              type="text"
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              name="clocation"
              onChange={(e) => setProduct((prev) => ({ ...prev, clocation: e.target.value }))}
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

            <div className="mt-3 grid grid-cols-4 gap-2">
              {product.photos.map((photo, index) => (
                <img key={index} src={photo} alt={`Preview ${index}`} className="w-20 h-20 object-cover rounded-md" />
              ))}
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