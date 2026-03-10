import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { FaCoins, FaCheck } from "react-icons/fa";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PACKAGES = [
  { id: 1, dollars: 1, coins: 10, bonus: 0, popular: false },
  { id: 2, dollars: 9, coins: 100, bonus: 10, popular: true },
  { id: 3, dollars: 99, coins: 1000, bonus: 150, popular: false },
];

const CheckoutForm = ({ pkg, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    try {
      // 1. Create PaymentIntent on server
      const { data } = await api.post("/payments/create-payment-intent", { packageId: pkg.id });

      // 2. Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });

      if (error) { toast.error(error.message); return; }

      // 3. Confirm on server & add coins
      await api.post("/payments/confirm", {
        packageId: pkg.id,
        stripePaymentId: paymentIntent.id,
      });

      await refreshUser();
      toast.success(`🎉 Payment successful! +${pkg.coins + pkg.bonus} coins added.`);
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Payment failed");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handlePay} className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-3">
        <CardElement options={{ style: { base: { fontSize: "16px", color: "#374151" } } }} />
      </div>
      <div className="bg-indigo-50 p-3 rounded-lg text-sm text-indigo-700">
        You'll receive <strong>{pkg.coins + pkg.bonus} coins</strong> for <strong>${pkg.dollars}</strong>
      </div>
      <button type="submit" disabled={!stripe || loading} className="btn-primary w-full disabled:opacity-50">
        {loading ? "Processing..." : `Pay $${pkg.dollars}`}
      </button>
      <p className="text-xs text-gray-400 text-center">Secured by Stripe</p>
    </form>
  );
};

const PurchaseCoin = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Purchase Coins</h2>
      <p className="text-gray-500 mb-6">Buy coins to post tasks and pay workers.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {PACKAGES.map(pkg => (
          <div key={pkg.id} onClick={() => setSelected(pkg)}
            className={`relative card cursor-pointer border-2 transition-all text-center
              ${selected?.id === pkg.id ? "border-indigo-500 bg-indigo-50" : "border-gray-100 hover:border-indigo-200"}`}>
            {pkg.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-white text-xs px-3 py-0.5 rounded-full">
                Most Popular
              </span>
            )}
            <FaCoins className="text-amber-500 mx-auto mb-2" size={32} />
            <p className="text-3xl font-bold text-gray-800">{pkg.coins}</p>
            <p className="text-sm text-gray-500">coins</p>
            {pkg.bonus > 0 && <p className="text-xs text-green-600 font-medium mt-1">+{pkg.bonus} bonus!</p>}
            <p className="text-2xl font-bold text-indigo-600 mt-3">${pkg.dollars}</p>
            {selected?.id === pkg.id && <FaCheck className="text-indigo-500 mx-auto mt-2" />}
          </div>
        ))}
      </div>

      {selected && (
        <div className="card max-w-md">
          <h3 className="font-semibold text-gray-800 mb-4">Payment Details</h3>
          <Elements stripe={stripePromise}>
            <CheckoutForm pkg={selected} onSuccess={() => setSelected(null)} />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default PurchaseCoin;
