import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { API_BASE_URL } from "../../config/appConfig";

const API_BASE = API_BASE_URL;

type VerifyResult = {
  loading: boolean;
  success: boolean;
  message: string;
  transactionUuid?: string;
};

function decodeEsewaData(data: string): Record<string, string> | null {
  try {
    const decoded = atob(data);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export default function EsewaSuccess() {
  const [searchParams] = useSearchParams();
  const dataParam = searchParams.get("data");

  const [result, setResult] = useState<VerifyResult>(() => {
    if (!dataParam) {
      return {
        loading: false,
        success: false,
        message: "Missing payment verification data.",
      };
    }
    return {
      loading: true,
      success: false,
      message: "Verifying payment...",
    };
  });

  useEffect(() => {
    if (!dataParam) return;

    let cancelled = false;
    const decoded = decodeEsewaData(dataParam);
    const txnUuid = decoded?.transaction_uuid;
    const encodedData = encodeURIComponent(dataParam);

    async function verify() {
      try {
        const res = await fetch(`${API_BASE}/esewa/verify?data=${encodedData}`);
        const json = await res.json().catch(() => null);

        if (cancelled) return;

        if (res.ok && json?.success) {
          setResult({
            loading: false,
            success: true,
            message: json.message ?? "Payment Successful!",
            transactionUuid: txnUuid,
          });
        } else {
          setResult({
            loading: false,
            success: false,
            message: json?.message ?? "Payment verification failed.",
            transactionUuid: txnUuid,
          });
        }
      } catch {
        if (cancelled) return;
        setResult({
          loading: false,
          success: false,
          message: "Could not connect to server for verification.",
          transactionUuid: txnUuid,
        });
      }
    }

    void verify();

    return () => {
      cancelled = true;
    };
  }, [dataParam]);

  if (result.loading) {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
        <div className="bg-white rounded-[20px] border border-amber-900/[0.08] p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700 mx-auto mb-4" />
          <p className="text-amber-900/70 text-sm">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (result.success) {
    return (
      <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
        <div className="bg-white rounded-[20px] border border-amber-900/[0.08] p-8 max-w-md w-full text-center">
          {/* Success icon */}
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-green-700 mb-2">
            Payment Successful!
          </h1>
          <p className="text-amber-900/70 text-sm mb-4">{result.message}</p>

          {result.transactionUuid ? (
            <p className="text-xs text-amber-900/50 mb-6 break-all bg-amber-50 p-3 rounded-lg">
              Transaction ref: {result.transactionUuid}
            </p>
          ) : null}

          <div className="flex flex-col gap-3">
            <Link
              to="/orders"
              className="w-full py-3 rounded-full text-sm font-bold uppercase tracking-widest text-white transition-all duration-200 text-center"
              style={{
                background: "linear-gradient(135deg, #92400e, #b45309)",
              }}
            >
              View My Orders
            </Link>
            <Link
              to="/products"
              className="text-sm text-amber-700 underline underline-offset-2 hover:text-amber-900 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Failure case (verify failed)
  return (
    <div className="min-h-screen bg-[#fafaf7] flex items-center justify-center">
      <div className="bg-white rounded-[20px] border border-amber-900/[0.08] p-8 max-w-md w-full text-center">
        {/* Warning icon */}
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-red-700 mb-2">
          Payment Verification Failed
        </h1>
        <p className="text-amber-900/70 text-sm mb-6">{result.message}</p>

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
