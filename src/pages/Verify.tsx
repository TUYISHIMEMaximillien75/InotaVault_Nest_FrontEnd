import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { api } from "../api/api";
import logo from "../assets/logo.png";

export default function Verify() {
  // Use useParams to get the user_id from the URL path: /auth/verify/:user_id
  const { user_id } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your account...");

  console.log(user_id)

  useEffect(() => {
    const verifyAccount = async () => {
      // Clean up the user_id just in case there's a trailing hash or slash

      if (!user_id) {
        setStatus("error");
        setMessage("Invalid or missing verification link.");
        return;
      }

      try {
        setStatus("loading");
        // Sending the user_id to your backend
        await api.post(`/auth/verify/${user_id}`);
        
        setStatus("success");
        setMessage("Your email has been successfully verified!");
        navigate("/login");
      } catch (err: any) {
        setStatus("error");
        setMessage(
          err?.response?.data?.message || "Verification failed or the link has expired."
        );
      }
    };

    verifyAccount();
  }, [user_id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white shadow-2xl shadow-slate-200/50 rounded-3xl w-full max-w-md p-8 border border-gray-100 text-center">
        
        <div className="flex justify-center mb-8">
          <img src={logo} alt="InotaVault" className="h-12" />
        </div>

        <div className="space-y-6">
          {status === "loading" && (
            <div className="flex flex-col items-center animate-pulse">
              <div className="bg-blue-50 p-4 rounded-full mb-4">
                <Loader2 className="text-blue-600 animate-spin" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 font-display">Verifying...</h2>
              <p className="text-gray-500 mt-2">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center">
              <div className="bg-green-50 p-4 rounded-full mb-4">
                <CheckCircle2 className="text-green-600" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
              <p className="text-gray-500 mt-2 italic px-4">"{message}"</p>
              
              <button
                onClick={() => navigate("/login")}
                className="w-full mt-8 bg-red-700 hover:bg-red-800 text-white py-3.5 rounded-xl font-semibold transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 group active:scale-95"
              >
                Continue to Login
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center">
              <div className="bg-red-50 p-4 rounded-full mb-4">
                <XCircle className="text-red-600" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Link Invalid</h2>
              <p className="text-gray-500 mt-2">{message}</p>
              
              <div className="flex flex-col gap-3 w-full mt-8">
                <Link
                  to="/register"
                  className="w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center"
                >
                  Create New Account
                </Link>
                <Link
                  to="/login"
                  className="w-full text-gray-500 py-2 text-sm hover:text-red-700 transition-colors"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">
            InotaVault Secure Verification
          </p>
        </div>
      </div>
    </div>
  );
}