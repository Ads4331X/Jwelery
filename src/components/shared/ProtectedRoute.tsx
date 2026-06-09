/* Import ReactNode type for children */
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "../../features/auth/context/context";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const auth = useContext(AuthContext);
  if (!auth)
    throw new Error("ProtectedRoute must be used within an AuthProvider");
  const { isAuthenticated, user } = auth;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Ensure role is admin or super_admin
  const role = user?.user_metadata?.role;
  if (role !== "admin" && role !== "super_admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
