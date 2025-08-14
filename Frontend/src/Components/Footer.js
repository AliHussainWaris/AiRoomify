import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export const Footer = () => {
  const location = useLocation();
  const [navShow, setNavShow] = useState("block");
  useEffect(() => {
    const handleActive = () => {
      const path = location.pathname;
      if (
        path === "/Assistant" ||
        path === "/chat" ||
        path === "/chatbot" ||
        path === "/Admin" ||
        path === "/Admin/*" ||
        path === "/Admin/Category" ||
        path === "/Admin/Order" ||
        path === "/Admin/User" ||
        path === "/Admin/Product"
      ) {
        setNavShow("hidden");
      } else {
        setNavShow("block bg-[#262626] mt-4 p-4");
      }
    };

    handleActive();
  }, [location]);
  return (
    <>
      <div className={navShow}>
        <div className="w-[90%] mx-auto flex flex-col md:flex-row gap-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <img
                src="assets/images/Logo.png"
                className="w-[30%]"
                alt="Logo"
              />
              <h1 className="text-xl">AiRoomify</h1>
            </div>
            <div className="flex items-center gap-4">
              <FontAwesomeIcon className="text-2xl" icon={faFacebook} />
              <FontAwesomeIcon className="text-2xl" icon={faInstagram} />
              <FontAwesomeIcon className="text-2xl" icon={faTwitter} />
              <FontAwesomeIcon className="text-2xl" icon={faLinkedin} />
            </div>
            <form className="flex gap-2 flex-col md:flex-row">
              <input
                type="email"
                placeholder="Email"
                className="p-2 rounded-md border border-white bg-transparent placeholder:text-white"
              />
              <input
                type="submit"
                className="p-2 bg-[#004adb] rounded-full px-8"
                value="Subscribe"
              />
            </form>
          </div>
          <div></div>
        </div>
      </div>
    </>
  );
};
