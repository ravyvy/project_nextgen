import React, { useState, useEffect } from 'react';
import axios from "axios";

const CustomersDb = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:9000/get_all_user");

      // ✅ ត្រឹមត្រូវសម្រាប់ backend របស់អ្នក
      setUsers(response.data.data || []);

    } catch (err) {
      console.error("Fetch error:", err);
      setError("មិនអាចទាញយកទិន្នន័យបានទេ!");
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, []);


  // 🗑️ Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("តើអ្នកចង់លុប user នេះមែនទេ?")) return;

    try {
      await axios.delete(`http://localhost:9000/delete_user/${id}`);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      alert("លុបមិនបានទេ!");
    }
  };

  if (loading) return <div className="p-5 text-center">loading...</div>;
  if (error) return <div className="p-5 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Table Users</h2>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Password</th>
              <th className="py-3 px-4 text-left">Created At</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  គ្មានទិន្នន័យ
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.id || index}
                  className="border-b hover:bg-gray-100"
                >
                  <td className="py-3 px-4">{user.id}</td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 text-gray-400">
                    ********
                  </td>
                  <td className="py-3 px-4">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="py-3 px-4 text-center space-x-2">
                   
                    <button
                      className="cursor-pointer text-white px-3 py-1 rounded  hover:bg-red-600"
                      onClick={() => handleDelete(user.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersDb;
