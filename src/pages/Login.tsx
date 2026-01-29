import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/api";
import logo from "../assets/logo.png";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });

      const user = res.data;
      const access_token = res.data.user.token;
      
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate(localStorage.getItem("journey_to") || "/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white shadow-xl shadow-slate-200/60 rounded-2xl w-full max-w-md p-8 border border-gray-100">
        
        {/* LOGO SECTION */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="bg-red-50 p-3 rounded-2xl mb-4">
            <img src={logo} alt="InotaVault" className="h-12 w-auto" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter your credentials to access your vault
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
            <span className="font-bold underline">Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-700 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <button type="button" className="text-xs text-red-700 hover:underline font-medium">
                Forgot password?
              </button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-600/5 focus:border-red-700 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-800 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:bg-gray-400 disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* REGISTRATION LINK */}
        <div className="text-center mt-8 text-sm text-gray-600">
          New to InotaVault?{" "}
          <Link
            to="/register"
            className="text-red-700 hover:text-red-800 font-bold transition-colors"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}