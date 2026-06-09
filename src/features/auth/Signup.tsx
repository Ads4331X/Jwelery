import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Card, CardContent, CircularProgress, TextField, Typography } from "@mui/material";
import { AuthContext } from "./context/context";
import { createAdmin } from "../admin/utils/adminUser";

export default function Signup() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  // AuthContext is only used to navigate; signup itself creates the user.
  // If someone accesses this page without AuthProvider, fail loudly.
  if (!auth) throw new Error("Signup must be used within an AuthProvider");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  const validate = () => {
    const next: typeof errors = {};
    if (!username.trim()) next.username = "Username is required";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!validate()) return;

    setLoading(true);
    try {
      const res = await createAdmin(username.trim(), password);
      if (res.error) {
        setSignupError(res.error);
        return;
      }

      // We created the admin account; Supabase should have an auth session.
      // AuthProvider will set isAuthenticated and allow /admin.
      navigate("/admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <Card
        elevation={0}
        className="w-full max-w-sm border border-stone-200 rounded-2xl"
      >
        <CardContent className="p-8">
          <Box className="text-center mb-6">
            <Typography
              variant="overline"
              className="text-stone-400 tracking-widest text-xs"
            >
              Testing Only
            </Typography>
            <Typography variant="h5" className="font-semibold text-stone-800 mt-1">
              Create Admin Account
            </Typography>
            <Typography variant="body2" className="text-stone-500 mt-2">
              Signup is for testing purposes only.
            </Typography>
          </Box>

          {signupError && (
            <Alert severity="error" className="mb-4 text-sm">
              {signupError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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
              autoComplete="new-password"
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
              {loading ? <CircularProgress size={20} className="text-white" /> : "Create Account"}
            </Button>
          </Box>

          <Button
            variant="text"
            fullWidth
            onClick={() => navigate("/login")}
            className="mt-4 normal-case text-sm text-stone-600 hover:text-stone-800"
          >
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

