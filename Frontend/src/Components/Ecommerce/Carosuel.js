import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Parallax, Pagination } from 'swiper/modules';

import "swiper/css";
import "swiper/css/pagination";

export const Carosuel = ()=>{
    return(
        <Swiper
          className="w-full h-[50vh] rounded-xl"
          pagination={{
            dynamicBullets: true,
          }}
          loop={true}
          parallax={true}
          modules={[Parallax, Pagination]}
        >
          <SwiperSlide>
            <img
              src="assets/images/forOffice.webp"
              alt="isers"
              className="w-full h-full"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="assets/images/heroSectionImage.webp"
              alt="name"
              className="w-full h-full"
            />
          </SwiperSlide>
        </Swiper>
    )
}