import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

export const AdminUser = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const users = [
    { name: "Ali Hussain", type: "Admin", email:"mohammedalihussainwaris@gmail.com" },
    { name: "Ali Hussain", type: "User", email:"ah700672@gmail.com" },
    { name: "Momin Hasnain", type: "Admin", email:"mominhasnain8@gmail.com" },
  ];
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(users.length / itemsPerPage);
  return (
    <div className="w-[90%] bg-white text-black rounded-lg p-4">
      <table className="w-full border-collapse text-center">
        <thead>
          <tr className="bg-gray-300">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Type</th>
            <th className="p-2">View</th>
            <th className="p-2">Edit</th>
            <th className="p-2">Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((data, index) => (
            <tr key={index} className="odd:bg-white even:bg-gray-100 border-t">
              <td className="p-2">{data.name}</td>
              <td className="p-2">{data.email}</td>
              <td className="p-2">{data.type}</td>
              <td className="p-2">
                <FontAwesomeIcon
                  icon={faEye}
                  className="text-green-500 cursor-pointer"
                />
              </td>
              <td className="p-2">
                <FontAwesomeIcon
                  icon={faPencil}
                  className="text-blue-500 cursor-pointer"
                />
              </td>
              <td className="p-2">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-red-500 cursor-pointer"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4 gap-2 flex-wrap">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-3 py-1 rounded-full ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-300"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
