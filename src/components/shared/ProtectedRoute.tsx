import { Navigate } from "react-router-dom";
import { useContext } from "react";
import type { ReactNode } from "react";
import { AdminAuthContext } from "../../features/auth/context/adminAuthContext";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN", "DELIVERY_STAFF"] as const;

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const auth = useContext(AdminAuthContext);
  if (!auth)
    throw new Error("ProtectedRoute must be used within AdminAuthProvider");

  if (auth.isLoading) return null;

  if (!auth.isAuthenticated) return <Navigate to="/admin/login" replace />;

  if (
    !auth.role ||
    !ADMIN_ROLES.includes(auth.role as (typeof ADMIN_ROLES)[number])
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
}
