import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../../config/appConfig";

const API_BASE = API_BASE_URL;

type FailureResult = {
  loading: boolean;
  success: boolean;
  message: string;
  transactionUuid?: string;
};

type PendingTxn = {
  transaction_uuid: string;
  orderId: string;
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

function readPendingTxn(): PendingTxn | null {
  try {
    const raw = sessionStorage.getItem("esewa_pending_txn");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.transaction_uuid && parsed?.orderId) return parsed;
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

  const transactionUuid = decodeTransactionUuid(dataParam);
  const [pendingTxn] = useState<PendingTxn | null>(readPendingTxn);

  const [result, setResult] = useState<FailureResult>(() => {
    if (!dataParam && !pendingTxn) {
      return {
        loading: false,
        success: false,
        message: "Missing payment data. Your order may be incomplete.",
      };
    }
    return {
      loading: true,
      success: false,
      message: "Recording payment failure...",
    };
  });

  useEffect(() => {
    let cancelled = false;

    async function recordFailure() {
      try {
        let res: Response;
        let json: Record<string, unknown> | null;

        if (dataParam) {
          // eSewa sent back a data blob — use the existing flow
          const encodedData = encodeURIComponent(dataParam);
          res = await fetch(`${API_BASE}/esewa/failure?data=${encodedData}`);
          json = await res.json().catch(() => null);

          if (cancelled) return;

          if (res.ok && json?.success && ((json?.updated as number) ?? 0) > 0) {
            setResult({
              loading: false,
              success: true,
              message:
                (json.message as string) ??
                "Payment failed. Your order has been cancelled.",
              transactionUuid:
                (json.transaction_uuid as string) ??
                transactionUuid ??
                undefined,
            });
          } else {
            setResult({
              loading: false,
              success: false,
              message:
                (json?.message as string) ??
                "Could not update payment status. Please contact support.",
              transactionUuid: transactionUuid ?? undefined,
            });
          }

          clearPendingTxn();
        } else if (pendingTxn) {
          // No data blob from eSewa — use sessionStorage fallback
          res = await fetch(`${API_BASE}/esewa/failure/manual`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transaction_uuid: pendingTxn.transaction_uuid,
            }),
          });
          json = await res.json().catch(() => null);

          if (cancelled) return;

          if (res.ok && json?.success && ((json?.updated as number) ?? 0) > 0) {
            setResult({
              loading: false,
              success: true,
              message:
                (json.message as string) ??
                "Payment cancelled. Your order has been cancelled.",
              transactionUuid: pendingTxn.transaction_uuid,
            });
          } else {
            setResult({
              loading: false,
              success: false,
              message:
                (json?.message as string) ??
                "Could not update payment status. Please contact support.",
              transactionUuid: pendingTxn.transaction_uuid,
            });
          }

          clearPendingTxn();
        }
        // else: no data and no pending txn — handled by initial state
      } catch {
        if (cancelled) return;
        setResult({
          loading: false,
          success: false,
          message: "Could not connect to server. Please contact support.",
          transactionUuid: transactionUuid ?? undefined,
        });
      }
    }

    // Only run if we have something to record
    if (dataParam || pendingTxn) {
      void recordFailure();
    }

    return () => {
      cancelled = true;
    };
  }, [dataParam, transactionUuid, pendingTxn]);

  if (result.loading) {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
        <div className="bg-white rounded-[20px] border border-amber-900/[0.08] p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700 mx-auto mb-4" />
          <p className="text-amber-900/70 text-sm">
            Recording payment failure...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
      <div className="bg-white rounded-[20px] border border-amber-900/[0.08] p-8 max-w-md w-full text-center">
        {/* Failure icon */}
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-red-700 mb-2">
          Payment Cancelled / Failed
        </h1>
        <p className="text-amber-900/70 text-sm mb-4">{result.message}</p>

        {result.transactionUuid ? (
          <p className="text-xs text-amber-900/50 mb-6 break-all bg-amber-50 p-3 rounded-lg">
            Transaction ref: {result.transactionUuid}
          </p>
        ) : null}

        <div className="flex flex-col gap-3">
          <Link
            to="/checkout"
            className="w-full py-3 rounded-full text-sm font-bold uppercase tracking-widest text-white transition-all duration-200 text-center"
            style={{
              background: "linear-gradient(135deg, #92400e, #b45309)",
            }}
          >
            Retry Checkout
          </Link>
          <Link
            to="/contact"
            className="text-sm text-amber-700 underline underline-offset-2 hover:text-amber-900 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
