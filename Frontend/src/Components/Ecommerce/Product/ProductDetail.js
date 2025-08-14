import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faStar } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

export const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [values, setValues] = useState(1);
  const [isVertical, setIsVertical] = useState(false);
  const [mainImage, setMainImage] = useState("");

  const productId = localStorage.getItem("productIdForPro");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!productId) return;

    (async () => {
      try {
        const formData = new FormData();
        formData.append("product_id", productId);
        const res = await axios.post("http://localhost:5000/api/product/get_one", formData);
        const p = res.data.product || res.data;
        setProduct(p);
        setMainImage(p.image_urls?.[0] || "");
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    })();
  }, [productId]);

  useEffect(() => {
    const handleResize = () => setIsVertical(window.innerWidth >= 811);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const increment = () => setValues((v) => v + 1);
  const decrement = () => setValues((v) => (v > 1 ? v - 1 : v));
  const setImage = (img) => setMainImage(img);

  const addToCart = () => {
    if (!product) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = cart.findIndex((item) => item.product_id === product.product_id);
    if (idx >= 0) {
      cart[idx].quantity += values;
    } else {
      cart.push({
        product_id: product.product_id,
        quantity: values,
        name: product.name,
        price: product.price,
        image_url: product.image_urls?.[0] || "",
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Added ${values} x ${product.name} to cart`);
  };

  const handleBuyNow = async () => {
  if (!product || !userId) {
    alert("Missing product or user info");
    return;
  }

  // Calculate total amount
  const totalAmount = (product.price * values).toFixed(2);

  // Prepare FormData
  const formData = new FormData();
  formData.append("user_id", userId);
  formData.append("product_ids", [product.product_id]);
  formData.append("total_amount", totalAmount);
  formData.append("quantity", values);
  formData.append("status", "pending");  // You can modify the status as needed

  console.log("Sending FormData:", formData); // Log the FormData for debugging

  try {
    // Send the order request as FormData
    const orderRes = await axios.post("http://localhost:5000/api/order/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(orderRes.data);
    alert("Order created successfully!");
  } catch (err) {
    console.error("Checkout error:", err);
    if (err.response) {
      console.log("Error Response:", err.response);
      console.log("Error Response Data:", err.response.data);
      alert(`Failed to proceed to payment: ${err.response?.data?.message || 'Unknown error'}`);
    } else {
      alert("An error occurred while processing the request.");
    }
  }
};



  if (!product)
    return <p className="text-white text-center mt-10">Loading product...</p>;

  const stars = Array.from({ length: 5 }, (_, i) => (
    <FontAwesomeIcon key={i} icon={faStar} className="text-white text-xl" />
  ));

  return (
    <div className="md:w-[80%] mx-auto flex flex-col gap-2 lg:flex-row justify-center">
      <div className="flex flex-col w-[90%] h-auto mx-auto lg:flex-row lg:w-[75%] items-center gap-2 justify-center">
        <img
          src={mainImage}
          className="w-full lg:w-[70%] md:h-[400px] rounded-xl"
          alt={product.name}
        />
        <Swiper
          slidesPerView={3}
          spaceBetween={isVertical ? 38 : 25}
          direction={isVertical ? "vertical" : "horizontal"}
          className="mySwiper w-full lg:w-[30%] lg:h-[400px]"
        >
          {(product.image_urls || []).map((url, i) => (
            <SwiperSlide key={i}>
              <img
                className="w-[200px] h-[80px] md:h-[120px] lg:h-[135px] rounded-lg cursor-pointer"
                src={url}
                alt={`img-${i}`}
                onClick={() => setImage(url)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="bg-[#515F78] w-[95%] mx-auto lg:w-[25%] p-4 rounded-xl">
        <div className="flex flex-col gap-4">
          <h2 className="uppercase font-bold text-xl">{product.name}</h2>
          <h2 className="text-lg">${(product.price * values).toFixed(2)}</h2>
          <div>{stars}</div>
          <p>{product.description || "No description available."}</p>
          <h2><strong>Type:</strong> {product.type || "N/A"}</h2>
          <h2><strong>Category:</strong> {product.category || "N/A"}</h2>
          <div className="flex items-center justify-between gap-2">
            <div className="flex bg-[#004ADB] p-2 items-center gap-2 rounded-full w-[30%]">
              <FontAwesomeIcon icon={faMinus} onClick={decrement} className="cursor-pointer" />
              <input
                type="number"
                value={values}
                readOnly
                className="text-white bg-transparent w-full text-center"
              />
              <FontAwesomeIcon icon={faPlus} onClick={increment} className="cursor-pointer" />
            </div>
            <button className="bg-green-800 p-2 rounded-full w-[70%]" onClick={addToCart}>
              Add to Cart
            </button>
          </div>
          <button className="bg-[#004ADB] p-2 rounded-full" onClick={handleBuyNow}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};
