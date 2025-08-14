import React from "react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <>
      <div className="flex justify-center items-center md:w-[90%] mx-auto mt-6 gap-4 p-2 md:mt-2 md:p-0 md:h-auto ">
        <div className="flex flex-col gap-2 justify-center items-center md:items-start md:justify-start">
          <h1 className="text-2xl uppercase font-bold">
            Design Your Perfect Room with AiRoomify
          </h1>
          <p className="text-md">
            Stop second-guessing your design choices. <br />
            AiRoomify's cutting-edge AI visualizes your room in different
            styles, helping you create a space you'll love. <br />
            Simply upload a photo and a prompt to see your ideas come to life.
          </p>
          <Link to="/Assistant" className="p-2 w-1/2 text-center bg-[#004adb] rounded-full">
            Get Started
          </Link>
        </div>
        <img
          src="assets/images/heroSectionImage.webp"
          className="w-1/2 rounded-2xl hidden md:block"
          alt="HeroSectionImage"
        />
      </div>
    </>
  );
};
