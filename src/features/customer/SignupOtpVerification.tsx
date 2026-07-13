import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { verifySignupOtp, resendSignupOtp } from "../../services/authApi";

type Props = {
  userId: string;
  email: string;
  onVerifiedNavigate: (token: string) => void;
};

function clampDigits(input: string) {
  return input.replace(/\D/g, "").slice(0, 6);
}

export default function SignupOtpVerification({
  userId,
  email,
  onVerifiedNavigate,
}: Props) {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(0);

  const formattedEmail = useMemo(() => email || "", [email]);

  useEffect(() => {
    if (cooldownSecondsLeft <= 0) return;
    const t = window.setInterval(() => {
      setCooldownSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [cooldownSecondsLeft]);

  async function onSubmitVerify() {
    setError(null);

    if (code.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }

    setLoading(true);
    try {
      const result = await verifySignupOtp(userId, code);
      if (!result.success || !result.data?.token) {
        setError(result.message || "Verification failed.");
        return;
      }
      onVerifiedNavigate(result.data.token);
      // Keep destination logic centralized in parent; fallback here:
      navigate("/customer/orders");
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    setError(null);
    if (cooldownSecondsLeft > 0) {
      setError("Please wait before requesting another code.");
      return;
    }

    setResending(true);
    try {
      const result = await resendSignupOtp(userId);
      if (!result.success) {
        setError(result.message || "Could not resend code.");
        return;
      }
      // UI cooldown (backend also enforces cooldown)
      setCooldownSecondsLeft(30);
    } finally {
      setResending(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 8 }}>Verify your email</h2>
      <p style={{ marginTop: 0, opacity: 0.9 }}>
        Enter the 6-digit code sent to <b>{formattedEmail}</b>.
      </p>

      <div
        style={{
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>OTP code</span>
          <input
            inputMode="numeric"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(clampDigits(e.target.value))}
            style={{
              padding: 12,
              fontSize: 18,
              letterSpacing: 6,
              textAlign: "center",
            }}
          />
        </label>

        {error ? (
          <div style={{ color: "#b00020", fontSize: 14 }}>{error}</div>
        ) : null}

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onSubmitVerify}
            disabled={loading}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#111",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>

          <button
            onClick={onResend}
            disabled={resending || cooldownSecondsLeft > 0}
            style={{
              padding: "12px 16px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "#fff",
              color: "#111",
              cursor: cooldownSecondsLeft > 0 ? "not-allowed" : "pointer",
              minWidth: 160,
            }}
          >
            {resending
              ? "Resending..."
              : cooldownSecondsLeft > 0
                ? `Resend (${cooldownSecondsLeft}s)`
                : "Resend"}
          </button>
        </div>
      </div>
    </div>
  );
}
