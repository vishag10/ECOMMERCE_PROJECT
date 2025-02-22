import { Link, useNavigate, useParams } from "react-router-dom";
import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useEffect,useState } from "react";
import axios from "axios";
import apiPath from "./path/apipath";

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
            </div>

            {/* Content Container */}
            <div className="p-4">
                {/* Product Name */}
                <h3 className="text-lg font-semibold text-gray-800 truncate mb-2">
                    {product.name}
                </h3>

                {/* Price */}
                <p className="text-xl font-bold text-gray-900 mb-4">
                    ₹{product.price.toLocaleString()}
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
                        onClick={() => console.log('Delete clicked')}
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
    console.log(_id);

    const [product, setProduct] = useState([]);

    const getproduct = async () => {
        try {
          const res = await axios.get(`${apiPath()}/sellerproduct/${_id}`);
          console.log(res.data);
          setProduct(res.data);
        } catch (error) {
          console.error(error);
        }
      };

      useEffect(() => {
        getproduct();
      }, []);
      
      console.log(product);
      

    const products = [
        {
            id: 1,
            name: "Wireless Headphones",
            price: 2999,
            image: "/api/placeholder/400/300"
        },
        {
            id: 2,
            name: "Smart Watch",
            price: 5999,
            image: "/api/placeholder/400/300"
        },
        {
            id: 3,
            name: "Bluetooth Speaker",
            price: 1999,
            image: "/api/placeholder/400/300"
        },
        {
            id: 4,
            name: "Laptop Bag",
            price: 899,
            image: "/api/placeholder/400/300"
        }
    ];

    return (
        <>

            <div className="container mx-auto p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>

        </>
    )
}

export default SellerProducts;