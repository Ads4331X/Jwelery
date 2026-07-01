// src/features/customer/Customerlogin.tsx
import { useContext, useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { AuthContext } from "../auth/context/context";

export default function CustomerLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("Must be inside AuthProvider");

  const fromPath = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;
  // Prevent redirect loops by sanitizing `from`
  const from = fromPath === "/login" || fromPath === "/signup" ? "/" : (fromPath || "/");

  // Redirect if already logged in
  if (!auth.isLoading && auth.user) {
    navigate(from, { replace: true });
    return null;
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [loginErr, setLoginErr] = useState<string | null>(null);

  const validate = () => {
    const errs: typeof errors = {};
    if (!email.trim()) errs.email = "Email is required";
    if (!password) errs.password = "Password is required";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setLoginErr(null);

    const error = await auth.login(email.trim(), password);
    setLoading(false);

    if (error) {
      setLoginErr(error);
      return;
    }

    // If `from` is missing (direct visit /login), land in customer homepage (products).
    // This avoids confusing redirects that can appear as “stuck at root”.
    if (from && from !== "/login") {
      navigate(from, { replace: true });
      return;
    }

    navigate("/", { replace: true });
  };

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
          maxWidth: 400,
          border: "1px solid rgba(180,83,9,0.12)",
          borderRadius: 4,
        }}
      >
        <CardContent sx={{ p: 5 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="overline"
              sx={{
                color: "#b45309",
                letterSpacing: "0.3em",
                fontSize: "0.65rem",
              }}
            >
              Anand Jewellers
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
              Welcome Back
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#78716c", mt: 1, fontSize: "0.85rem" }}
            >
              Sign in to your account
            </Typography>
          </Box>

          {loginErr && (
            <Alert severity="error" sx={{ mb: 3, fontSize: "0.82rem" }}>
              {loginErr}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              fullWidth
              label="Email"
              type="email"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              disabled={loading}
              sx={{
                bgcolor: "#78350f",
                color: "#fef9ee",
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                py: 1.3,
                mt: 0.5,
                "&:hover": { bgcolor: "#92400e" },
              }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>

          <Typography
            sx={{
              textAlign: "center",
              mt: 3,
              fontSize: "0.83rem",
              color: "#78716c",
            }}
          >
            Don't have an account?{" "}
            <NavLink
              to="/signup"
              style={{
                color: "#b45309",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign Up
            </NavLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
