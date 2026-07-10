import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import type React from "react";

type Panel = "customer" | "admin";

type Step = "request" | "verify" | "reset";

type Props = {
  panel: Panel;
  step: Step;

  email: string;
  setEmail: (v: string) => void;

  code: string;
  setCode: (v: string) => void;

  newPassword: string;
  setNewPassword: (v: string) => void;

  confirmPassword: string;
  setConfirmPassword: (v: string) => void;

  resendDisabled: boolean;
  resendSecondsLeft: number;
  onResend: () => void;

  loading: boolean;
  error: string | null;
  success: boolean;

  onSubmit: (e: React.FormEvent) => void;
};

export default function ForgotPasswordCard({
  panel,
  step,
  email,
  setEmail,
  code,
  setCode,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  error,
  success,
  onSubmit,
  resendDisabled,
  resendSecondsLeft,
  onResend,
}: Props) {
  const isAdmin = panel === "admin";
  const accent = isAdmin ? "#0f172a" : "#b45309";
  const title = isAdmin ? "Admin Panel" : "Anand Jewellers";

  const subtitle = (() => {
    if (isAdmin) {
      if (step === "request") return "Request an admin password reset";
      if (step === "verify") return "Verify your admin reset code";
      return "Set a new admin password";
    }

    if (step === "request") return "Request a password reset";
    if (step === "verify") return "Verify your reset code";
    return "Set a new password";
  })();

  const currentStepIndex = step === "request" ? 1 : step === "verify" ? 2 : 3;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fafaf7",
        px: 2,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 480,
          border: `1px solid ${isAdmin ? "rgba(15,23,42,0.12)" : "rgba(180,83,9,0.12)"}`,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: 6,
            bgcolor: accent,
          }}
        />

        <CardContent sx={{ p: 5 }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="overline"
              sx={{
                color: accent,
                letterSpacing: "0.3em",
                fontSize: "0.65rem",
                textTransform: "uppercase",
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                color: "#1c1917",
                mt: 0.5,
              }}
            >
              Forgot Password
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "#78716c", mt: 1, fontSize: "0.88rem" }}
            >
              {subtitle}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
              {[1, 2, 3].map((n) => {
                const isActive = n === currentStepIndex;
                const isDone = n < currentStepIndex;
                return (
                  <Box key={n} sx={{ flex: 1, textAlign: "center" }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        mx: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: isActive
                          ? accent
                          : isDone
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(120,113,108,0.12)",
                        color: isDone
                          ? "#22c55e"
                          : isActive
                            ? "#fff"
                            : "#78716c",
                        border: isActive
                          ? `1px solid ${accent}`
                          : "1px solid rgba(0,0,0,0.04)",
                        transition: "background-color 180ms ease",
                      }}
                    >
                      <Typography sx={{ fontSize: 12, fontWeight: 700 }}>
                        {isDone ? "✓" : n}
                      </Typography>
                    </Box>
                    <Typography
                      sx={{ fontSize: 12, mt: 0.75, color: "#78716c" }}
                    >
                      {n === 1 ? "Email" : n === 2 ? "Code" : "Reset"}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
            <Divider sx={{ mt: 2 }} />
          </Box>

          {success ? (
            <Alert severity="success" sx={{ mb: 3, fontSize: "0.82rem" }}>
              {step === "request" ? (
                <>
                  If an account exists for{" "}
                  <strong>{email.trim() || "your email"}</strong>, we sent a
                  6-digit reset code.
                </>
              ) : step === "verify" ? (
                <>Code verified. Now reset your password.</>
              ) : (
                <>Password updated successfully.</>
              )}
            </Alert>
          ) : (
            error && (
              <Alert severity="error" sx={{ mb: 3, fontSize: "0.82rem" }}>
                {error}
              </Alert>
            )
          )}

          <Box
            component="form"
            onSubmit={onSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}
          >
            {step === "request" && (
              <TextField
                fullWidth
                label="Email"
                type="email"
                size="small"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                error={
                  !success && !!error && error.toLowerCase().includes("email")
                }
                helperText={
                  !success && error && error.toLowerCase().includes("email")
                    ? error
                    : " "
                }
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            )}

            {step === "verify" && (
              <>
                <TextField
                  fullWidth
                  label="6-digit code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  size="small"
                  value={code}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setCode(v);
                  }}
                  disabled={loading}
                  error={
                    !success && !!error && error.toLowerCase().includes("code")
                  }
                  helperText={
                    !success && error && error.toLowerCase().includes("code")
                      ? error
                      : " "
                  }
                  slotProps={{
                    htmlInput: {
                      inputMode: "numeric",
                      pattern: "[0-9]{6}",
                      maxLength: 6,
                    },
                  }}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ fontSize: 12.5, color: "#78716c", pt: 0.5 }}
                  >
                    {resendDisabled
                      ? `You can resend in ${Math.max(0, resendSecondsLeft)}s`
                      : "Didn’t receive the code?"}
                  </Typography>

                  <Button
                    type="button"
                    onClick={onResend}
                    disabled={resendDisabled || loading || !email.trim()}
                    sx={{
                      textTransform: "none",
                      fontWeight: 650,
                      borderRadius: "10px",
                      px: 1.5,
                    }}
                  >
                    Resend code
                  </Button>
                </Box>
              </>
            )}

            {step === "reset" && (
              <>
                <TextField
                  fullWidth
                  label="New password"
                  type="password"
                  size="small"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />

                <TextField
                  fullWidth
                  label="Confirm new password"
                  type="password"
                  size="small"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />

                <Typography sx={{ fontSize: 12.5, color: "#78716c", mt: -0.4 }}>
                  Your new password must be different from the old one.
                </Typography>
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              disabled={loading}
              aria-busy={loading ? "true" : undefined}
              sx={{
                bgcolor: isAdmin ? "#0f172a" : "#78350f",
                color: "#fef9ee",
                borderRadius: "12px",
                textTransform: "none",
                fontWeight: 650,
                py: 1.25,
                mt: 0.5,
                "&:hover": { bgcolor: isAdmin ? "#0b1220" : "#92400e" },
              }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : step === "request" ? (
                "Send Reset Code"
              ) : step === "verify" ? (
                "Verify Code"
              ) : (
                "Update Password"
              )}
            </Button>

            <Typography
              sx={{
                textAlign: "center",
                mt: 0.8,
                fontSize: "0.82rem",
                color: "#78716c",
              }}
            >
              {step === "request"
                ? "We’ll never share your email."
                : step === "verify"
                  ? "Enter the 6-digit code sent to your email."
                  : "Choose a strong password you haven’t used before."}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
