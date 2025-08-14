import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const Products = () => {
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [values, setValues] = useState([]);
  const [products, setProducts] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    const categoryId = localStorage.getItem("selectedCategory");

    if (!categoryId) {
      console.warn("No valid category_id found in localStorage");
      return;
    }

    const formData = new FormData();
    formData.append("category_id", categoryId);

    axios
      .post("http://localhost:5000/api/product/get_by_cat", formData)
      .then((res) => {
        console.log("Products fetched:", res.data);

        const productData = Array.isArray(res.data)
          ? res.data
          : res.data.products || [];

        setProducts(productData);
        setValues(productData.map(() => 1)); // Initialize quantity to 1 for each product
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err.response || err);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 650) setSlidesPerView(1);
      else if (window.innerWidth <= 920) setSlidesPerView(2);
      else setSlidesPerView(4);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const incrementValue = (index) => {
    setValues((prev) => {
      const copy = [...prev];
      copy[index] = (copy[index] || 1) + 1;
      return copy;
    });
  };

  const decrementValue = (index) => {
    setValues((prev) => {
      const copy = [...prev];
      if ((copy[index] || 1) > 1) copy[index] -= 1;
      return copy;
    });
  };

  const prevSlide = () => swiperRef.current?.slidePrev();
  const nextSlide = () => swiperRef.current?.slideNext();

  const storeTheID = (data)=>{
    localStorage.setItem("productIdForPro", data)
  }
  // Add product with quantity to localStorage cart
  const addToCart = (product, quantity) => {
    // Read existing cart from localStorage or initialize empty array
    const storedCart = localStorage.getItem("cart");
    let cart = storedCart ? JSON.parse(storedCart) : [];

    // Check if product already exists in cart
    const existingIndex = cart.findIndex(
      (item) => item.product_id === product.product_id
    );

    if (existingIndex >= 0) {
      // Update quantity if product already in cart
      cart[existingIndex].quantity += quantity;
    } else {
      // Add new product to cart
      cart.push({
        product_id: product.product_id,
        quantity,
        name: product.name, // optionally store name/image etc for quick display
        price: product.price,
        image_url: product.image_urls?.[0] || "",
      });
    }

    // Save updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`Added ${quantity} x ${product.name} to cart!`);
  };

  return (
    <>
      <div className="flex w-full justify-between items-center">
        <h1 className="mt-4 mb-2 text-white">Products</h1>
        <div className="flex gap-2">
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="p-2 cursor-pointer rounded-md bg-[#262626] text-white"
            onClick={prevSlide}
          />
          <FontAwesomeIcon
            icon={faChevronRight}
            className="p-2 cursor-pointer rounded-md bg-[#262626] text-white"
            onClick={nextSlide}
          />
        </div>
      </div>

      <Swiper
        slidesPerView={slidesPerView}
        spaceBetween={30}
        freeMode
        modules={[FreeMode]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {products.length === 0 && (
          <p className="text-center w-full text-white">No products found.</p>
        )}

        {products.map((product, idx) => (
          <SwiperSlide key={product.product_id}>
            <div className="w-full rounded-xl bg-[#262626] p-2">
              <Link to={`/product/`} onClick={storeTheID(product.product_id)}>
                <img
                  src={product.image_urls?.[0] || ""}
                  alt={product.name}
                  className="w-full h-auto rounded-xl object-cover"
                />
                <div className="p-2 flex justify-between text-white">
                  <h1 className="font-bold">{product.name}</h1>
                  <h2>${product.price}</h2>
                </div>
              </Link>
              <div className="p-2 flex items-center justify-between">
                <div className="flex gap-2 justify-end">
                  <button
                    className="bg-green-800 p-2 rounded-full text-white"
                    onClick={() => addToCart(product, values[idx] || 1)}
                  >
                    Add to Cart
                  </button>
                  <button className="bg-[#004ADB] p-2 rounded-full text-white">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};
