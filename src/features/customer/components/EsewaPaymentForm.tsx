import { useEffect, useMemo, useState } from "react";

import { initiateEsewaPayment } from "../../../services/esewaApi";

type Props = {
  /** Backend created order id */
  orderId: string;
};

type EsewaForm = {
  action: string;
  fields: Record<string, string>;
};

function buildAutoForm({ action, fields }: EsewaForm) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  form.style.display = "none";

  for (const [k, v] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = k;
    input.value = v;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  return form;
}

export const EsewaPaymentForm = ({ orderId }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const trigger = useMemo(() => orderId, [orderId]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!trigger) return;
      setSubmitting(true);
      setErr(null);

      try {
        const { action, fields } = await initiateEsewaPayment(trigger);
        if (cancelled) return;

        // Stash pending txn info before redirecting, so the success/failure
        // pages can recover it even if eSewa doesn't send back a data blob.
        sessionStorage.setItem(
          "esewa_pending_txn",
          JSON.stringify({
            transaction_uuid: fields.transaction_uuid,
            orderId: trigger,
          }),
        );

        const form = buildAutoForm({ action, fields });
        form.submit();

        // The page will navigate away.
        // In case popups/blockers prevent submission, keep UI sane.
        setSubmitting(false);
      } catch (e) {
        console.error("eSewa initiate error:", e);
        if (cancelled) return;
        setSubmitting(false);
        setErr(e instanceof Error ? e.message : "Failed to initiate eSewa");
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [trigger]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2 text-green-600">
        Pay with eSewa
      </h2>
      <p className="text-sm text-amber-900/60 mb-3">Redirecting to eSewa...</p>

      {err ? <div className="text-red-600 text-sm">{err}</div> : null}

      {submitting && !err ? (
        <div className="text-sm text-gray-600">Please wait...</div>
      ) : null}
    </div>
  );
};
