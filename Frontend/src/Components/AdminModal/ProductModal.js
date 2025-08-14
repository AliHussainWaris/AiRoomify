import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

export const ProductModal = ({ modalValue, setModalValue }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [tag, setTag] = useState("");
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/category/get-all")
      .then((res) => setCategories(res.data || []))
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setCategories([]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("tag", tag);
    formData.append("category_id", categoryId);

    images.forEach((img) => {
      formData.append("image_urls", img);
    });

    try {
      await axios.post("http://localhost:5000/api/product/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Product created!");
      setTimeout(() => {
        setModalValue(false);
        setSuccess("");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to create product.");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-20 flex justify-center items-center ${
        modalValue ? "flex" : "hidden"
      }`}
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={() => setModalValue(false)}
      ></div>

      <div className="relative z-30 bg-white text-black p-6 rounded-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Product</h2>
          <FontAwesomeIcon
            icon={faX}
            className="cursor-pointer"
            onClick={() => setModalValue(false)}
          />
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded text-black"
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 border rounded text-black"
            rows={3}
            required
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 border rounded text-black"
            required
          />

          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="p-2 border rounded text-black"
            required
          />

          <input
            type="text"
            placeholder="Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="p-2 border rounded text-black"
          />

          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              console.log("Selected categoryId:", e.target.value);
            }}
            required
          >
            <option value="" disabled>
              Select Category
            </option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            multiple
            onChange={(e) => setImages([...e.target.files])}
            className="p-2 border rounded text-black"
            required
          />

          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}

          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};
