import React, { useState } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export function forgot() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:9000/forgot_password", {
        email,
      });
      console.log(res.data);
      alert("Check Code in Email !");
      navigate("/account/verify"); // redirect to home
    } catch (err) {
      console.error(err);
      alert("Email  incorrect!");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Please Input Email</h2>

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

            <div className="text-sm text-center">
              <Link to="/account/login"className="text-indigo-600 me-3 hover:underline">
                Create an account 
              </Link>
            </div>

            <button className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700">
              Send Code
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default forgot;
