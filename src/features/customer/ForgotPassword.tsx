import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import ForgotPasswordCard from "../../components/auth/forgot-password/ForgotPasswordCard";
import {
  customerForgotPasswordRequest,
  customerForgotPasswordVerify,
  customerForgotPasswordReset,
} from "../../services/authApi";

type Step = "request" | "verify" | "reset";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("request");

  const [resetToken, setResetToken] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const RESEND_COOLDOWN_SECONDS = 180; // 3 minutes between resends (code itself is valid 10 minutes)
  const [resendSecondsLeft, setResendSecondsLeft] = useState(0);
  const resendDisabled = resendSecondsLeft > 0;

  useEffect(() => {
    if (!resendDisabled) return;
    const t = window.setInterval(() => {
      setResendSecondsLeft((s) => {
        if (s <= 1) return 0;
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [resendDisabled]);

  const normalizeEmail = () => email.trim();
  const validEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const navigate = useNavigate();

  const handleResend = async () => {
    if (resendDisabled) return;

    const normalized = normalizeEmail();
    if (!normalized) {
      setError("Email is required");
      return;
    }
    if (!validEmail(normalized)) {
      setError("Please enter a valid email address");
      return;
    }

    setError(null);
    setLoading(true);
    const res = await customerForgotPasswordRequest(normalized);
    setLoading(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setSuccess(true);
    setResendSecondsLeft(RESEND_COOLDOWN_SECONDS);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);
    setSuccess(false);

    if (step === "request") {
      const normalized = normalizeEmail();
      if (!normalized) return setError("Email is required");
      if (!validEmail(normalized))
        return setError("Please enter a valid email address");

      setLoading(true);
      const res = await customerForgotPasswordRequest(normalized);
      setLoading(false);

      if (res.error) return setError(res.error);

      setSuccess(true);
      setStep("verify");
      setResendSecondsLeft(RESEND_COOLDOWN_SECONDS);
      return;
    }

    if (step === "verify") {
      const normalized = normalizeEmail();
      if (!normalized) return setError("Email is required");
      if (!validEmail(normalized))
        return setError("Please enter a valid email address");
      if (!/^\d{6}$/.test(code)) return setError("Enter the 6-digit code");

      setLoading(true);
      const res = await customerForgotPasswordVerify(normalized, code);
      setLoading(false);

      if (res.error) return setError(res.error);
      if (!res.resetToken) return setError("Reset token missing.");

      setResetToken(res.resetToken);
      setSuccess(true);
      setStep("reset");
      return;
    }

    // reset
    if (!resetToken) return setError("Missing reset token. Please try again.");
    if (!newPassword) return setError("New password is required.");
    if (!confirmPassword) return setError("Confirm new password is required.");

    if (newPassword !== confirmPassword)
      return setError("Passwords do not match.");

    setLoading(true);
    const res = await customerForgotPasswordReset(resetToken, newPassword);
    setLoading(false);

    if (res.error) return setError(res.error);

    setSuccess(true);
    navigate("/login");
  };

  return (
    <ForgotPasswordCard
      resendDisabled={resendDisabled}
      resendSecondsLeft={resendSecondsLeft}
      onResend={handleResend}
      panel="customer"
      step={step}
      email={email}
      setEmail={setEmail}
      code={code}
      setCode={setCode}
      newPassword={newPassword}
      setNewPassword={setNewPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      loading={loading}
      error={error}
      success={success}
      onSubmit={handleSubmit}
    />
  );
}
