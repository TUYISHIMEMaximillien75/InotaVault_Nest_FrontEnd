import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/api";
import logo from "../assets/logo.png";
import { Mail, Lock, Loader2, ArrowRight, AlertTriangle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Email and password are required"); return; }
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.user.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate(localStorage.getItem("journey_to") || "/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .lg-display { font-family: 'Playfair Display', serif; }
        .lg-body    { font-family: 'DM Sans', sans-serif; }

        @keyframes lgFadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes lgShake {
          0%,100% { transform:translateX(0); }
          20%     { transform:translateX(-5px); }
          40%     { transform:translateX(5px); }
          60%     { transform:translateX(-4px); }
          80%     { transform:translateX(4px); }
        }
        .lg-fade-1 { animation: lgFadeUp .5s .05s both; }
        .lg-fade-2 { animation: lgFadeUp .5s .15s both; }
        .lg-fade-3 { animation: lgFadeUp .5s .25s both; }
        .lg-fade-4 { animation: lgFadeUp .5s .35s both; }
        .lg-shake  { animation: lgShake .4s ease; }

        .lg-input {
          width: 100%;
          padding: 11px 12px 11px 40px;
          background: #fff;
          border: 1px solid #e5e7eb;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #111827;
          outline: none;
          transition: border-color .18s, box-shadow .18s;
        }
        .lg-input::placeholder { color: #9ca3af; }
        .lg-input:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220,38,38,.08);
        }
      `}</style>

      <div className="min-h-screen bg-[#f8f5f0] lg-body flex items-center justify-center px-4 py-12 relative overflow-hidden">

        {/* Soft red glow top-right */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-200/30 rounded-full blur-[100px] pointer-events-none" />
        {/* Soft glow bottom-left */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-100/40 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative w-full max-w-sm">

          {/* ── Card ── */}
          <div className="bg-white border border-gray-200 shadow-[0_24px_64px_rgba(0,0,0,.10)]">

            {/* Red top rule */}
            <div className="h-[3px] bg-red-600" />

            <div className="px-8 pt-8 pb-9">

              {/* Logo + heading */}
              <div className="lg-fade-1 flex flex-col items-center mb-8">
                <Link to="/" className="mb-5 block">
                  <img src={logo} alt="InotaVault" className="h-10 w-auto hover:opacity-80 transition-opacity" />
                </Link>
                <h1 className="lg-display text-3xl font-black text-gray-900 text-center leading-tight mb-1">
                  Welcome<br /><span style={{ fontFamily: "Segoe Script", fontWeight: "bold" }} className="text-red-600">back.</span>
                </h1>
                <p className="text-sm text-gray-400 mt-2 text-center">
                  Enter your credentials to access the vault.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="lg-shake mb-6 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200">
                  <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium leading-snug">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">

                {/* Email */}
                <div className="lg-fade-2">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[.15em] mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="email"
                      placeholder="kanakamaxime@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="lg-input"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="lg-fade-3">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[.15em]">
                      Password
                    </label>
                    <button type="button" className="text-[11px] text-red-600 hover:text-red-800 font-semibold tracking-wide transition-colors">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="lg-input"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="lg-fade-4 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-gray-950 text-white text-sm font-semibold uppercase tracking-wider hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 shadow-[0_8px_24px_rgba(0,0,0,.12)]"
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Verifying…</>
                    ) : (
                      <>Sign In <ArrowRight size={15} /></>
                    )}
                  </button>
                </div>
              </form>

              {/* Register link */}
              <p className="text-center text-sm text-gray-400 mt-7">
                New to InotaVault?{" "}
                <Link to="/register" className="text-red-600 hover:text-red-800 font-semibold transition-colors">
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Below-card note */}
          <p className="text-center text-[11px] text-gray-400 mt-5 tracking-wide">
            © {new Date().getFullYear()} InotaVault · Sacred Music Archive
          </p>
        </div>
      </div>
    </>
  );
}