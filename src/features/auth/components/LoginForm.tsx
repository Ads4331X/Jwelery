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
import type React from "react";

export default function LoginForm({
  username,
  password,
  errors,
  loading,
  loginError,
  onSubmit,
  onUsernameChange,
  onPasswordChange,
}: {
  username: string;
  password: string;
  errors: {
    username?: string;
    password?: string;
  };
  loading: boolean;
  loginError: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onUsernameChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
}) {
  return (
    <Box>
      <Card
        elevation={0}
        className="w-full max-w-sm border border-stone-200 rounded-2xl"
      >
        <CardContent className="p-8">
          <Box className="text-center mb-8">
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
              Pashupatisunchadi Pasal{" "}
            </Typography>
          </Box>

          {loginError && (
            <Alert severity="error" className="mb-4 text-sm">
              {loginError}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={onSubmit}
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
              onChange={(e) => onUsernameChange(e.target.value)}
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
              onChange={(e) => onPasswordChange(e.target.value)}
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
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
