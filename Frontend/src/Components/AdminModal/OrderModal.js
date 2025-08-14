import React from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const OrderModal = ({ name, modalValue, setModalValue }) => {
  return (
    <>
      <div
        className={`w-full h-screen z-10 absolute top-0 justify-center items-center ${
          modalValue ? "flex" : "hidden"
        }`}
      >
        <div className="bg-black opacity-50 w-full h-full"></div>
        <div className="bg-[#D9D9D9] p-2 w-auto h-auto rounded-lg absolute text-black">
          <div className="flex justify-between items-center">
            <h1 className="text-xl uppercase font-bold">{name}</h1>
            <button onClick={() => setModalValue(false)}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>
          <form className="flex flex-col">
            <div className="flex p-2 gap-2 w-full">
              <div className="flex flex-col gap-2 w-1/2">
                <label>Order #</label>
                <input
                  type="text"
                  placeholder="Order Number"
                  disabled
                  className="p-2 rounded-lg placeholder:text-black"
                />
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <label>Product</label>
                <select className="p-2 rounded-lg">
                  <option selected disabled>Select Product</option>

                </select>
              </div>
            </div>
            <div className="flex p-2 gap-2">
              <div className="flex flex-col gap-2">
                <label>User Email</label>
                <input
                  type="text"
                  placeholder="xyz@xyz.com"
                  disabled
                  className="p-2 rounded-lg placeholder:text-black"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>User Name</label>
                <input
                  type="text"
                  placeholder="User Name"
                  disabled
                  className="p-2 rounded-lg placeholder:text-black"
                />
              </div>
            </div>
            <div className="flex p-2 gap-2">
              <div className="flex flex-col gap-2">
                <label>Quantity</label>
                <input
                  type="number"
                  placeholder="NULL"
                  min="1"
                  className="p-2 rounded-lg placeholder:text-black"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label>Price</label>
                <input
                  type="number"
                  min="1"
                  placeholder="NULL"
                  className="p-2 rounded-lg placeholder:text-black"
                />
              </div>
            </div>
            <div className="flex gap-2 p-2 w-full">
              <div className="flex flex-col gap-2 w-1/2">
                <label>Product</label>
                <select className="p-2 rounded-lg">
                  <option selected disabled>Select Product</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 w-1/2">
                <label>Product</label>
                <select className="p-2 rounded-lg">
                  <option selected disabled>Select Product</option>

                </select>
              </div>
            </div>
            <textarea className="p-2 rounded-lg resize-none" placeholder="Address" rows={5} cols={5}></textarea>
            <button type="submit" className="p-2 mt-2 rounded-full uppercase text-white bg-[#929292]">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};
