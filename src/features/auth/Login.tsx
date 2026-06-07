import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import LoginForm from "./components/LoginForm";

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
      <LoginForm
        username={username}
        password={password}
        errors={errors}
        loading={loading}
        loginError={loginError}
        onSubmit={handleSubmit}
        onUsernameChange={setUsername}
        onPasswordChange={setPassword}
      />
    </Box>
  );
}
