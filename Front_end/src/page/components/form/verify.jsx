import React, { useState } from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { Link, useNavigate } from "react-router-dom";
import { SafetyOutlined, MailOutlined, ArrowRightOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";
import Swal from "sweetalert2";

export function Verify() {
  const [email, setEmail] = useState("");
  const [code, setcode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://project-nextgen-1dnjds.onrender.com/verify_reset_code", {
        email,
        code
      });

      Swal.fire({
        title: "Code Verified!",
        text: "You can now create your new password.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });

      navigate("/account/resetps");
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Verification Failed",
        text: "The code or email is incorrect!",
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>

        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-[2.5rem] p-10 border border-white/20 relative z-10 animate-fade-in-up">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl mb-4">
              <SafetyOutlined style={{ fontSize: '32px' }} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">Verify Code</h2>
            <p className="text-slate-500 font-medium">Almost there! Enter the code from your email</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Verification Code</label>
              <div className="relative">
                <SafetyOutlined className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                  placeholder="Enter 6-digit code"
                  value={code}
                  onChange={(e) => setcode(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              disabled={loading}
              className={`w-full bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 group ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
              {!loading && <ArrowRightOutlined className="transition-transform group-hover:translate-x-1" />}
            </button>
          </form>

          <div className="mt-10 text-center">
            <Link to="/account/forgot" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-emerald-600 transition-colors">
              <ArrowLeftOutlined /> Resend Code
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Verify;
