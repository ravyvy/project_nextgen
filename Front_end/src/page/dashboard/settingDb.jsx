import React from 'react'

const settingDb = () => {
  return (
    // គំរូកូដសាមញ្ញក្នុង SettingDb.js
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Account Security */}
        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Account Security</h2>
          <div className="space-y-4">
            <button className="w-full bg-blue-100 text-blue-700 p-2 rounded hover:bg-blue-200 transition">
              Change Password
            </button>
            <button className="w-full bg-gray-100 text-gray-700 p-2 rounded hover:bg-gray-200 transition">
              Enable Two-Factor Auth
            </button>
          </div>
        </div>

        {/* Card 2: Store Information */}

        <div className="bg-white p-4 rounded-xl shadow border">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Store Information</h2>
          <input className="w-full border p-2 mb-3 rounded" placeholder="Store Name" />
          <input className="w-full border p-2 mb-3 rounded" placeholder="Support Email" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
        </div>
      </div>
    </div>
  )
}

export default settingDb