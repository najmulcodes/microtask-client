import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FaTasks, FaClock, FaCoins } from "react-icons/fa";

const BuyerHome = () => {
  const [stats, setStats] = useState({ totalTasks: 0, pendingTasks: 0, totalPaid: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/tasks/buyer-stats").then(r => { setStats(r.data); setLoading(false); });
  }, []);

  const cards = [
    { icon: <FaTasks className="text-indigo-500" size={24} />, label: "Total Tasks", value: stats.totalTasks, bg: "bg-indigo-50" },
    { icon: <FaClock className="text-amber-500" size={24} />, label: "Pending Workers", value: stats.pendingTasks, bg: "bg-amber-50" },
    { icon: <FaCoins className="text-green-500" size={24} />, label: "Total Coins Paid", value: stats.totalPaid, bg: "bg-green-50" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Buyer Dashboard</h2>
      {loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" /></div> : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {cards.map(c => (
            <div key={c.label} className={`stat-card ${c.bg}`}>
              <div className="flex items-center gap-3">{c.icon}<span className="text-sm text-gray-600 font-medium">{c.label}</span></div>
              <p className="text-3xl font-bold text-gray-800 mt-2">{c.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuyerHome;
