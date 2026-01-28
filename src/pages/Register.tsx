import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import logo from "../assets/logo.png";
import { User, Mail, Lock, Loader2 } from "lucide-react";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cpassword, setCpassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    const submit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents page reload
        setError("");

        if (!name || !email || !password) {
            setError("All fields are required");
            return;
        }

        if (password !== cpassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            await api.post("/auth/register", {
                name,
                email,
                password,
            });

            // expected response: { access_token, user }
            setSuccess("Registration successful check your email for verification link");


        } catch (err: any) {
            setError(
                err?.response?.data?.message || "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl w-full max-w-md p-8 border border-gray-100">

                {/* LOGO & HEADER */}
                <div className="flex flex-col items-center mb-8">
                    <img src={logo} alt="InotaVault Logo" className="h-16 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
                    <p className="text-gray-500 text-sm mt-1">Join InotaVault to manage your music</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4 border border-red-100 flex items-center gap-2">
                        <span className="font-bold">!</span> {error}
                    </div>
                )}
                {/* SUCCESS MESSAGE */}
                {success && (
                    <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                        <span className="font-bold underline">Success:</span> {success}
                    </div>
                )}
                <form onSubmit={submit} className="space-y-4">
                    {/* NAME FIELD */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700 transition-all"
                            />
                        </div>
                    </div>

                    {/* EMAIL FIELD */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700 transition-all"
                            />
                        </div>
                    </div>

                    {/* PASSWORD FIELD */}
                    <div className="space-y-1 flex gap-4">
                        <div className="password">
                            <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700 transition-all"
                                />
                            </div>
                        </div>
                        <div className="cpassword">
                            <label className="text-sm font-medium text-gray-700 ml-1">Re-Enter Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={cpassword}
                                    onChange={(e) => setCpassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-700 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 mt-2 rounded-xl text-white font-semibold bg-red-700 hover:bg-red-800 transition-all shadow-lg shadow-red-200 active:scale-[0.98] disabled:bg-gray-400 disabled:shadow-none flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </button>
                </form>

                {/* FOOTER */}
                <div className="text-center mt-8 text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="text-red-700 hover:text-red-800 font-bold transition-colors"
                    >
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}