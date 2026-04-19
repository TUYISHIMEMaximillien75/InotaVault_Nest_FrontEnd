import { Navigate } from "react-router-dom";

/** Allows access only when the logged-in user has role ADMIN.
 *  If not, redirects to /dashboard silently.
 */
export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const stored = localStorage.getItem("user");
  const parsed = stored ? JSON.parse(stored) : null;
  // Login stores res.data → { message, user: { id, name, email, role, token } }
  const role: string = parsed?.user?.role ?? parsed?.role ?? "";

  if (role !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
