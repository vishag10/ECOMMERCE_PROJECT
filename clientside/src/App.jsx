
import './App.css';
import React, { useState } from "react";

import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Adminlogin from './components/adminlogin';
import AdminForgot from './components/adminforgotpassword';
import AdminResetPassword from './components/adminResetPassword';
import Buyerlogin from './components/seller&buyerlogin';
import Home from './components/home';
import BuyerRegister from './components/seller&buyerregister';



function App() {
  return(
    
    <BrowserRouter>
     <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/adminlogin" element={<Adminlogin/>} />
    <Route path="/adminlogin/adminforgotpasssword" element={<AdminForgot/>} />
    <Route path="/Adminresetpassword" element={<AdminResetPassword/>} />
    <Route path="/buyerorsellerlogin" element={<Buyerlogin/>} />
    <Route path="/signup" element={<BuyerRegister/>} />
     </Routes>
  </BrowserRouter>
  )
}

export default App;
