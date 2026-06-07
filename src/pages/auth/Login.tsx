import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useAuth } from "../../hooks/auth/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    setLoginError(null);
    const err = await login(username.trim(), password);
    setLoading(false);

    if (err) {
      setLoginError("Invalid username or password.");
      return;
    }
    navigate("/admin");
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <Card
        elevation={0}
        className="w-full max-w-sm border border-stone-200 rounded-2xl"
      >
        <CardContent className="p-8">
          {/* Brand header */}
          <div className="text-center mb-8">
            <Typography
              variant="overline"
              className="text-stone-400 tracking-widest text-xs"
            >
              Admin Panel
            </Typography>
            <Typography
              variant="h5"
              className="font-semibold text-stone-800 mt-1"
            >
              Pashupatisunchadu Pasal{" "}
            </Typography>
          </div>

          {loginError && (
            <Alert severity="error" className="mb-4 text-sm">
              {loginError}
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              size="small"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!errors.username}
              helperText={errors.username}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="outlined"
              size="small"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              disableElevation
              className="h-10 mt-1 rounded-lg normal-case font-semibold text-sm bg-stone-800 hover:bg-stone-700"
            >
              {loading ? (
                <CircularProgress size={20} className="text-white" />
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
