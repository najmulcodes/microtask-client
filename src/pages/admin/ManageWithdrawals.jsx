import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const ManageWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWithdrawals = () => api.get("/withdrawals").then(r => { setWithdrawals(r.data); setLoading(false); });
  useEffect(() => { fetchWithdrawals(); }, []);

  const approve = async (id) => {
    await api.patch(`/withdrawals/${id}/approve`);
    toast.success("Approved!");
    fetchWithdrawals();
  };

  const reject = async (id) => {
    await api.patch(`/withdrawals/${id}/reject`);
    toast.info("Rejected. Coins refunded.");
    fetchWithdrawals();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Withdrawals</h2>
      {loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" /></div>
        : withdrawals.length === 0 ? <div className="card text-center text-gray-400 py-12">No withdrawal requests.</div> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left border-b">
              <th className="pb-3 text-gray-500 font-medium">Worker</th>
              <th className="pb-3 text-gray-500 font-medium">Coins</th>
              <th className="pb-3 text-gray-500 font-medium">Amount</th>
              <th className="pb-3 text-gray-500 font-medium">Method</th>
              <th className="pb-3 text-gray-500 font-medium">Account</th>
              <th className="pb-3 text-gray-500 font-medium">Date</th>
              <th className="pb-3 text-gray-500 font-medium">Status</th>
            </tr></thead>
            <tbody className="divide-y">
              {withdrawals.map(w => (
                <tr key={w._id}>
                  <td className="py-3">
                    <p className="font-medium text-gray-800">{w.workerName}</p>
                    <p className="text-xs text-gray-400">{w.workerEmail}</p>
                  </td>
                  <td className="py-3 text-amber-600 font-medium">{w.withdrawalCoin} 🪙</td>
                  <td className="py-3 text-green-600 font-medium">${w.withdrawalAmount?.toFixed(2)}</td>
                  <td className="py-3 text-gray-700 capitalize">{w.paymentSystem}</td>
                  <td className="py-3 text-gray-500">{w.accountNumber}</td>
                  <td className="py-3 text-gray-500">{new Date(w.createdAt).toLocaleDateString()}</td>
                  <td className="py-3">
                    {w.status === "pending" ? (
                      <div className="flex gap-2">
                        <button onClick={() => approve(w._id)} className="text-xs bg-green-100 text-green-700 hover:bg-green-200 px-2 py-1 rounded transition-colors">Approve</button>
                        <button onClick={() => reject(w._id)} className="text-xs bg-red-100 text-red-600 hover:bg-red-200 px-2 py-1 rounded transition-colors">Reject</button>
                      </div>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                        ${w.status === "approved" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {w.status}
                      </span>
                    )}
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

export default ManageWithdrawals;
