import React from "react";
import { Carosuel } from "../Components/Ecommerce/Carosuel";
import { Products } from "../Components/Ecommerce/Products";

export const Ecommerce = () => {
  return (
    <>
    <div className="w-[95%] mx-auto">
        <Carosuel />
        <Products/>
    </div>
    </>
  );
};
