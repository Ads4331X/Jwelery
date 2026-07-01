import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { AdminAuthContext } from "./context/adminAuthContext";
import LoginForm from "./components/LoginForm";

export default function Login() {
  const navigate = useNavigate();
  const auth = useContext(AdminAuthContext);
  if (!auth) throw new Error("Login must be used within an AdminAuthProvider");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    setLoginError(null);

    const err = await auth.login(email.trim(), password);
    setLoading(false);

    if (err) {
      setLoginError(err);
      return;
    }

    navigate("/admin");
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-stone-100 px-4">
      <LoginForm
        email={email}
        password={password}
        errors={errors}
        loading={loading}
        loginError={loginError}
        onSubmit={handleSubmit}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
      />
    </Box>
  );
}
