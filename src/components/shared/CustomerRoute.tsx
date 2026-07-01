// src/components/shared/CustomerRoute.tsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../features/auth/context/context";

import { Box, CircularProgress } from "@mui/material";

interface CustomerRouteProps {
  children: React.ReactNode;
}

export default function CustomerRoute({ children }: CustomerRouteProps) {
  const auth = useContext(AuthContext);
  const location = useLocation();

  if (auth?.isLoading) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-[#fafaf7]">
        <CircularProgress sx={{ color: "#b45309" }} />
      </Box>
    );
  }

  if (!auth?.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
