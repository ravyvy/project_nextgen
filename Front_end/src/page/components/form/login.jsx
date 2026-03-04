import React, { useState } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("https://project-nextgen-1dnjds.onrender.com/login", {
        email,
        password,
      });

      console.log(res.data);

      // example: save token
      // localStorage.setItem("token", res.data.token);

      alert("Login success!");
      localStorage.setItem("token", res.data.token);
      navigate("/"); // redirect to home
    } catch (err) {
      console.error(err);
      alert("Email or password incorrect!");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-sm text-center">
              <Link to="/account/register"className="text-indigo-600 me-3 hover:underline">
                Create an account 
              </Link>
              <Link to="/account/forgot"className="text-red-600 hover:underline">
               Forgot Password
              </Link>
            </div>

            <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
              Login
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;
