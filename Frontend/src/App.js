import React from "react";
import { Navbar } from "./Components/Navbar";
import { Footer } from "./Components/Footer";
import { Home } from "./Screen/Home";
import { Route, Routes } from "react-router-dom";
import { Assistant } from "./Screen/Assistant";
import { Ecommerce } from "./Screen/Ecommerce";
import { Product } from "./Screen/Product";
import { Cart } from "./Screen/Cart";
import { Admin } from "./Admin/Admin";
import { Login } from "./User/Login";
import { Register } from "./User/Regsiter";
import { useLocation } from 'react-router-dom';
import { Settings } from "./Components/Settings";


const App = () => {
    const location = useLocation();
    const noFooterPaths = ['/Login', '/Register'];

    const hideFooter = noFooterPaths.some(path =>
    location.pathname.toLowerCase().startsWith(path.toLowerCase())
  );
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/index" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Assistant" element={<Assistant />} />
        <Route path="/chat" element={<Assistant />} />
        <Route path="/chatbot" element={<Assistant />} />
        <Route path="/Products" element={<Ecommerce />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/Admin/*" element={<Admin />} />
        <Route path="/Login/*" element={<Login />} />
        <Route path="/Register/*" element={<Register />} />
        <Route path="/Settings/*" element={<Settings />} />
      </Routes>
      {!hideFooter && <Footer />}
    </>
  );
};

export default App;
