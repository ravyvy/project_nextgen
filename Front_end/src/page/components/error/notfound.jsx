import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined, WarningOutlined } from "@ant-design/icons";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white px-4 font-inter overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>

      <div className="relative z-10 text-center max-w-lg">
        <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl text-emerald-500">
          <WarningOutlined style={{ fontSize: '32px' }} />
        </div>

        <h1 className="text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter font-outfit text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none select-none">
          404
        </h1>

        <h2 className="text-4xl md:text-5xl font-black mb-6 font-outfit uppercase tracking-tight text-white relative">
          Lost In <span className="text-emerald-500">Space?</span>
        </h2>

        <p className="mb-12 text-slate-400 text-lg font-medium leading-relaxed italic">
          "The component you are looking for has been overclocked out of existence or moved to a different sector."
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            to="/"
            className="group w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-emerald-500/10"
          >
            <ArrowLeftOutlined className="transition-transform group-hover:-translate-x-1" />
            Return to Base
          </Link>
          <Link
            to="/team"
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 backdrop-blur-md text-white border border-white/10 px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center active:scale-95"
          >
            Contact Support
          </Link>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-[10px] font-black text-emerald-500/50 uppercase tracking-[0.3em]">Project Nextgen / System Error</p>
        </div>
      </div>

      {/* Decorative Matrix-like elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none font-mono text-[8px] leading-none overflow-hidden underline-offset-4">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="whitespace-nowrap mb-1">
            {Math.random().toString(36).substring(2, 15)} ERROR_CODE_404_PAGE_NOT_FOUND_RETRY_CONNECTION_FAILED_INTERNAL_REDIRECT_SECURE_PROTOCOL_ACTIVE_0x99283
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotFound;
