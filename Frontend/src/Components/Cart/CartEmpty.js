import React from "react";
import { Link } from "react-router-dom";

export const CartEmpty = () => {
  return (
    <>
      <div className="h-screen w-[90%] mx-auto flex md:justify-center items-center">
        <div className="w-full md:w-1/2 bg-[#515F78] h-1/2 rounded-xl flex flex-col justify-center items-center gap-2">
          <h1 className="uppercase font-bold text-lg">The Cart is Empty</h1>
          <Link
            to="/Ecommerce"
            className="p-2 bg-[#004ADB] uppercase rounded-full"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </>
  );
};
