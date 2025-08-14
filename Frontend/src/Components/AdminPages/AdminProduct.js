import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

export const AdminProduct = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("http://localhost:5000/api/product/all");
        // Assuming response.data is an array of products
        setCategories(response.data);
      } catch (err) {
        setError("Failed to fetch products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Delete product function
  const handleDelete = async (product_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const formData = new FormData();
      formData.append("product_id", product_id);

      await axios.post("http://localhost:5000/api/product/delete", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setCategories((prev) =>
        prev.filter((product) => product.product_id !== product_id)
      );

      alert("Product deleted successfully.");

      if (
        currentPage > 1 &&
        categories.length % itemsPerPage === 1 &&
        indexOfFirstItem >= categories.length - 1
      ) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete product. Please try again."
      );
    }
  };

  if (loading) return <div className="p-4">Loading products...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="w-[90%] bg-white text-black rounded-lg p-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-300">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Price</th>
            <th className="p-2 text-left">View</th>
            <th className="p-2 text-left">Edit</th>
            <th className="p-2 text-left">Delete</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((data) => (
            <tr
              key={data.product_id}
              className="odd:bg-white even:bg-gray-100 border-t"
            >
              <td className="p-2">{data.product || data.name}</td>
              <td className="p-2">{data.type || data.tag || "-"}</td>
              <td className="p-2">{data.price}</td>
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
                  onClick={() => handleDelete(data.product_id)}
                />
              </td>
            </tr>
          ))}
          {currentItems.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center p-4">
                No products found.
              </td>
            </tr>
          )}
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
