import { useState, useEffect, useCallback } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import { toast } from "react-toastify";
import {
  FaHome, FaTasks, FaClipboardList, FaWallet, FaCoins,
  FaHistory, FaUsers, FaBell, FaBars, FaTimes, FaSignOutAlt, FaPlus,
} from "react-icons/fa";

const NAV = {
  worker: [
    { to: "/dashboard/worker/home", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/worker/task-list", label: "Task List", icon: <FaTasks /> },
    { to: "/dashboard/worker/my-submissions", label: "My Submissions", icon: <FaClipboardList /> },
    { to: "/dashboard/worker/withdrawals", label: "Withdrawals", icon: <FaWallet /> },
  ],
  buyer: [
    { to: "/dashboard/buyer/home", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/buyer/add-task", label: "Add New Task", icon: <FaPlus /> },
    { to: "/dashboard/buyer/my-tasks", label: "My Tasks", icon: <FaTasks /> },
    { to: "/dashboard/buyer/purchase-coin", label: "Purchase Coin", icon: <FaCoins /> },
    { to: "/dashboard/buyer/payment-history", label: "Payment History", icon: <FaHistory /> },
  ],
  admin: [
    { to: "/dashboard/admin/home", label: "Home", icon: <FaHome /> },
    { to: "/dashboard/admin/manage-users", label: "Manage Users", icon: <FaUsers /> },
    { to: "/dashboard/admin/manage-tasks", label: "Manage Tasks", icon: <FaTasks /> },
    { to: "/dashboard/admin/manage-withdrawals", label: "Withdrawals", icon: <FaWallet /> },
  ],
};

const DashboardLayout = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  const navLinks = NAV[user?.role] || [];

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch {}
  }, []);

  // Poll notifications every 30s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllRead = async () => {
    await api.patch("/notifications/mark-all-read");
    setNotifications([]);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-indigo-900 text-white flex flex-col z-30
        transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-indigo-700">
          <span className="text-xl font-bold">🎯 MicroTask</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden"><FaTimes /></button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navLinks.map(link => (
            <NavLink key={link.to} to={link.to} onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors
                ${isActive ? "bg-indigo-700 text-white" : "text-indigo-200 hover:bg-indigo-800 hover:text-white"}`}>
              {link.icon}{link.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-4 border-t border-indigo-700">
          <div className="flex items-center gap-3 mb-3">
            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
              className="w-9 h-9 rounded-full object-cover border-2 border-indigo-400" alt="" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user.name}</p>
              <p className="text-xs text-indigo-300 capitalize">{user.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-indigo-300 hover:text-white text-sm transition-colors">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600">
              <FaBars size={20} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
              <FaCoins className="text-amber-500" />
              <span className="text-sm font-bold text-amber-700">{user.coins} coins</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="sm:hidden flex items-center gap-1">
              <FaCoins className="text-amber-500" size={14} />
              <span className="text-sm font-bold text-amber-700">{user.coins}</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setShowNotif(v => !v)}
                className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors">
                <FaBell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotif && (
                <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-lg border z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <span className="font-semibold text-sm">Notifications</span>
                    {notifications.length > 0 && (
                      <button onClick={markAllRead} className="text-xs text-indigo-500 hover:underline">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-6">No new notifications</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n._id} className="px-4 py-3 border-b last:border-0 hover:bg-gray-50">
                          <p className="text-sm text-gray-700">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
              className="w-8 h-8 rounded-full object-cover border-2 border-indigo-200" alt="" />
            <div className="hidden md:block text-right">
              <p className="text-sm font-semibold text-gray-800 leading-none">{user.name}</p>
              <p className="text-xs text-gray-400 capitalize">{user.role}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet context={{ refreshUser }} />
        </main>

        <footer className="bg-white border-t text-center text-xs text-gray-400 py-3">
          © {new Date().getFullYear()} MicroTask Platform. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
