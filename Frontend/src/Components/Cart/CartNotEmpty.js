import React, { useState, useEffect } from "react";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

export const CartNotEmpty = () => {
  const [cart, setCart] = useState([]); // To store cart items
  const [addCart, setAddCart] = useState(false); // Cart has at least 4 items flag
  const [quantities, setQuantities] = useState([]); // To store individual quantities for each product

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    setQuantities(savedCart.map(item => item.quantity || 1)); // Initialize quantities based on cart
    setAddCart(savedCart.length >= 4); // Set flag if there are 4 or more items
  }, []);

  const incrementValue = (index) => {
    setQuantities((prevQuantities) => {
      const newValues = [...prevQuantities];
      newValues[index] += 1;
      return newValues;
    });
  };

  const decrementValue = (index) => {
    setQuantities((prevQuantities) => {
      const newValues = [...prevQuantities];
      if (newValues[index] > 1) {
        newValues[index] -= 1;
      }
      return newValues;
    });
  };

  const handleBuyNow = async () => {
    if (!cart.length) {
      alert("Cart is empty!");
      return;
    }

    const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("status", "pending");

    const productIds = cart.map((item) => item.product_id);
    formData.append("product_ids", JSON.stringify(productIds)); // Sending all product_ids

    const totalAmount = cart.reduce(
      (sum, item, index) => sum + item.price * quantities[index],
      0
    );

    formData.append("total_amount", totalAmount);
    formData.append("quantity", quantities.reduce((sum, qty) => sum + qty, 0)); // Total quantity

    try {
      const response = await axios.post("http://localhost:5000/api/order/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Clear the cart from localStorage and state after successful order creation
      localStorage.removeItem("cart"); // Remove cart from localStorage

      // Optionally clear the state to reflect the empty cart in the UI
      setCart([]);
      setQuantities([]);

      alert("Order created successfully!");
      console.log(response.data);
    } catch (err) {
      console.error("Order creation failed:", err);
      alert("Failed to create order.");
    }
  };

  return (
    <>
      <div
        className={`md:w-[90%] mx-auto flex flex-col lg:flex-row gap-2 ${addCart ? "h-auto" : "lg:h-screen"}`}
      >
        <div className="lg:w-[75%]">
          <table className="w-full text-center bg-[#515F78] rounded-xl border-separate border-spacing-2" cellPadding={2}>
            <thead>
              <tr>
                <th className="uppercase text-base p-2">Product</th>
                <th className="uppercase text-base p-2">Price</th>
                <th className="uppercase text-base p-2">Qty</th>
                <th className="uppercase text-base p-2">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, index) => (
                <tr key={index} className="border-b border-gray-400">
                  <td className="p-4">
                    <div className="flex flex-col md:flex-row gap-2">
                      <img
                        src={item.image_url}
                        className="w-[180px] rounded-lg"
                        alt={item.name}
                      />
                      <div className="text-left flex flex-col justify-evenly">
                        <h1 className="text-base font-bold uppercase">{item.name}</h1>
                        <h2>
                          <span className="font-bold">Type:</span> {item.type || "N/A"}
                        </h2>
                        <h2>
                          <span className="font-bold">Category:</span> {item.category || "N/A"}
                        </h2>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold">${item.price}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex bg-[#004ADB] justify-between p-2 items-center gap-2 rounded-full">
                      <FontAwesomeIcon
                        icon={faMinus}
                        onClick={() => decrementValue(index)}
                        className="cursor-pointer"
                      />
                      <input
                        type="number"
                        value={quantities[index]}
                        className="text-white bg-transparent w-full text-center"
                        readOnly
                      />
                      <FontAwesomeIcon
                        icon={faPlus}
                        onClick={() => incrementValue(index)}
                        className="cursor-pointer"
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold">${quantities[index] * item.price}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:w-[25%]">
          <div className="bg-[#515F78] rounded-xl p-4 flex flex-col gap-4">
            <h1 className="text-xl uppercase text-center">Summary</h1>
            <hr />
            <div className="w-full">
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase">Subtotal:</span>$
                {cart.reduce(
                  (sum, item, index) => sum + item.price * quantities[index],
                  0
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase">Delivery Charges:</span> $20
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase">Tax:</span> $10
              </div>
            </div>
            <hr />
            <div className="flex justify-between items-center">
              <span className="font-bold uppercase">Estimated Total:</span>$
              {cart.reduce(
                (sum, item, index) => sum + item.price * quantities[index],
                0
              ) + 30}
            </div>
            <button className="bg-[#004ADB] p-2 rounded-full" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
