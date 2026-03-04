import React, { useState } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export function ResetPs() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log({ email, newPassword });
      const res = await axios.post("https://project-nextgen-1dnjds.onrender.com/reset_password", { email, newPassword });
      console.log(res.data);

      if (res.data.token) {
        alert("Create new Password success!");
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        alert("Password reset succeeded but token missing!");
      }
    } catch (err) {
      console.error(err.response?.data || err);
      alert("Create new password failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Please Input your email & new password
          </h2>

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
              <label className="text-sm font-medium">New Password</label>
              <input
                type="password"
                className="mt-1 w-full p-2 rounded-md border"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="text-sm text-center">
              <Link to="/account/verify" className="text-indigo-600 hover:underline">
                Verify again!
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ResetPs;
