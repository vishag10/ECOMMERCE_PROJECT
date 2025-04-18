
import './App.css';
import React, { useState } from "react";

import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Adminlogin from './components/adminlogin';
import AdminForgot from './components/adminforgotpassword';
import AdminResetPassword from './components/adminResetPassword';
import Buyerlogin from './components/seller&buyerlogin';
import Home from './components/home';
import BuyerRegister from './components/seller&buyerregister';
import { createContext, useContext } from 'react';
import Profile from './components/profile';
import BuyerForget from './components/seller&buyerforgotpassword';
import BuyerResetPassword from './components/seller&buyerResetpassword';
import AdminHome from './components/adminFrontpage';
import SellItem from './components/sellitem';
import Address from './components/address';
import Product from './components/product';
import CartPage from './components/cart';
import SellerProducts from './components/sellerproducts';
import ProductEdit from './components/productEdit';
import PageWishList from './components/wishlist';
import Orderstatus from './components/orderstatus';
import Foods from './components/foods';
import Offersale from './components/offersale';


const ThemeContext = createContext(null);

function App() {
  const [useremail, setEMAIL] = useState("");
  return(
    <ThemeContext.Provider value={{useremail, setEMAIL}}>
    <BrowserRouter>
     <Routes>
      //home
    <Route path="/" element={<Home useremail={useremail} setEMAIL={setEMAIL} />} />
    //admin routes
    <Route path="/adminlogin" element={<Adminlogin/>} />
    <Route path="/adminlogin/adminforgotpasssword" element={<AdminForgot/>} />
    <Route path="/Adminresetpassword" element={<AdminResetPassword/>} />
    <Route path="/adminhome" element={<AdminHome/>} />
    
    //seller and buyer routes
    <Route path="/buyerorsellerlogin" element={<Buyerlogin useremail={useremail} setEMAIL={setEMAIL} />} />
    <Route path="/signup" element={<BuyerRegister/>} />
    <Route path="/profile" element={<Profile/>} />
    <Route path="/sellerforgot" element={<BuyerForget/>} />
    <Route path="/buyerresetpassword" element={<BuyerResetPassword/>} />
    <Route path="/sellitem" element={<SellItem/>} />
    <Route path="/address" element={<Address/>} />

    //product
    <Route path="/product/:_id" element={<Product/>} />
    <Route path="/sellerproducts/:_id" element={<SellerProducts/>} />
    <Route path="/productedit/:_id" element={<ProductEdit/>} />

    <Route path="/wishlist" element={<PageWishList/>} />
    
    //orderstatus
    <Route path='/orderstatus/:_id' element={<Orderstatus/>}/>

    //Cart
    <Route path="/cart" element={<CartPage/>} />

    <Route path="/food" element={<Foods/>} />
    <Route path="/offer" element={<Offersale/>} />
   
    
     </Routes>
  </BrowserRouter>
  </ThemeContext.Provider>
  )
}

export default App;
