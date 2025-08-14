import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

export const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/category/get-all")
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  const handleDelete = async (categoryId) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const formData = new FormData();
      formData.append("category_id", categoryId);

      await axios.post("http://localhost:5000/api/category/delete", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCategories((prev) =>
        prev.filter((cat) => cat.category_id !== categoryId)
      );
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  return (
    <div className="w-[90%] bg-white text-black rounded-lg p-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-300">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">View</th>
            <th className="p-2 text-left">Edit</th>
            <th className="p-2 text-left">Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((category) => (
            <tr
              key={category.category_id}
              className="odd:bg-white even:bg-gray-100 border-t"
            >
              <td className="p-2">{category.name}</td>
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
                  onClick={() => handleDelete(category.category_id)}
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
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-gray-300"
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
