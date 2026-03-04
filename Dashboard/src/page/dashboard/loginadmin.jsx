import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  LockOutlined,
  UserOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined
} from "@ant-design/icons";

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

      if (res.data.success) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed. Access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 font-inter overflow-hidden relative">
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-[120px] -ml-64 -mb-64 animate-pulse-slow"></div>

      <div className="w-full max-w-4xl h-[600px] bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl flex overflow-hidden relative z-10 animate-fade-in-up">

        {/* Left Visual Pane */}
        <div className="hidden lg:block w-1/2 h-full relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-600/20 group-hover:bg-emerald-600/10 transition-colors duration-700"></div>
          <img
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200"
            className="w-full h-full object-cover grayscale brightness-50 group-hover:scale-110 transition-transform duration-1000"
            alt="Cybersecurity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>

          <div className="absolute bottom-12 left-12 right-12">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6">
              <SafetyCertificateOutlined style={{ fontSize: '32px', color: '#059669' }} />
            </div>
            <h1 className="text-4xl font-black text-white font-outfit uppercase tracking-tighter leading-tight mb-2">
              Project <span className="text-emerald-500">Nextgen</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Secure Admin Portal</p>
          </div>
        </div>

        {/* Right Authentication Pane */}
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-12">
          <div className="w-full max-w-sm">
            <div className="mb-10 lg:hidden text-center">
              <h2 className="text-3xl font-black text-white font-outfit uppercase tracking-tighter">Admin <span className="text-emerald-500">Access</span></h2>
            </div>

            <div className="mb-8">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Security Challenge</p>
              <h3 className="text-2xl font-black text-white tracking-tight">Identity Required</h3>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold animate-shake">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                    <UserOutlined />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-12 py-4 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700"
                    placeholder="Enter admin ID"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Protocol</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors">
                    <LockOutlined />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl px-12 py-4 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-700"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-900 font-black py-4 rounded-2xl shadow-xl shadow-emerald-500/10 transition-all flex items-center justify-center gap-3 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
              >
                {loading ? "Decrypting..." : "Authorize Portal"}
                {!loading && <ArrowRightOutlined size={16} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-12 pt-8 border-t border-white/5 text-center">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">System Version 4.0.2 / Secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
