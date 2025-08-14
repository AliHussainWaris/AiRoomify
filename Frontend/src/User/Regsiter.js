import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate(); // for redirect

  // State to hold form data
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // For error and success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);

      // If you want to send other fields like user_id, etc., add here similarly
      // formData.append('user_id', 'some_id');

      const response = await axios.post(
        "http://localhost:5000/api/user/register",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccess("Registration successful!");
      setForm({ name: "", email: "", password: "", confirmPassword: "" });
      console.log(response.data);

      // Redirect to login after short delay
      setTimeout(() => {
        navigate("/Login");
      }, 1000);
    } catch (err) {
      console.error("Full register error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <>
      <div className="flex justify-center items-center h-[87vh]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center p-4 rounded-md bg-white text-black w-fit mb-12"
          encType="multipart/form-data"
        >
          <h2 className="text-lg">Sign Up</h2>
          <input
            className="outline-none bg-gray-200 my-2 px-4 py-2 rounded-full"
            type="text"
            name="name"
            placeholder="Enter Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="outline-none bg-gray-200 my-2 px-4 py-2 rounded-full"
            type="email"
            name="email"
            placeholder="Enter Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="outline-none bg-gray-200 my-2 px-4 py-2 rounded-full"
            type="password"
            name="password"
            placeholder="Enter Your Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            className="outline-none bg-gray-200 my-2 px-4 py-2 rounded-full"
            type="password"
            name="confirmPassword"
            placeholder="Re-enter Your Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          <p>
            Already registered?{" "}
            <span className="text-blue-600">
              <Link to="/Login">Login Here</Link>
            </span>
          </p>

          {error && <p className="text-red-600 mt-2">{error}</p>}
          {success && <p className="text-green-600 mt-2">{success}</p>}

          <button
            className="py-2 px-6 text-white center rounded-lg bg-[#b3480e] mt-4"
            type="submit"
          >
            Register
          </button>
        </form>
      </div>
    </>
  );
};
