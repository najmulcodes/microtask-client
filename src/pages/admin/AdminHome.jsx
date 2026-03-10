import { useState, useEffect } from "react";
import api from "../../api/axios";
import { FaUsers, FaShoppingBag, FaCoins, FaDollarSign } from "react-icons/fa";

const AdminHome = () => {
  const [stats, setStats] = useState({ workers: 0, buyers: 0, totalCoins: 0, totalPayments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/users/stats"), api.get("/payments/total")])
      .then(([usersRes, payRes]) => {
        setStats({ ...usersRes.data, totalPayments: payRes.data.totalPayments });
        setLoading(false);
      });
  }, []);

  const cards = [
    { icon: <FaUsers className="text-indigo-500" size={24} />, label: "Total Workers", value: stats.workers, bg: "bg-indigo-50" },
    { icon: <FaShoppingBag className="text-amber-500" size={24} />, label: "Total Buyers", value: stats.buyers, bg: "bg-amber-50" },
    { icon: <FaCoins className="text-yellow-500" size={24} />, label: "Total Coins", value: stats.totalCoins, bg: "bg-yellow-50" },
    { icon: <FaDollarSign className="text-green-500" size={24} />, label: "Total Payments", value: `$${stats.totalPayments}`, bg: "bg-green-50" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h2>
      {loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" /></div> : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(c => (
            <div key={c.label} className={`stat-card ${c.bg}`}>
              <div className="flex items-center gap-2">{c.icon}<span className="text-xs text-gray-600 font-medium">{c.label}</span></div>
              <p className="text-2xl font-bold text-gray-800 mt-2">{c.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminHome;
