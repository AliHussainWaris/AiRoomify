import React, { useState, useEffect } from "react";
import axios from "axios";

export const Settings = () => {
  const [user, setUser] = useState({
    user_id: "",
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    role: "",
    profile_image: "",
    address: "",
    phone_no: "",
    stripe_id: "",
  });

  const [newProfileImage, setNewProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

        // Set user but don't prefill password
        setUser((prev) => ({
          ...prev,
          ...res.data,
          password: "", // clear password
        }));
        setPreviewImage(res.data.profile_image);
      } catch (err) {
        setError("Failed to load user data.");
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("user_id", user.user_id);
      formData.append("name", user.name);
      formData.append("email", user.email); // email won't change
      formData.append("age", user.age);
      formData.append("gender", user.gender);
      formData.append("role", user.role);
      formData.append("address", user.address);
      formData.append("phone_no", user.phone_no);
      formData.append("stripe_id", user.stripe_id);

      if (user.password.trim()) {
        formData.append("password", user.password);
      }

      if (newProfileImage) {
        formData.append("profile_image", newProfileImage);
      }

      await axios.put("http://localhost:5000/api/user/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update profile. Please try again."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center min-h-[87vh] bg-white text-black p-8 max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-6">User Settings</h2>

      <div className="w-full space-y-4">
        <div className="flex items-center gap-4">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border flex items-center justify-center bg-gray-200">
              No Image
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div>
          <label className="font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="font-medium">Email:</label>
          <input
            type="text"
            name="email"
            value={user.email}
            className="w-full border p-2 rounded bg-gray-100"
            disabled
          />
        </div>

        <div>
          <label className="font-medium">Phone Number:</label>
          <input
            type="text"
            name="phone_no"
            value={user.phone_no}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-medium">Address:</label>
          <input
            type="text"
            name="address"
            value={user.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="font-medium">Role:</label>
          <select
            name="role"
            value={user.role}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            disabled
          >
            <option value="Customer">Customer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="font-medium">
            Password:{" "}
            <span className="text-sm text-gray-500">
              (Leave blank to keep current password)
            </span>
          </label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            placeholder="Enter new password"
          />
        </div>

        {error && <p className="text-red-600 mt-2">{error}</p>}
        {success && <p className="text-green-600 mt-2">{success}</p>}

        <button
          type="submit"
          className="py-2 px-6 text-white rounded-lg bg-[#b3480e] mt-4"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};
