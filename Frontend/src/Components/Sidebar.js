import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const Sidebar = () => {
  const list = ["Category", "Product", "User", "Order"];
  return (
    <div className="w-[25%] bg-[#515F78] h-[95%] rounded-xl flex flex-col items-center justify-evenly p-2">
      <div className="w-1/3 mx-auto">
        <img src="/assets/images/Logo.png" alt="logo"/>
      </div>
      <ul className="w-full flex flex-col items-center">
        {list.map((items, index) => (
          <li
            key={index}
            className="p-2 mb-2 uppercase bg-[#8F9DA7] rounded-full w-[65%] text-center hover:bg-[#628299] text-black hover:text-white"
          >
            <a href={`/Admin/${items}`} className="w-full p-2">
              {items}
            </a>
          </li>
        ))}
      </ul>
      <button className="flex items-center justify-center gap-2">
        <FontAwesomeIcon icon={faRightFromBracket} className="text-xl"/>
        <p className="uppercase">Logout</p>
      </button>
    </div>
  );
};
