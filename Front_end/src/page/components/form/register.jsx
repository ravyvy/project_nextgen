import React, { useState } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://project-nextgen-1dnjds.onrender.com/register", {
        name,
        email,
        password,
      });

      console.log(res.data);
      alert("Register success!");
      navigate("/account/login");
    } catch (err) {
      console.error(err);
      alert("Register failed!");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input
                type="text"
                className="mt-1 w-full p-2 rounded-md border"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                className="mt-1 w-full p-2 rounded-md border"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                className="mt-1 w-full p-2 rounded-md border"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-sm text-center">
              <Link
                to="/account/login"
                className="text-indigo-600 hover:underline"
              >
                Already have an account? Login
              </Link>
            </div>

            <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
              Register
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;
