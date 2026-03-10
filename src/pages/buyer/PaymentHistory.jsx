import { useState, useEffect } from "react";
import api from "../../api/axios";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get("/payments/my").then(r => { setPayments(r.data); setLoading(false); }); }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment History</h2>
      {loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" /></div>
        : payments.length === 0 ? <div className="card text-center text-gray-400 py-12">No payment records yet.</div>
        : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left border-b">
              <th className="pb-3 text-gray-500 font-medium">Date</th>
              <th className="pb-3 text-gray-500 font-medium">Coins</th>
              <th className="pb-3 text-gray-500 font-medium">Amount</th>
              <th className="pb-3 text-gray-500 font-medium">Status</th>
            </tr></thead>
            <tbody className="divide-y">
              {payments.map(p => (
                <tr key={p._id}>
                  <td className="py-3 text-gray-700">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 font-medium text-amber-600">+{p.coins} 🪙</td>
                  <td className="py-3 text-gray-700">${p.amount}</td>
                  <td className="py-3"><span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">{p.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
