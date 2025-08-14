import React, { useState } from "react";
import { CartNotEmpty } from "../Components/Cart/CartNotEmpty";
import { CartEmpty } from "../Components/Cart/CartEmpty";

export const Cart = () => {
  const [cartRender, setCartRender] = useState(true);
  let cartValue = 3;

  if (cartValue === 0 && cartRender) {
    setCartRender(false);
  } else if (cartValue > 0 && !cartRender) {
    setCartRender(true);
  }

  return (
    <>{cartRender ? <CartNotEmpty cartValue={cartValue} /> : <CartEmpty />}</>
  );
};
