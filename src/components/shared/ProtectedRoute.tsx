/* Import ReactNode type for children */
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Ensure role is admin
  const role = user?.user_metadata?.role;
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
