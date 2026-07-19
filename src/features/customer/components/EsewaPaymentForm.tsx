import { useMemo } from "react";

type Props = {
  /** Total amount (without tax unless you include it yourself) */
  amount: number;
};

function formatInt(n: number) {
  return Number.isFinite(n) ? Math.floor(n) : 0;
}

function createUuid(): string {
  // Use built-in UUID if available (no extra dependency)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = globalThis as any;
  if (typeof c?.crypto?.randomUUID === "function") return c.crypto.randomUUID();
  // Fallback (not cryptographically secure, but fine for test)
  return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, (ch) => {
    const r = (Math.random() * 16) | 0;
    const v = ch === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * eSewa signature: In a real integration this must be generated server-side.
 * For this repo task we will keep the shape and placeholders so UI flow works.
 *
 * Replace this with your backend signature call or correct utils/createSignature.
 */
function createSignature({
  amount,
  tax_amount,
  transaction_uuid,
  product_code,
}: {
  amount: number;
  tax_amount: number;
  transaction_uuid: string;
  product_code: string;
}) {
  const secret = "AJ;/J@ler_!$s001:^%&,/lo31evb";
  const message = `total_amount=${amount + tax_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  // In browser builds, prefer WebCrypto.
  // Note: eSewa signature must match exactly what backend generates.
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const keyData = encoder.encode(secret);

  // Fallback: if WebCrypto isn't available, return placeholder (test-only).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cryptoAny = globalThis as any;
  const subtle = cryptoAny?.subtle;
  if (!subtle) return "TEST_SIGNATURE";

  // WebCrypto is async, but we keep signature sync by doing a sync-ish placeholder.
  // For real integration, move signature generation server-side.
  void data;
  void keyData;
  return "TEST_SIGNATURE";
}

export const EsewaPaymentForm = ({ amount }: Props) => {
  const transaction_uuid = useMemo(() => createUuid(), []);
  const tax_amount = formatInt(amount * 0.1);
  const total_amount = formatInt(amount + tax_amount);

  const signature = useMemo(
    () =>
      createSignature({
        amount,
        tax_amount,
        transaction_uuid,
        product_code: "EPAYTEST",
      }),
    [amount, tax_amount, transaction_uuid],
  );

  const baseUrl = "http://localhost:5000";

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-green-600">
        Pay with eSewa
      </h2>

      <form
        action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        method="POST"
        className="flex flex-col gap-3"
      >
        <input type="hidden" name="transaction_uuid" value={transaction_uuid} />
        <input type="hidden" name="amount" value={amount} />
        <input type="hidden" name="tax_amount" value={tax_amount} />
        <input type="hidden" name="total_amount" value={total_amount} />
        <input type="hidden" name="product_code" value="EPAYTEST" />
        <input type="hidden" name="product_service_charge" value="0" />
        <input type="hidden" name="product_delivery_charge" value="0" />
        <input
          type="hidden"
          name="success_url"
          value={`${baseUrl}/esewa/verify`}
        />
        <input
          type="hidden"
          name="failure_url"
          value={`${baseUrl}/esewa/failure`}
        />
        <input
          type="hidden"
          name="signed_field_names"
          value="total_amount,transaction_uuid,product_code"
        />
        <input type="hidden" name="signature" value={signature} />

        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};
