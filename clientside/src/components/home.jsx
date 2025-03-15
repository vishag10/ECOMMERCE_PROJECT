import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiPath from "./path/apipath";
import SpecialDiscountSection from "./SpecialDiscountSection";
import CategoryCarousel from "./CategoryCarousel";
import Footer from "./Footer";
import Filters from "./Filters";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProductCard from "./ProductCard";
import Navbar from "./Navbar";

const LazyMainCarousel = React.lazy(() => import("./Carousel"));
const LazyReviewCarousel = React.lazy(() => import("./carousal2"));

function Home({ useremail }) {
  const [user, setUser] = useState({ email: "", username: "", user_id: "" });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

 
  const getUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
      return;
    }
    try {
      const res = await axios.get(`${apiPath()}/homebuyerseller`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        setUser({ email: res.data.email, username: res.data.username, user_id: res.data._id });
      }
    } catch (error) {
      if (error.response?.data?.msg === "Login time expired please login again") {
        localStorage.removeItem("token");
        setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
      }
    }
  }, [navigate]);

    const getProducts = useCallback(async () => {
      if (!user.user_id) return;
      try {
        const res = await axios.post(`${apiPath()}/getproduct`, { user_id: user.user_id });
        if (res.status === 200) {
          console.log("getproducts",res.data)
          setProducts(res.data);
          setCategories([...new Set(res.data.map((product) => product.category))]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }, [user.user_id]);


    useEffect(() => {
      getUser();
    }, []);
    
    useEffect(() => {
      if (user.user_id) {
        getProducts();
      }
    }, [user.user_id]);
    


    const applyFilters = useCallback((productsToFilter) => {
      return productsToFilter.filter((product) => {
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const matchesPrice = (!minPrice || product.price >= Number(minPrice)) && (!maxPrice || product.price <= Number(maxPrice));
        const matchesSearch = !searchQuery || product.product_name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesPrice && matchesSearch;
      });
    }, [selectedCategories, minPrice, maxPrice, searchQuery]);

  

  const filteredProducts = useMemo(() => applyFilters(products), [products, applyFilters]);

  

  const filteredProductsByCategory = useMemo(() => {
    const result = {};
    categories.forEach((category) => {
      const categoryProducts = products.filter((product) => product.category === category);
      result[category] = applyFilters(categoryProducts);
    });
    return result;
  }, [products, applyFilters, categories]);


  const handleSearch = useCallback((e) => {
    if (e.key === "Enter" || e.type === "click") {
      console.log("Searching for:", searchQuery);
    }
  }, [searchQuery]);


  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("useremail");
    toast.error("Logged out!", { position: "top-right", autoClose: 3000, theme: "dark" });
    setUser({ email: "", username: "", user_id: "" });
    setTimeout(() => navigate("/buyerorsellerlogin"), 3000);
  }, [navigate]);

  return (
    <>
      <Navbar
        user={user}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        handleLogout={handleLogout}
        toggleDropdown={() => setDropdownOpen(!dropdownOpen)}
        dropdownOpen={dropdownOpen}
        navigate={navigate}
      />


      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="fixed left-4 top-29 z-50 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300"
      >
        <Filter size={20} />
      </button>

      {isFilterOpen && (
        <Filters
          categories={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onClose={() => setIsFilterOpen(false)}
        />
      )}


      <div className="mt-32 mb-32">
        <Suspense fallback={<div>Loading Carousel...</div>}>
          <LazyMainCarousel />
        </Suspense>
      </div>

      <SpecialDiscountSection products={products} />


      <div className="w-4/5 mx-auto space-y-10">
        {Object.entries(filteredProductsByCategory).map(([category, products]) =>
          products.length > 0 ? <CategoryCarousel key={category} title={category} products={products} /> : null
        )}
      </div>


      {categories.every((category) => !filteredProductsByCategory[category]?.length) && filteredProducts.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-6 text-gray-900">All Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-gray-500 mb-4">No products found matching your filters.</p>
          <button onClick={() => setSearchQuery("")} className="px-4 py-2 bg-gray-200 rounded-full text-gray-800 hover:bg-gray-300">
            Clear all filters
          </button>
        </div>
      )}


      <div className="mt-10 mb-10">
        <h2 className="text-xl font-bold mb-6 text-gray-900" style={{ marginLeft: "10%" }}>Reviews</h2>
        <Suspense fallback={<div>Loading Reviews...</div>}>
          <LazyReviewCarousel />
        </Suspense>
      </div>


      <Footer />
    </>
  );
}

export default React.memo(Home);
