import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { FaCoins, FaDollarSign } from "react-icons/fa";

const MIN_COINS = 200;

const Withdrawals = () => {
  const { user, refreshUser } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const coinToWithdraw = Number(watch("coinToWithdraw", 0));
  const withdrawAmount = (coinToWithdraw / 20).toFixed(2);

  const fetchWithdrawals = () => api.get("/withdrawals/my").then(r => { setWithdrawals(r.data); setLoading(false); });
  useEffect(() => { fetchWithdrawals(); }, []);

  const onSubmit = async (data) => {
    try {
      await api.post("/withdrawals", { ...data, coinToWithdraw: Number(data.coinToWithdraw) });
      await refreshUser();
      toast.success("Withdrawal request submitted!");
      reset();
      fetchWithdrawals();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  const hasEnough = user?.coins >= MIN_COINS;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Withdrawals</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="stat-card bg-amber-50">
          <div className="flex items-center gap-2 text-amber-600"><FaCoins /><span className="text-sm font-medium">Current Coins</span></div>
          <p className="text-3xl font-bold text-gray-800 mt-2">{user?.coins}</p>
        </div>
        <div className="stat-card bg-green-50">
          <div className="flex items-center gap-2 text-green-600"><FaDollarSign /><span className="text-sm font-medium">Withdrawal Value</span></div>
          <p className="text-3xl font-bold text-gray-800 mt-2">${((user?.coins || 0) / 20).toFixed(2)}</p>
        </div>
      </div>

      <div className="card max-w-md mb-8">
        <h3 className="font-semibold text-gray-800 mb-1">Request Withdrawal</h3>
        <p className="text-xs text-gray-400 mb-4">Minimum {MIN_COINS} coins ($10)</p>
        {hasEnough ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Coins to Withdraw</label>
              <input {...register("coinToWithdraw", {
                required: "Required",
                min: { value: MIN_COINS, message: `Min ${MIN_COINS}` },
                max: { value: user?.coins, message: `Max ${user?.coins}` },
              })} type="number" min={MIN_COINS} max={user?.coins} className="input-field mt-1" />
              {errors.coinToWithdraw && <p className="text-red-500 text-xs mt-1">{errors.coinToWithdraw.message}</p>}
              <p className="text-xs text-green-600 mt-1">= ${withdrawAmount}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Withdraw Amount ($)</label>
              <input value={`$${withdrawAmount}`} disabled className="input-field mt-1 bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Payment System</label>
              <select {...register("paymentSystem", { required: "Required" })} className="input-field mt-1">
                <option value="">Select</option>
                <option value="stripe">Stripe</option>
                <option value="bkash">Bkash</option>
                <option value="rocket">Rocket</option>
                <option value="nagad">Nagad</option>
                <option value="paypal">PayPal</option>
              </select>
              {errors.paymentSystem && <p className="text-red-500 text-xs mt-1">{errors.paymentSystem.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Account Number</label>
              <input {...register("accountNumber", { required: "Required" })} className="input-field mt-1" placeholder="Your account number" />
              {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber.message}</p>}
            </div>
            <button type="submit" className="btn-primary w-full">Request Withdrawal</button>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">You need at least <strong>{MIN_COINS} coins</strong> to withdraw.</p>
            <p className="text-gray-400 text-xs mt-1">Current balance: {user?.coins} coins</p>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-gray-800 mb-4">Withdrawal History</h3>
      {loading ? null : withdrawals.length === 0 ? <div className="card text-center text-gray-400 py-8">No withdrawal history.</div> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left border-b">
              <th className="pb-3 text-gray-500 font-medium">Date</th>
              <th className="pb-3 text-gray-500 font-medium">Coins</th>
              <th className="pb-3 text-gray-500 font-medium">Amount</th>
              <th className="pb-3 text-gray-500 font-medium">Method</th>
              <th className="pb-3 text-gray-500 font-medium">Status</th>
            </tr></thead>
            <tbody className="divide-y">
              {withdrawals.map(w => (
                <tr key={w._id}>
                  <td className="py-3 text-gray-700">{new Date(w.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 text-amber-600 font-medium">{w.withdrawalCoin} 🪙</td>
                  <td className="py-3 text-green-600 font-medium">${w.withdrawalAmount?.toFixed(2)}</td>
                  <td className="py-3 text-gray-700 capitalize">{w.paymentSystem}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize
                      ${w.status === "approved" ? "bg-green-100 text-green-700" : w.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {w.status}
                    </span>
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

export default Withdrawals;
