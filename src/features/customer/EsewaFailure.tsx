import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, CircularProgress, Link } from "@mui/material";
import CancelOutlinedIcon from "@mui/icons-material/Cancel";
import { API_BASE_URL } from "../../config/appConfig";

const API_BASE = API_BASE_URL;

type FailureResult = {
  loading: boolean;
  message: string;
  transactionUuid?: string;
};

function decodeTransactionUuid(dataParam: string | null): string | null {
  if (!dataParam) return null;
  try {
    const decoded = atob(dataParam);
    const parsed = JSON.parse(decoded);
    return parsed.transaction_uuid ?? null;
  } catch {
    return null;
  }
}

type PendingTxn = {
  transaction_uuid: string;
};

function readPendingTxn(): PendingTxn | null {
  try {
    const raw = sessionStorage.getItem("esewa_pending_txn");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.transaction_uuid) return parsed;
    return null;
  } catch {
    return null;
  }
}

function clearPendingTxn(): void {
  sessionStorage.removeItem("esewa_pending_txn");
}

export default function EsewaFailure() {
  const [searchParams] = useSearchParams();
  const dataParam = searchParams.get("data");

  const transactionUuid =
    decodeTransactionUuid(dataParam) ??
    readPendingTxn()?.transaction_uuid ??
    null;

  const [result, setResult] = useState<FailureResult>(() => {
    if (!dataParam && !readPendingTxn()) {
      return {
        loading: false,
        message:
          "Payment was cancelled or failed. No order was created. Your cart is unchanged.",
      };
    }
    return {
      loading: true,
      message: "Recording payment failure...",
    };
  });

  useEffect(() => {
    let cancelled = false;

    async function recordFailure() {
      try {
        if (dataParam) {
          const encodedData = encodeURIComponent(dataParam);
          await fetch(`${API_BASE}/api/esewa/failure?data=${encodedData}`);
        } else {
          const pendingTxn = readPendingTxn();
          if (pendingTxn?.transaction_uuid) {
            await fetch(`${API_BASE}/api/esewa/failure/manual`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                transaction_uuid: pendingTxn.transaction_uuid,
              }),
            });
          }
        }

        if (cancelled) return;
        clearPendingTxn();

        setResult({
          loading: false,
          message:
            "Payment was cancelled or failed. No order was created. Your cart is unchanged.",
          transactionUuid: transactionUuid ?? undefined,
        });
      } catch {
        if (cancelled) return;
        clearPendingTxn();
        setResult({
          loading: false,
          message:
            "Payment was cancelled or failed. No order was created. Your cart is unchanged.",
          transactionUuid: transactionUuid ?? undefined,
        });
      }
    }

    void recordFailure();

    return () => {
      cancelled = true;
    };
  }, [dataParam, transactionUuid]);

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
            Recording payment failure...
          </Typography>
        </Box>
      </Box>
    );
  }

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
          <CancelOutlinedIcon sx={{ fontSize: 32, color: "error.main" }} />
        </Box>

        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "error.dark", mb: 2 }}
        >
          Payment Cancelled / Failed
        </Typography>
        <Typography
          sx={{ color: "rgba(180,83,9,0.7)", fontSize: "0.875rem", mb: 4 }}
        >
          {result.message}
        </Typography>

        {result.transactionUuid ? (
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
            Transaction ref: {result.transactionUuid}
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
