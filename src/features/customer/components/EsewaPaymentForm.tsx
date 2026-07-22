import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useCallback } from "react";

/**
 * Legacy payment form — the /checkout/esewa route now redirects to /checkout
 * directly. This component is kept for any lingering references.
 */
export const EsewaPaymentForm = () => {
  const navigate = useNavigate();

  const redirect = useCallback(() => {
    navigate("/checkout", { replace: true });
  }, [navigate]);

  useEffect(() => {
    redirect();
  }, [redirect]);

  return (
    <Box
      className="min-h-screen bg-[#fafaf7]"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: "20px",
          border: "1px solid rgba(180,83,9,0.08)",
          p: 8,
          maxWidth: 448,
          width: 1,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "rgb(120,53,15)", mb: 2 }}
        >
          Redirecting to Checkout...
        </Typography>
      </Box>
    </Box>
  );
};
