import React, { useState } from "react";
import axios from "axios";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const CategoryModal = ({ name, modalValue, setModalValue }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }
    if (!categoryImage) {
      setError("Category image is required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", categoryName);
      formData.append("image", categoryImage);

      const res = await axios.post(
        "http://localhost:5000/api/category/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccess("Category created successfully!");
      setCategoryName("");
      setCategoryImage(null);

      setTimeout(() => {
        setModalValue(false);
        setSuccess("");
      }, 1500); // close modal after 1.5 seconds

      console.log("Response:", res.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create category. Please try again."
      );
    }
  };

  return (
    <>
      <div
        className={`w-full h-screen z-10 absolute top-0 justify-center items-center ${
          modalValue ? "flex" : "hidden"
        }`}
      >
        <div className="bg-black opacity-50 w-full h-full"></div>
        <div className="bg-[#D9D9D9] p-4 w-auto h-auto rounded-lg absolute text-black max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl uppercase font-bold">{name}</h1>
            <button onClick={() => setModalValue(false)}>
              <FontAwesomeIcon icon={faX} />
            </button>
          </div>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label>Category Name</label>
              <input
                type="text"
                placeholder="Enter the Category"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="p-2 rounded-lg placeholder:text-black border"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>Category Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCategoryImage(e.target.files[0])}
                className="p-2 rounded-lg placeholder:text-black border"
                required
              />
            </div>

            {error && <p className="text-red-600">{error}</p>}
            {success && <p className="text-green-600">{success}</p>}

            <button
              type="submit"
              className="p-2 bg-[#929292] rounded-full hover:bg-[#7a7a7a] transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
