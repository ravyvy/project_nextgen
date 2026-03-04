import React, { useState } from "react";
import axios from "axios";

const SettingDb = () => {
  // 🔹 get username from localStorage
  const admin = JSON.parse(localStorage.getItem("admin"));

  // 🔹 password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 change password function
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password not match");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "https://project-nextgen-1dnjds.onrender.com/changeps_admin",
        {
          id: admin.id,              // ✅ IMPORTANT
          oldPassword,
          newPassword,
          confirmPassword
        }
      );

      alert(res.data.message || "Password updated");

      // clear inputs
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Error change password");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div 
  className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8"
  style={{ fontFamily: 'system-ui, -apple-system, "Khmer OS", Arial, sans-serif' }}
>
  <div className="mx-auto max-w-2xl w-full">
    {/* Header */}
    <div className="text-center mb-10">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      <p className="mt-3 text-gray-600">
        Admin Manager: <span className="font-semibold text-gray-800">{admin?.username || '—'}</span>
      </p>
    </div>

    {/* Card - centered */}
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mx-auto">
      {/* Card header */}
      <div className="px-6 py-5 bg-linear-to-r from-gray-50 to-white border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          Change Admin Password
        </h2>
        <p className="mt-1.5 text-sm text-gray-500 text-center">
          Please enter your current and new password
        </p>
      </div>

      {/* Form content */}
      <div className="p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Current Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     outline-none transition-all"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     outline-none transition-all"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                     outline-none transition-all"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleChangePassword}
          disabled={loading}
          className={`
            w-full py-3.5 px-6 font-medium text-white rounded-lg
            transition-all duration-200 flex items-center justify-center
            ${loading 
              ? "bg-blue-400 cursor-not-allowed" 
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow"
            }
          `}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </>
          ) : "Update Password"}
        </button>
      </div>
    </div>

    {/* Optional: small footer note */}
    <p className="text-center text-sm text-gray-500 mt-8">
      Make sure to use a strong password • Minimum 8 characters
    </p>
  </div>
</div>
  );
};

export default SettingDb;
