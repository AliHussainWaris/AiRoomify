import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export const Navbar = () => {
  const [navFix, setNavFix] = useState("");
  const [btnContent, setBtnContent] = useState("");
  const [routing, setRouting] = useState("");
  const [hideWhenNav, sethideWhenNav] = useState(true);
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (!email) {
          setError("No user email found in localStorage.");
          return;
        }

        const formData = new FormData();
        formData.append("email", email);

        const res = await axios.post(
          "http://localhost:5000/api/user/get",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        localStorage.setItem("userImg" , res.data.profile_image)
        setPreviewImage(res.data.profile_image);
      } catch (err) {
        setError("Failed to load user data.");
      }
    };

    fetchUserData();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setNavFix("fixed bg-[#262626] -mt-2");
    } else {
      setNavFix("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const handleActive = () => {
      const path = location.pathname;
      if (
        path === "/" ||
        path === "/home" ||
        path === "/index" ||
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
        setBtnContent("Shop with us");
        setRouting("/Ecommerce");
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
          setNavFix("hidden");
        }
      } else {
        setBtnContent("Generate Image");
        setRouting("/Assistant");
      }
    };

    if (location.pathname === "/login" || location.pathname === "/register") {
      sethideWhenNav(false);
    } else {
      sethideWhenNav(true);
    }

    window.addEventListener("scroll", handleScroll);
    handleActive();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location]);

  const userButton = () => {
    return (
      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center gap-2">
          <Link
            to={routing}
            className="uppercase text-sm bg-[#004ADB] p-2 text-white rounded-full px-4"
          >
            {btnContent}
          </Link>
          <Link to="/Cart">
            <FontAwesomeIcon icon={faCartShopping} />
          </Link>
          <div
            className="w-10 h-10 rounded-full bg-[#D9D9D9] flex justify-center items-center cursor-pointer overflow-hidden"
            onClick={toggleDropdown}
          >
            {previewImage ? (
              <img
                src={previewImage}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <FontAwesomeIcon icon={faUser} />
            )}
          </div>
        </div>

        {dropdownVisible && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md py-2 z-50">
            <Link
              to="/Settings"
              className="block px-4 py-2 hover:bg-gray-100 text-black"
              onClick={() => setDropdownVisible(false)}
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-black"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex items-center justify-between p-2 w-full z-50 ${navFix}`}>
      <Link to="/" className="flex items-center">
        <img src="assets/images/Logo.png" className="w-[70px]" alt="Logo" />
        <h1 className="text-xl hidden md:block">AiRoomify</h1>
      </Link>
      {hideWhenNav && userButton()}
    </div>
  );
};
