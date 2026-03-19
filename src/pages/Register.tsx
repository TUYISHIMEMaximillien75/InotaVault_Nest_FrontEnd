import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import logo from "../assets/logo.png";
import { User, Mail, Lock, Loader2, ArrowRight, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password) { setError("All fields are required"); return; }
    if (password !== cpassword) { setError("Passwords do not match"); return; }

    try {
      setLoading(true);
      await api.post("/auth/register", { name, email, password });
      setSuccess("Account created! Check your email for a verification link.");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = cpassword.length > 0 && password === cpassword;
  const passwordMismatch = cpassword.length > 0 && password !== cpassword;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .rg-display { font-family: 'Playfair Display', serif; }
        .rg-body    { font-family: 'DM Sans', sans-serif; }

        @keyframes rgFadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes rgShake {
          0%,100% { transform:translateX(0); }
          20%     { transform:translateX(-5px); }
          40%     { transform:translateX(5px); }
          60%     { transform:translateX(-4px); }
          80%     { transform:translateX(4px); }
        }
        @keyframes rgSuccessIn {
          from { opacity:0; transform:scale(.96) translateY(6px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        .rg-fade-1 { animation: rgFadeUp .5s .05s both; }
        .rg-fade-2 { animation: rgFadeUp .5s .12s both; }
        .rg-fade-3 { animation: rgFadeUp .5s .19s both; }
        .rg-fade-4 { animation: rgFadeUp .5s .26s both; }
        .rg-fade-5 { animation: rgFadeUp .5s .33s both; }
        .rg-shake  { animation: rgShake .4s ease; }
        .rg-success-in { animation: rgSuccessIn .4s cubic-bezier(.34,1.3,.64,1) both; }

        .rg-input {
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
        .rg-input::placeholder { color: #9ca3af; }
        .rg-input:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220,38,38,.08);
        }
        .rg-input.match   { border-color: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,.07); }
        .rg-input.mismatch { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,.07); }
      `}</style>

      <div className="min-h-screen bg-[#f8f5f0] rg-body flex items-center justify-center px-4 py-12 relative overflow-hidden">

        {/* Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-200/25 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-100/35 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative w-full max-w-md">

          {/* ── Success state (replaces form) ── */}
          {success ? (
            <div className="rg-success-in bg-white border border-gray-200 shadow-[0_24px_64px_rgba(0,0,0,.10)]">
              <div className="h-[3px] bg-green-500" />
              <div className="px-8 py-12 flex flex-col items-center text-center gap-5">
                <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-500" />
                </div>
                <div>
                  <h2 className="rg-display text-2xl font-black text-gray-900 mb-2">You're in.</h2>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{success}</p>
                </div>
                <Link
                  to="/login"
                  className="mt-2 flex items-center gap-2 px-7 py-3 bg-gray-950 text-white text-sm font-semibold uppercase tracking-wider hover:bg-red-700 transition-colors duration-200"
                >
                  Go to Login <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          ) : (
            /* ── Registration Card ── */
            <div className="bg-white border border-gray-200 shadow-[0_24px_64px_rgba(0,0,0,.10)]">

              {/* Red top rule */}
              <div className="h-[3px] bg-red-600" />

              <div className="px-8 pt-8 pb-9">

                {/* Logo + heading */}
                <div className="rg-fade-1 flex flex-col items-center mb-7">
                  <Link to="/" className="mb-5 block">
                    <img src={logo} alt="InotaVault" className="h-10 w-auto hover:opacity-80 transition-opacity" />
                  </Link>
                  <h1 className="rg-display text-3xl font-black text-gray-900 text-center leading-tight mb-1">
                    Join the<br /><span style={{ fontFamily: "Segoe Script", fontWeight: "bold" }} className="text-red-600">vault.</span>
                  </h1>
                  <p className="text-sm text-gray-400 mt-2 text-center">
                    Create your account to manage and share music.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="rg-shake mb-5 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200">
                    <AlertTriangle size={15} className="text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 font-medium leading-snug">{error}</p>
                  </div>
                )}

                <form onSubmit={submit} className="space-y-4">

                  {/* Name */}
                  <div className="rg-fade-2">
                    <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[.15em] mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="Kanaka Maxime"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="rg-input"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="rg-fade-3">
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
                        className="rg-input"
                      />
                    </div>
                  </div>

                  {/* Passwords — side by side */}
                  <div className="rg-fade-4 grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[.15em] mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="rg-input"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-[.15em] mb-2">
                        Confirm
                      </label>
                      <div className="relative">
                        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        <input
                          type="password"
                          placeholder="••••••••"
                          value={cpassword}
                          onChange={(e) => setCpassword(e.target.value)}
                          className={`rg-input ${passwordsMatch ? "match" : passwordMismatch ? "mismatch" : ""}`}
                        />
                      </div>
                      {/* Inline match hint */}
                      {passwordsMatch && (
                        <p className="text-[10px] text-green-600 font-semibold mt-1 flex items-center gap-1">
                          <CheckCircle2 size={10} /> Passwords match
                        </p>
                      )}
                      {passwordMismatch && (
                        <p className="text-[10px] text-orange-500 font-semibold mt-1">
                          Passwords don't match
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit */}
                  <div className="rg-fade-5 pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-gray-950 text-white text-sm font-semibold uppercase tracking-wider hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 shadow-[0_8px_24px_rgba(0,0,0,.12)]"
                    >
                      {loading ? (
                        <><Loader2 size={16} className="animate-spin" /> Creating Account…</>
                      ) : (
                        <>Create Account <ArrowRight size={15} /></>
                      )}
                    </button>
                  </div>
                </form>

                {/* Login link */}
                <p className="text-center text-sm text-gray-400 mt-7">
                  Already have an account?{" "}
                  <Link to="/login" className="text-red-600 hover:text-red-800 font-semibold transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Below-card note */}
          <p className="text-center text-[11px] text-gray-400 mt-5 tracking-wide">
            © {new Date().getFullYear()} InotaVault · Sacred Music Archive
          </p>
        </div>
      </div>
    </>
  );
}