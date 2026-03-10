import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { FaTrash, FaUserShield } from "react-icons/fa";

const ManageUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => api.get("/users").then(r => { setUsers(r.data); setLoading(false); });
  useEffect(() => { fetchUsers(); }, []);

  const makeAdmin = async (u) => {
    if (!window.confirm(`Make ${u.name} an admin?`)) return;
    await api.patch(`/users/${u._id}/role`, { role: "admin" });
    toast.success(`${u.name} is now admin.`);
    fetchUsers();
  };

  const removeUser = async (u) => {
    if (!window.confirm(`Remove ${u.name}?`)) return;
    await api.delete(`/users/${u._id}`);
    toast.success("User removed.");
    fetchUsers();
  };

  const roleColor = { worker: "bg-blue-100 text-blue-700", buyer: "bg-amber-100 text-amber-700", admin: "bg-purple-100 text-purple-700" };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h2>
      {loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" /></div> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left border-b">
              <th className="pb-3 text-gray-500 font-medium">User</th>
              <th className="pb-3 text-gray-500 font-medium">Email</th>
              <th className="pb-3 text-gray-500 font-medium">Role</th>
              <th className="pb-3 text-gray-500 font-medium">Coins</th>
              <th className="pb-3 text-gray-500 font-medium">Actions</th>
            </tr></thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u._id}>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <img src={u.photoURL || `https://ui-avatars.com/api/?name=${u.name}&background=6366f1&color=fff`}
                        className="w-8 h-8 rounded-full" alt="" />
                      <span className="font-medium text-gray-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-500">{u.email}</td>
                  <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${roleColor[u.role] || "bg-gray-100 text-gray-700"}`}>{u.role}</span></td>
                  <td className="py-3 text-amber-600 font-medium">{u.coins} 🪙</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      {u.role !== "admin" && (
                        <button onClick={() => makeAdmin(u)} className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 hover:bg-purple-200 px-2 py-1 rounded-lg transition-colors">
                          <FaUserShield size={10} /> Make Admin
                        </button>
                      )}
                      <button onClick={() => removeUser(u)} className="flex items-center gap-1 text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded-lg transition-colors">
                        <FaTrash size={10} /> Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
