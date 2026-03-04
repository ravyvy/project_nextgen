import React, { useState } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, MailOutlined, LockOutlined, UserAddOutlined, ArrowRightOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://project-nextgen-1dnjds.onrender.com/register", {
        name,
        email,
        password,
      });

      Swal.fire({
        title: "Registration Successful!",
        text: "Your account has been created. Please login.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });

      navigate("/account/login");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Registration Failed",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#10b981",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-4 py-20 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-20 -ml-20 -mt-20"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-20 -mr-20 -mb-20"></div>

        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-[2.5rem] p-10 border border-white/20 relative z-10 animate-fade-in-up">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl mb-4">
              <UserAddOutlined style={{ fontSize: '32px' }} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Join Nextgen</h2>
            <p className="text-slate-500 font-medium">Create your account in seconds</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <UserOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <MailOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <LockOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              disabled={loading}
              className={`w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? "Creating Account..." : "Start Your Journey"}
              {!loading && <ArrowRightOutlined className="transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium">
              Already a member?{" "}
              <Link to="/account/login" className="text-emerald-600 font-black hover:underline">
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Register;
