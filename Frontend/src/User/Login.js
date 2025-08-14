import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // ✅ Redirect if user is already logged in
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      navigate("/"); // redirect to home or dashboard
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("password", form.password);

      const res = await axios.post(
          "http://localhost:5000/api/user/login",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );


      // ✅ Store email in localStorage
      localStorage.setItem("userEmail", form.email);
      localStorage.setItem("userId", res.data.user_id);
      localStorage.setItem("userImg", res.data.profile_image);
      navigate("/"); // redirect to home
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.res?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-[87vh]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center p-4 rounded-md bg-white text-black w-fit mb-12"
        encType="multipart/form-data"
      >
        <h2 className="text-lg">Login</h2>
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

        <p>
          New Here?{" "}
          <span className="text-blue-600">
            <Link to="/Register">Register Here</Link>
          </span>
        </p>

        {error && <p className="text-red-600 mt-2">{error}</p>}

        <button
          className="py-2 px-6 text-white center rounded-lg bg-[#b3480e] mt-4"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};
