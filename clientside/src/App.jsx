
import './App.css';
import React, { useState } from "react";

import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Adminlogin from './components/adminlogin';
import AdminForgot from './components/adminforgotpassword';
import AdminResetPassword from './components/adminResetPassword';
import Buyerlogin from './components/seller&buyerlogin';

function App() {
  return(
    <BrowserRouter>
     <Routes>
    <Route path="/" element={<Adminlogin/>} />
    <Route path="/adminforgotpasssword" element={<AdminForgot/>} />
    <Route path="/Adminresetpassword" element={<AdminResetPassword/>} />
    <Route path="/buyerorsellerlogin" element={<Buyerlogin/>} />
     </Routes>
  </BrowserRouter>
  )
}

export default App;
