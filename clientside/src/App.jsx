
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
    //seller and buyer routes
    <Route path="/buyerorsellerlogin" element={<Buyerlogin useremail={useremail} setEMAIL={setEMAIL} />} />
    <Route path="/signup" element={<BuyerRegister/>} />
    <Route path="/profile" element={<Profile/>} />
    <Route path="/sellerforgot" element={<BuyerForget/>} />
    <Route path="/buyerresetpassword" element={<BuyerResetPassword/>} />
     </Routes>
  </BrowserRouter>
  </ThemeContext.Provider>
  )
}

export default App;
