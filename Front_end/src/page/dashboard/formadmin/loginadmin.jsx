import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("https://project-nextgen-1dnjds.onrender.com/login_admin", {
        username,
        password,
      });

      // ✅ NO TOKEN
      if (res.data.success) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
        navigate("/dashboards");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-900 via-indigo-950 to-black">
      <div className="w-full max-w-4xl h-[480px] bg-gray-900/70 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl flex overflow-hidden">
        
        {/* Left Image */}
        <div
          className="hidden md:block w-1/2 h-full bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1555949963-aa79d1a9c766?auto=format&fit=crop&q=80&w=2000')",
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/40 to-transparent" />
          <div className="relative h-full flex items-center justify-center">
            <h1 className="text-5xl font-bold text-white tracking-wider">
              ADMIN<span className="text-cyan-400">.</span>
            </h1>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 h-full flex items-center justify-center p-8">
          <form onSubmit={handleLogin} className="w-full max-w-sm space-y-6">
            
            {error && (
              <p className="text-red-400 text-sm text-center bg-red-950/40 py-2 rounded-lg">
                {error}
              </p>
            )}

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-800/60 border border-gray-600 text-white rounded-lg px-4 py-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800/60 border border-gray-600 text-white rounded-lg px-4 py-3 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-cyan-600 to-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "LOGIN"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
