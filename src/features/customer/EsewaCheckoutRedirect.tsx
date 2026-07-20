import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { EsewaPaymentForm } from "./components/EsewaPaymentForm";

type LocationState = {
  orderId?: string | null;
};

export default function EsewaCheckoutRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  const state = (location.state ?? {}) as LocationState;
  const orderId = useMemo(() => state.orderId ?? "", [state.orderId]);
  const missing = !orderId;

  if (missing) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <h2 className="text-lg font-semibold text-red-600 mb-2">
          Missing order reference
        </h2>
        <p className="text-sm text-amber-900/70">
          Please go back and try again.
        </p>
        <button
          className="mt-4 px-4 py-2 rounded bg-amber-700 text-white"
          onClick={() => navigate("/checkout")}
          type="button"
        >
          Back to Checkout
        </button>
      </div>
    );
  }

  return <EsewaPaymentForm orderId={orderId} />;
}
