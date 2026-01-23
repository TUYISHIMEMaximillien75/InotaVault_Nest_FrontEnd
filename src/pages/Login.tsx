import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import logo from "../assets/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submit = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // expected response: { access_token, user }
      const user = res.data;
      const access_token = res.data.user.token
      localStorage.setItem("token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/song_list");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-6">
        {/* LOGO */}
        <div className="flex justify-center mb-6">
          <img src={logo} className="h-16" />
        </div>

        <h2 className="text-xl font-bold text-center mb-4">
          Login to InotaVault
        </h2>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded text-sm mb-3">
            {error}
          </p>
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded mb-3 focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-600"
        />

        {/* LOGIN BUTTON */}
        <button
          onClick={submit}
          disabled={loading}
          className={`w-full py-2 rounded text-white transition ${
            loading
              ? "bg-gray-400"
              : "bg-red-700 hover:bg-red-600"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* EXTRA */}
        <div className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-red-700 cursor-pointer font-medium"
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
}
