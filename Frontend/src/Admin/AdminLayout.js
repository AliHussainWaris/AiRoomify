import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Components/Sidebar";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import { CategoryModal } from "../Components/AdminModal/CategoryModal";
import { OrderModal } from "../Components/AdminModal/OrderModal";
import { UserModal } from "../Components/AdminModal/UserModal";
import { ProductModal } from "../Components/AdminModal/ProductModal";

export const AdminLayout = () => {
  const location = useLocation();
  const path = location.pathname;
  const Location = path.split("/");
  const [ModalOpen, setModalOpen] = useState(false);
  const openModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className="flex w-[80%] h-screen items-center mx-auto gap-2">
        <Sidebar />
        <div className="w-[80%] bg-[#515F78] h-[95%] rounded-xl flex flex-col gap-2 items-center">
          <div className="bg-[#8F9DA7] p-2 rounded-full w-[90%] flex items-center mt-4 justify-between">
            <h1 className="uppercase text-black">{Location[2]}</h1>
            <button className="btn rounded-full" onClick={() => openModal()}>
              <FontAwesomeIcon
                icon={faPlusCircle}
                className="text-black text-xl"
              />
            </button>
          </div>
          <Outlet />
        </div>
      </div>
      {Location[2] === "Category" && (
        <CategoryModal
          modalValue={ModalOpen}
          name={Location[2]}
          setModalValue={setModalOpen}
        />
      )}
      {Location[2] === "Order" && (
        <OrderModal
          modalValue={ModalOpen}
          name={Location[2]}
          setModalValue={setModalOpen}
        />
      )}
      {Location[2] === "User" && (
        <UserModal
          modalValue={ModalOpen}
          name={Location[2]}
          setModalValue={setModalOpen}
        />
      )}
      {Location[2] === "Product" && (
        <ProductModal
          modalValue={ModalOpen}
          name={Location[2]}
          setModalValue={setModalOpen}
        />
      )}
    </>
  );
};
