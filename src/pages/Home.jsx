import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/* ─── tiny helper: count-up animation ─── */
function useCountUp(target, duration = 1800) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        setVal(Math.floor(progress * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return [val, ref];
}

/* ─── Navbar ─── */
export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-300 transition-shadow">
            <span className="text-white font-black text-lg leading-none">M</span>
          </div>
          <span
            className={`font-black text-xl tracking-tight transition-colors ${
              scrolled ? "text-gray-900" : "text-white"
            }`}
          >
            Micro<span className="text-indigo-400">Task</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className={`text-sm font-medium transition-colors hover:text-indigo-400 ${
                scrolled ? "text-gray-600" : "text-white/80"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className={`text-sm font-medium transition-colors ${
                  scrolled ? "text-gray-600 hover:text-gray-900" : "text-white/70 hover:text-white"
                }`}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`text-sm font-semibold transition-colors ${
                  scrolled ? "text-gray-700 hover:text-indigo-600" : "text-white/90 hover:text-white"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-5 py-2.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg hover:shadow-indigo-300/50 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`md:hidden flex flex-col gap-1.5 p-1 ${scrolled ? "text-gray-800" : "text-white"}`}
        >
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        } bg-white/98 backdrop-blur-md border-t border-gray-100`}
      >
        <div className="px-4 py-4 flex flex-col gap-4">
          {["Features", "How It Works", "Pricing"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              {item}
            </a>
          ))}
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            {user ? (
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm font-semibold py-2.5 rounded-full bg-indigo-500 text-white">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm font-semibold py-2.5 rounded-full border border-gray-300 text-gray-700">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center text-sm font-semibold py-2.5 rounded-full bg-indigo-500 text-white">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

/* ─── Footer ─── */
export const Footer = () => (
  <footer className="bg-gray-950 text-white pt-16 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-black text-lg">M</span>
            </div>
            <span className="font-black text-xl">Micro<span className="text-indigo-400">Task</span></span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            Bangladesh's leading micro-tasking platform. Earn coins, complete tasks, grow together — trusted by thousands of workers and buyers nationwide.
          </p>
          <div className="flex gap-3 mt-5">
            {["Facebook", "Twitter", "LinkedIn"].map((s) => (
              <a
                key={s}
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-500/40 flex items-center justify-center text-xs text-gray-400 hover:text-indigo-400 transition-all"
              >
                {s[0]}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4 tracking-wide uppercase">Platform</h4>
          <ul className="space-y-2.5">
            {["How it works", "Browse Tasks", "Post a Task", "Coin Packages", "Leaderboard"].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-4 tracking-wide uppercase">Support</h4>
          <ul className="space-y-2.5">
            {["Help Center", "Privacy Policy", "Terms of Service", "Contact Us", "FAQ"].map((item) => (
              <li key={item}>
                <a href="#" className="text-sm text-gray-400 hover:text-indigo-400 transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} MicroTask Platform. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Coin rate:</span>
          <span className="text-xs font-bold text-amber-400">20 coins = $1</span>
          <span className="text-xs text-gray-500 ml-2">Min withdrawal:</span>
          <span className="text-xs font-bold text-green-400">200 coins ($10)</span>
        </div>
      </div>
    </div>
  </footer>
);

/* ─── Stat counter card ─── */
const StatCard = ({ target, suffix = "", label, color }) => {
  const [val, ref] = useCountUp(target);
  return (
    <div ref={ref} className="text-center">
      <p className={`text-4xl md:text-5xl font-black ${color}`}>
        {val.toLocaleString()}{suffix}
      </p>
      <p className="text-sm text-gray-400 mt-1 font-medium">{label}</p>
    </div>
  );
};

/* ─── Main Home Page ─── */
const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white font-sans" style={{ fontFamily: "'DM Sans', 'Syne', sans-serif" }}>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gray-950">
        {/* Animated bg mesh */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-900/30 blur-3xl" />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-white/80 font-medium">Now live in Bangladesh 🇧🇩</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6">
            Earn Coins.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              Get Things Done.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-white/60 leading-relaxed mb-10">
            MicroTask connects <strong className="text-white/90">Workers</strong> who complete small tasks with{" "}
            <strong className="text-white/90">Buyers</strong> who need results — fast, fair, and rewarding.
            Start earning today with just 10 free coins.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-base shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-400/50 transition-all transform hover:-translate-y-0.5"
              >
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-base shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-400/50 transition-all transform hover:-translate-y-0.5"
                >
                  Start Earning Free →
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 hover:bg-white/15 text-white font-bold text-base border border-white/20 backdrop-blur-sm transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Coin bonus callout */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm">
              <span className="text-2xl">🪙</span>
              <div className="text-left">
                <p className="text-xs text-white/50">Worker bonus</p>
                <p className="text-sm font-bold text-white">10 free coins on signup</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 backdrop-blur-sm">
              <span className="text-2xl">💰</span>
              <div className="text-left">
                <p className="text-xs text-white/50">Buyer bonus</p>
                <p className="text-sm font-bold text-white">50 free coins on signup</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs text-white/50">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="features" className="py-20 bg-gray-950 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-10">
          <StatCard target={12400} suffix="+" label="Tasks Completed" color="text-indigo-400" />
          <StatCard target={3800} suffix="+" label="Active Workers" color="text-violet-400" />
          <StatCard target={890} suffix="+" label="Happy Buyers" color="text-pink-400" />
          <StatCard target={98} suffix="%" label="Satisfaction Rate" color="text-amber-400" />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">How It Works</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 leading-tight">
              Simple. Fast. Rewarding.
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">
              Whether you're here to earn or to delegate — getting started takes under two minutes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Worker flow */}
            <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-indigo-50 to-white p-8 hover:shadow-xl hover:shadow-indigo-100 transition-shadow">
              <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full mb-6">
                👷 For Workers
              </div>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Register & Get Coins", desc: "Sign up as a Worker and instantly receive 10 free coins to start." },
                  { step: "02", title: "Browse Available Tasks", desc: "Explore tasks posted by Buyers — from reviews to data entry and more." },
                  { step: "03", title: "Submit Your Work", desc: "Complete the task and submit proof. Your submission goes to the Buyer for review." },
                  { step: "04", title: "Earn & Withdraw", desc: "Get approved and earn coins. Withdraw as cash once you hit 200 coins ($10)." },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-500 text-white text-xs font-black flex items-center justify-center">
                      {step}
                    </span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/register" className="mt-8 block text-center py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm transition-colors">
                Join as Worker →
              </Link>
            </div>

            {/* Buyer flow */}
            <div className="rounded-3xl border border-gray-100 bg-gradient-to-br from-amber-50 to-white p-8 hover:shadow-xl hover:shadow-amber-100 transition-shadow">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-6">
                🛒 For Buyers
              </div>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Register & Get 50 Coins", desc: "Sign up as a Buyer and get 50 free coins — enough to post your first task." },
                  { step: "02", title: "Post a Task", desc: "Describe what you need done, set the coin reward per worker and a deadline." },
                  { step: "03", title: "Review Submissions", desc: "Workers submit their work. Approve what meets your standards, reject the rest." },
                  { step: "04", title: "Scale with Coin Packages", desc: "Purchase more coins via Stripe to keep tasks flowing and results coming in." },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-400 text-white text-xs font-black flex items-center justify-center">
                      {step}
                    </span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/register" className="mt-8 block text-center py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-white font-bold text-sm transition-colors">
                Join as Buyer →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">Features</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3">
              Everything you need.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🔐", title: "Secure Auth", desc: "JWT tokens, Google OAuth, and role-based access control keep your account safe.", color: "indigo" },
              { icon: "🪙", title: "Coin Economy", desc: "20 coins = $1. Buy coins via Stripe, earn them through tasks, withdraw anytime.", color: "amber" },
              { icon: "📋", title: "Task Management", desc: "Buyers post detailed tasks with deadlines. Workers pick up, submit, and get paid.", color: "violet" },
              { icon: "✅", title: "Review System", desc: "Buyers approve or reject submissions — ensuring quality on every transaction.", color: "green" },
              { icon: "🔔", title: "Notifications", desc: "Real-time bell notifications keep workers and buyers updated at every step.", color: "pink" },
              { icon: "🛡️", title: "Admin Control", desc: "Admins manage users, oversee tasks, and approve withdrawal requests platform-wide.", color: "slate" },
            ].map(({ icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all group"
              >
                <div className="text-3xl mb-4">{icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COIN PRICING ── */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-4">
            Simple Coin Packages
          </h2>
          <p className="text-gray-500 mb-12 max-w-md mx-auto">Secure payments powered by Stripe. Always 20 coins per dollar.</p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { price: "$1", coins: 10, bonus: 0, label: "Starter", popular: false },
              { price: "$9", coins: 100, bonus: 10, label: "Popular", popular: true },
              { price: "$99", coins: 1000, bonus: 150, label: "Pro", popular: false },
            ].map(({ price, coins, bonus, label, popular }) => (
              <div
                key={label}
                className={`relative rounded-3xl p-8 border-2 text-center transition-all ${
                  popular
                    ? "border-indigo-500 bg-indigo-50 shadow-xl shadow-indigo-100 scale-105"
                    : "border-gray-100 bg-white hover:border-indigo-200"
                }`}
              >
                {popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <p className="text-sm font-bold text-gray-500 mb-2">{label}</p>
                <p className="text-5xl font-black text-gray-900 mb-1">{price}</p>
                <p className="text-3xl font-black text-indigo-500 mb-1">{coins} <span className="text-lg text-gray-400">coins</span></p>
                {bonus > 0 && (
                  <p className="text-sm text-green-600 font-bold mb-4">+{bonus} bonus coins!</p>
                )}
                <p className="text-xs text-gray-400 mt-4">Total: {coins + bonus} coins = ${((coins + bonus) / 20).toFixed(2)} value</p>
                <Link
                  to={user ? "/dashboard/buyer/purchase-coin" : "/register"}
                  className={`mt-6 block py-3 rounded-xl font-bold text-sm transition-colors ${
                    popular
                      ? "bg-indigo-500 hover:bg-indigo-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  Buy Now →
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-gray-400">
            Workers can withdraw once they reach <strong className="text-gray-600">200 coins</strong> ($10 minimum).
          </p>
        </div>
      </section>

      {/* ── ROLES OVERVIEW ── */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Who is MicroTask for?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                role: "Worker",
                icon: "👷",
                coins: "Starts with 10 coins",
                perks: ["Browse task list", "Submit work for review", "Earn coins on approval", "Withdraw via Stripe, Bkash, Nagad"],
                cta: "Join as Worker",
                border: "border-indigo-500/30",
                badge: "bg-indigo-500/20 text-indigo-300",
              },
              {
                role: "Buyer",
                icon: "🛒",
                coins: "Starts with 50 coins",
                perks: ["Post unlimited tasks", "Set coin reward per worker", "Review & approve submissions", "Purchase more coins via Stripe"],
                cta: "Join as Buyer",
                border: "border-amber-500/30",
                badge: "bg-amber-500/20 text-amber-300",
              },
              {
                role: "Admin",
                icon: "🛡️",
                coins: "Full platform access",
                perks: ["View all users & stats", "Manage tasks & submissions", "Approve withdrawal requests", "Promote users to admin"],
                cta: "Login as Admin",
                border: "border-violet-500/30",
                badge: "bg-violet-500/20 text-violet-300",
              },
            ].map(({ role, icon, coins, perks, cta, border, badge }) => (
              <div
                key={role}
                className={`rounded-3xl bg-white/5 border ${border} p-8 backdrop-blur-sm hover:bg-white/8 transition-colors`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{icon}</span>
                  <div>
                    <p className="font-black text-white text-xl">{role}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge}`}>{coins}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {perks.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className="block text-center py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/10 transition-all"
                >
                  {cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="relative py-24 bg-gradient-to-br from-indigo-600 to-violet-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "30px 30px"
        }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Ready to start earning?
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Join thousands of Bangladeshis already earning and growing on MicroTask.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 rounded-full bg-white text-indigo-600 font-black text-base hover:bg-indigo-50 shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Create Free Account →
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-full bg-white/10 border border-white/30 text-white font-bold text-base hover:bg-white/20 transition-all"
            >
              Already a member
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
