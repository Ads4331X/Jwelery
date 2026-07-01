// src/features/customer/Customersignup.tsx
import { useContext, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
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
import { customerSignup } from "../../services/authApi";
import { AuthContext } from "../auth/context/context";
import { setAuthCookies } from "../auth/context/authCookies";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirm: string;
}

export default function CustomerSignup() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("Must be inside AuthProvider");

  // Redirect if already logged in
  if (!auth.isLoading && auth.user) {
    navigate("/", { replace: true });
    return null;
  }

  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [signupErr, setSignupErr] = useState<string | null>(null);

  const set =
    (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const validate = (): Partial<FormState> => {
    const errs: Partial<FormState> = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.password) errs.password = "Password is required";
    if (form.password.length < 6) errs.password = "At least 6 characters";
    if (form.password !== form.confirm) errs.confirm = "Passwords don't match";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    setSignupErr(null);

    const result = await customerSignup({
      email: form.email.trim(),
      password: form.password,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim() || undefined,
    });

    setLoading(false);

    if (result.error) {
      // Surface any backend field errors into the form
      if (result.fieldErrors) {
        setErrors({
          email: result.fieldErrors.email,
          password: result.fieldErrors.password,
          firstName: result.fieldErrors.firstName,
        });
      }
      setSignupErr(result.error);
      return;
    }

    // Auto-login: persist auth via shared cookies (not localStorage)
    auth.setUser(result.user!);
    setAuthCookies(result.token!, JSON.stringify(result.user!));

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
          maxWidth: 420,
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
              Create Account
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#78716c", mt: 1, fontSize: "0.85rem" }}
            >
              Join us and explore our collections
            </Typography>
          </Box>

          {signupErr && (
            <Alert severity="error" sx={{ mb: 3, fontSize: "0.82rem" }}>
              {signupErr}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.5 }}
            >
              <TextField
                label="First Name"
                size="small"
                required
                value={form.firstName}
                onChange={set("firstName")}
                error={!!errors.firstName}
                helperText={errors.firstName}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
              <TextField
                label="Last Name"
                size="small"
                value={form.lastName}
                onChange={set("lastName")}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />
            </Box>

            <TextField
              fullWidth
              label="Email"
              type="email"
              size="small"
              required
              value={form.email}
              onChange={set("email")}
              error={!!errors.email}
              helperText={errors.email}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              size="small"
              required
              value={form.password}
              onChange={set("password")}
              error={!!errors.password}
              helperText={errors.password}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              size="small"
              required
              value={form.confirm}
              onChange={set("confirm")}
              error={!!errors.confirm}
              helperText={errors.confirm}
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
                "Create Account"
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
            Already have an account?{" "}
            <NavLink
              to="/login"
              style={{
                color: "#b45309",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign In
            </NavLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
