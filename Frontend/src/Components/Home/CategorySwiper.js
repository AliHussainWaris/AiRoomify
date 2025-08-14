import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/free-mode";

export const CategorySwiper = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/category/get-all")
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  const handleCategoryClick = (id) => {
    localStorage.setItem("selectedCategory", id);
  };

  return (
    <Swiper
      freeMode={true}
      spaceBetween={20}
      modules={[FreeMode]}
      className="mySwiper"
      breakpoints={{
        0: {
          slidesPerView: 1,
        },
        651: {
          slidesPerView: 2,
        },
        1025: {
          slidesPerView: 3,
        },
      }}
    >
      {categories.map((cat) => (
        <SwiperSlide key={cat.category_id}>
          <Link to="/products" onClick={() => handleCategoryClick(cat.category_id)}>
            <div className="rounded-xl overflow-hidden relative cursor-pointer">
              <img
                src={cat.image_url}
                alt={cat.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-center">
                {cat.name}
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
