import { useEffect, useState } from "react";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import { Box, Typography, CircularProgress, Link } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { API_BASE_URL } from "../../config/appConfig";
import { useCart } from "../../hooks/useCart";

const API_BASE = API_BASE_URL;

type VerifyResult = {
  loading: boolean;
  success: boolean;
  message: string;
  pidx?: string;
  orderNumber?: string;
};

function clearPendingTxn(): void {
  sessionStorage.removeItem("khalti_pending_txn");
}

export default function KhaltiCallback() {
  const [searchParams] = useSearchParams();
  const pidxParam = searchParams.get("pidx") ?? "";
  const statusParam = searchParams.get("status");
  const { clearCart } = useCart();

  const [result, setResult] = useState<VerifyResult>(() => {
    if (!pidxParam) {
      return {
        loading: false,
        success: false,
        message: "Missing payment verification data (pidx).",
      };
    }
    return {
      loading: true,
      success: false,
      message: "Verifying your payment...",
    };
  });

  const [cartCleared, setCartCleared] = useState(false);

  useEffect(() => {
    if (!pidxParam) return;

    let cancelled = false;

    async function verify() {
      try {
        const res = await fetch(
          `${API_BASE}/api/khalti/verify?pidx=${encodeURIComponent(pidxParam)}`,
        );
        const json = await res.json().catch(() => null);

        if (cancelled) return;

        clearPendingTxn();

        if (res.ok && json?.success) {
          if (!cartCleared) {
            clearCart();
            setCartCleared(true);
          }

          setResult({
            loading: false,
            success: true,
            message: (json.message as string) ?? "Payment Successful!",
            pidx: pidxParam,
            orderNumber: (json.data?.orderNumber as string) ?? undefined,
          });
        } else {
          setResult({
            loading: false,
            success: false,
            message:
              (json?.message as string) ??
              "Payment verification failed. No order was created.",
            pidx: pidxParam,
          });
        }
      } catch {
        if (cancelled) return;
        clearPendingTxn();
        setResult({
          loading: false,
          success: false,
          message:
            "Could not connect to server for verification. Please check your connection.",
          pidx: pidxParam,
        });
      }
    }

    void verify();

    return () => {
      cancelled = true;
    };
  }, [pidxParam, clearCart, cartCleared]);

  // ── Loading state ────────────────────────────────────────────────
  if (result.loading) {
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
          <CircularProgress
            size={40}
            sx={{ color: "#b45309", mb: 4, mx: "auto", display: "block" }}
          />
          <Typography
            sx={{ color: "rgba(180,83,9,0.7)", fontSize: "0.875rem" }}
          >
            Verifying your payment...
          </Typography>
        </Box>
      </Box>
    );
  }

  // ── Success state ────────────────────────────────────────────────
  if (result.success) {
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
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              bgcolor: "rgba(34,197,94,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 4,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 32, color: "success.main" }} />
          </Box>

          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "success.dark", mb: 2 }}
          >
            Payment Successful!
          </Typography>
          <Typography
            sx={{ color: "rgba(180,83,9,0.7)", fontSize: "0.875rem", mb: 4 }}
          >
            {result.message}
          </Typography>

          {result.orderNumber && (
            <Typography
              sx={{ color: "rgba(180,83,9,0.7)", fontSize: "0.875rem", mb: 4 }}
            >
              Order #
              <Typography
                component="span"
                sx={{ fontWeight: 700, fontSize: "0.875rem" }}
              >
                {result.orderNumber}
              </Typography>{" "}
              has been placed successfully.
            </Typography>
          )}

          {result.pidx ? (
            <Typography
              sx={{
                fontSize: "0.75rem",
                color: "rgba(180,83,9,0.5)",
                mb: 6,
                wordBreak: "break-all",
                bgcolor: "rgba(180,83,9,0.04)",
                p: 3,
                borderRadius: "12px",
              }}
            >
              Transaction ref: {result.pidx}
            </Typography>
          ) : null}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Link
              component={RouterLink}
              to="/orders"
              sx={{
                width: 1,
                py: 3,
                borderRadius: "9999px",
                fontSize: "0.875rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                color: "white",
                textAlign: "center",
                textDecoration: "none",
                background: "linear-gradient(135deg, #92400e, #b45309)",
                "&:hover": { opacity: 0.9 },
              }}
            >
              View My Orders
            </Link>
            <Link
              component={RouterLink}
              to="/products"
              sx={{
                fontSize: "0.875rem",
                color: "rgb(180,83,9)",
                textDecoration: "underline",
                textUnderlineOffset: 2,
                textAlign: "center",
                "&:hover": { color: "rgb(120,53,15)" },
              }}
            >
              Continue Shopping
            </Link>
          </Box>
        </Box>
      </Box>
    );
  }

  // ── Failure state ────────────────────────────────────────────────
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
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "rgba(239,68,68,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 4,
          }}
        >
          <ReportProblemOutlinedIcon
            sx={{ fontSize: 32, color: "error.main" }}
          />
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "error.dark", mb: 2 }}
        >
          {result.message.toLowerCase().includes("already completed")
            ? "Payment Already Completed"
            : statusParam === "cancelled"
              ? "Payment Cancelled"
              : "Payment Failed"}
        </Typography>
        <Typography
          sx={{ color: "rgba(180,83,9,0.7)", fontSize: "0.875rem", mb: 6 }}
        >
          {result.message}
        </Typography>

        {result.pidx ? (
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "rgba(180,83,9,0.5)",
              mb: 6,
              wordBreak: "break-all",
              bgcolor: "rgba(180,83,9,0.04)",
              p: 3,
              borderRadius: "12px",
            }}
          >
            Transaction ref: {result.pidx}
          </Typography>
        ) : null}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Link
            component={RouterLink}
            to="/checkout"
            sx={{
              width: 1,
              py: 3,
              borderRadius: "9999px",
              fontSize: "0.875rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: "white",
              textAlign: "center",
              textDecoration: "none",
              background: "linear-gradient(135deg, #92400e, #b45309)",
              "&:hover": { opacity: 0.9 },
            }}
          >
            Retry Checkout
          </Link>
          <Link
            component={RouterLink}
            to="/products"
            sx={{
              fontSize: "0.875rem",
              color: "rgb(180,83,9)",
              textDecoration: "underline",
              textUnderlineOffset: 2,
              textAlign: "center",
              mt: 2,
              "&:hover": { color: "rgb(120,53,15)" },
            }}
          >
            Continue Shopping
          </Link>
          <Link
            component={RouterLink}
            to="/contact"
            sx={{
              fontSize: "0.875rem",
              color: "rgb(180,83,9)",
              textDecoration: "underline",
              textUnderlineOffset: 2,
              textAlign: "center",
              "&:hover": { color: "rgb(120,53,15)" },
            }}
          >
            Contact Support
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
