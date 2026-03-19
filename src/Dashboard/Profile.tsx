import { useState, useEffect } from "react";
import { User, Mail, Lock, Loader2, Save, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";
import { getMe, updateMe } from "../api/user.api";
import { useNavigate } from "react-router-dom";
import SuccessMessage from "../components/SuccessMessage";
import FailMessage from "../components/FailMessage";

export default function Profile() {
  // Login stores { message, user: { id, name, token } } — so read .user.name
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const initialName = storedUser?.user?.name || storedUser?.name || "";

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState("");   // email is not in localStorage — must fetch
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(true);  // fetching from API
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getMe();
        setName(res.data.name);
        setEmail(res.data.email);
      } catch (err: any) {
        console.error("Failed to fetch user profile", err);
        setError("Could not load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setFail(false);

    if (password && password.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password && !currentPassword) {
      setError("Please enter your current password to change it.");
      setFail(true);
      return;
    }

    setSaving(true);
    try {
      const updateData: any = { name, email };
      if (password) {
        updateData.password = password;
        updateData.currentPassword = currentPassword;
      }

      await updateMe(updateData);
      
      // Update localStorage with the correct nested structure matching login response
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedStored = {
        ...stored,
        user: { ...(stored.user || {}), name }
      };
      localStorage.setItem("user", JSON.stringify(updatedStored));

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    } catch (err: any) {
      console.error("Failed to update profile", err);
      setFail(true);
      setError(err?.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Show full-page loader only when we have NO data at all
  if (loading && !name && !email) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Retrieving vault identity...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .prof-display { font-family: 'Playfair Display', serif; }
        .prof-body    { font-family: 'DM Sans', sans-serif; }
        
        .prof-input {
          width: 100%;
          padding: 12px 12px 12px 42px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #111827;
          outline: none;
          transition: all .2s;
        }
        .prof-input:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 4px rgba(220,38,38,.08);
        }
      `}</style>

      {success && <SuccessMessage success_message="Profile successfully updated in the vault." onClose={() => setSuccess(false)} />}
      {fail && <FailMessage fail_message={error} onClose={() => setFail(false)} />}

      <div className="mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium mb-4"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h1 className="prof-display text-4xl font-black text-gray-900 mb-2">
          Your <span className="text-red-600 italic">Identity.</span>
        </h1>
        <p className="prof-body text-gray-500">Manage your profile credentials and account information.</p>
      </div>

      <div className="bg-white border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl overflow-hidden">
        <div className="h-2 bg-red-600 w-full" />
        
        <form onSubmit={handleUpdate} className="p-8 lg:p-10 space-y-8">
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <h2 className="prof-display text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
                <User size={18} className="text-red-600" /> Basic Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="prof-input"
                      placeholder="Your Full Name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="prof-input"
                      placeholder="name@example.com"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">Used for login and notifications.</p>
                </div>
              </div>
            </div>

            {/* Security Section */}
            <div className="space-y-6">
              <h2 className="prof-display text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center gap-2">
                <Lock size={18} className="text-red-600" /> Security
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">New Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="prof-input"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="prof-input"
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Leave blank to keep your current password.</p>
              </div>

              {/* Current Password for verification */}
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-[11px] font-bold text-red-600 uppercase tracking-widest mb-2">Current Password *</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400" />
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="prof-input border-red-100! focus:border-red-600!"
                    placeholder="Verify with current password"
                    required={password.length > 0}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-2 italic">Required only when changing password.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
              <AlertTriangle size={14} />
              <span className="text-[11px] font-bold uppercase tracking-wider">Identity Verification Active</span>
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-gray-950 text-white text-sm font-bold uppercase tracking-widest hover:bg-red-700 disabled:bg-gray-400 transition-all rounded-lg shadow-lg"
            >
              {saving ? (
                <><Loader2 size={16} className="animate-spin" /> Sealing Vault...</>
              ) : (
                <><Save size={16} /> Save Changes</>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 p-6 bg-red-50 border border-red-100 rounded-xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-red-200 shrink-0">
          <CheckCircle2 className="text-red-600" size={20} />
        </div>
        <div>
          <h4 className="prof-display font-bold text-gray-900 text-sm">Account Status: Secured</h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">Your account is currently protected by InotaVault encryption. Ensure you use a strong password if you decide to change it today.</p>
        </div>
      </div>
    </div>
  );
}
