import React, { useEffect, useState, useRef } from "react";

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

export const Releated = () => {
  const swiperRef = useRef(null);

  const productName = "Releated Product";
  const imageSrc = "assets/images/office.webp";
  const [slidesPerView, setSlidesPerView] = useState(3);
  const [values, setValues] = useState([1, 1, 1, 1, 1]);

  const incrementValue = (index) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      newValues[index] = newValues[index] + 1;
      return newValues;
    });
  };

  const decrementValue = (index) => {
    setValues((prevValues) => {
      const newValues = [...prevValues];
      if (newValues[index] > 1) {
        newValues[index] = newValues[index] - 1;
      }
      return newValues;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 650) {
        setSlidesPerView(1);
      } else if (window.innerWidth > 650 && window.innerWidth <= 920) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const prevSlide = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  const nextSlide = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  return (
    <div className="w-[95%] mx-auto">
      <div className="flex w-full justify-between items-center">
        <h1 className="mt-4 mb-2">{productName}</h1>
        <div className="flex gap-2">
          <FontAwesomeIcon
            icon={faChevronLeft}
            className="p-2 cursor-pointer rounded-md bg-[#262626]"
            onClick={prevSlide}
          />
          <FontAwesomeIcon
            icon={faChevronRight}
            className="p-2 cursor-pointer rounded-md bg-[#262626]"
            onClick={nextSlide}
          />
        </div>
      </div>
      <div>
        <Swiper
          slidesPerView={slidesPerView}
          spaceBetween={30}
          freeMode={true}
          modules={[FreeMode]}
          className="mySwiper"
          onSwiper={(swiper) => (swiperRef.current = swiper)}
        >
          {[...Array(5)].map((_, index) => (
            <SwiperSlide key={index}>
              <div className="w-full rounded-xl bg-[#262626] p-2">
                <img
                  src={imageSrc}
                  alt={productName}
                  className="w-full h-auto rounded-xl"
                />
                <div className="p-2 flex justify-between">
                  <h1 className="font-bold">Table</h1>
                  <h2>$ 250</h2>
                </div>
                <div className="p-2 flex items-center justify-between">
                  <div className="flex gap-2 justify-end">
                    <button className="bg-green-800 p-2 rounded-full">
                      Add to Cart
                    </button>
                    <button className="bg-[#004ADB] p-2 rounded-full">
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};
