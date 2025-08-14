import React from "react";
import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { AdminCategory } from "../Components/AdminPages/AdminCategory";
import { AdminProduct } from "../Components/AdminPages/AdminProduct";
import { AdminUser } from '../Components/AdminPages/AdminUser'
import { AdminOrder } from '../Components/AdminPages/AdminOrder'


export const Admin = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminCategory />} />
          <Route path="Category" element={<AdminCategory />} />
          <Route path="Product" element={<AdminProduct />} />
          <Route path="User" element={<AdminUser />} />
          <Route path="Order" element={<AdminOrder />} />
        </Route>
      </Routes>
    </>
  );
};
