import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../features/auth/context/context";

type NameForm = { firstName: string; lastName: string };
type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function fieldSx() {
  return {
    "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.88rem" },
    "& .MuiInputLabel-root": { fontSize: "0.82rem" },
  };
}

export default function Profile() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const user = auth?.user ?? null;

  const initialName = useMemo<NameForm>(
    () => ({
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
    }),
    [user?.firstName, user?.lastName],
  );

  const [nameForm, setNameForm] = useState<NameForm>(initialName);
  const [nameErr, setNameErr] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameSaving, setNameSaving] = useState(false);

  const [pwdForm, setPwdForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [pwdErr, setPwdErr] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [pwdSaving, setPwdSaving] = useState(false);

  const saveName = async () => {
    setNameErr(null);
    setNameSuccess(false);
    if (!nameForm.firstName.trim()) {
      setNameErr("First name is required.");
      return;
    }
    if (!nameForm.lastName.trim()) {
      setNameErr("Last name is required.");
      return;
    }
    setNameSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setNameSuccess(true);
    } catch {
      setNameErr("Could not update name. Try again.");
    } finally {
      setNameSaving(false);
    }
  };

  const savePassword = async () => {
    setPwdErr(null);
    setPwdSuccess(false);
    if (!pwdForm.currentPassword) {
      setPwdErr("Current password is required.");
      return;
    }
    if (pwdForm.newPassword.length < 6) {
      setPwdErr("New password must be at least 6 characters.");
      return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdErr("Passwords do not match.");
      return;
    }
    setPwdSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setPwdSuccess(true);
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setPwdErr("Could not change password. Try again.");
    } finally {
      setPwdSaving(false);
    }
  };

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
      "U"
    : "U";

  return (
    <Box className="min-h-screen bg-[#fafaf7]">
      <Box className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-amber-900/60 hover:text-amber-700 text-sm font-medium tracking-wide mb-8 transition-colors duration-200 cursor-pointer"
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Back
        </button>

        {/* Page title */}
        <Box className="mb-8">
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
            component="h1"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: 26, md: 32 },
              fontWeight: 600,
              color: "#1c1917",
              mt: 0.5,
            }}
          >
            My Profile
          </Typography>
          <Box
            className="h-[2px] w-12 rounded-sm mt-3"
            style={{ background: "linear-gradient(90deg, #b45309, #f59e0b)" }}
          />
        </Box>

        {/* Avatar + current info */}
        <Box className="bg-white rounded-[20px] border border-amber-900/[0.08] p-6 mb-4 flex items-center gap-5">
          <Box
            className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xl"
            style={{ background: "linear-gradient(135deg, #92400e, #b45309)" }}
          >
            {initials}
          </Box>
          <Box>
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                fontSize: "1.1rem",
                color: "#1c1917",
              }}
            >
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography sx={{ color: "#78716c", fontSize: "0.82rem", mt: 0.3 }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: { xs: "block", lg: "grid" },
            gridTemplateColumns: "1fr 1fr",
            gap: 3,
          }}
        >
          {/* Edit name */}
          <Box className="bg-white rounded-[20px] border border-amber-900/[0.08] p-6">
            <Box className="flex items-center gap-2 mb-4">
              <PersonOutlineIcon sx={{ fontSize: 18, color: "#b45309" }} />
              <Typography
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "#1c1917",
                }}
              >
                Edit Name
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="First name"
                size="small"
                value={nameForm.firstName}
                onChange={(e) =>
                  setNameForm((p) => ({ ...p, firstName: e.target.value }))
                }
                sx={fieldSx()}
              />
              <TextField
                label="Last name"
                size="small"
                value={nameForm.lastName}
                onChange={(e) =>
                  setNameForm((p) => ({ ...p, lastName: e.target.value }))
                }
                sx={fieldSx()}
              />
            </Box>

            {nameErr && (
              <Alert
                severity="error"
                sx={{ mt: 2, fontSize: "0.78rem", borderRadius: "10px" }}
              >
                {nameErr}
              </Alert>
            )}
            {nameSuccess && (
              <Alert
                severity="success"
                sx={{ mt: 2, fontSize: "0.78rem", borderRadius: "10px" }}
              >
                Name updated successfully.
              </Alert>
            )}

            <Divider sx={{ my: 3, borderColor: "rgba(180,83,9,0.08)" }} />

            <button
              type="button"
              onClick={saveName}
              disabled={nameSaving}
              className="w-full py-3 rounded-full text-sm font-bold uppercase tracking-widest text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #92400e, #b45309)",
              }}
            >
              {nameSaving ? (
                <>
                  <CircularProgress size={14} sx={{ color: "white" }} />
                  Saving...
                </>
              ) : (
                "Save Name"
              )}
            </button>
          </Box>

          {/* Change password */}
          <Box className="bg-white rounded-[20px] border border-amber-900/[0.08] p-6 mt-3 lg:mt-0">
            <Box className="flex items-center gap-2 mb-4">
              <LockOutlinedIcon sx={{ fontSize: 18, color: "#b45309" }} />
              <Typography
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: "1rem",
                  color: "#1c1917",
                }}
              >
                Change Password
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Current password"
                type="password"
                size="small"
                value={pwdForm.currentPassword}
                onChange={(e) =>
                  setPwdForm((p) => ({ ...p, currentPassword: e.target.value }))
                }
                sx={fieldSx()}
              />
              <TextField
                label="New password"
                type="password"
                size="small"
                value={pwdForm.newPassword}
                onChange={(e) =>
                  setPwdForm((p) => ({ ...p, newPassword: e.target.value }))
                }
                sx={fieldSx()}
              />
              <TextField
                label="Confirm new password"
                type="password"
                size="small"
                value={pwdForm.confirmPassword}
                onChange={(e) =>
                  setPwdForm((p) => ({ ...p, confirmPassword: e.target.value }))
                }
                sx={fieldSx()}
              />
            </Box>

            {pwdErr && (
              <Alert
                severity="error"
                sx={{ mt: 2, fontSize: "0.78rem", borderRadius: "10px" }}
              >
                {pwdErr}
              </Alert>
            )}
            {pwdSuccess && (
              <Alert
                severity="success"
                sx={{ mt: 2, fontSize: "0.78rem", borderRadius: "10px" }}
              >
                Password changed successfully.
              </Alert>
            )}

            <Divider sx={{ my: 3, borderColor: "rgba(180,83,9,0.08)" }} />

            <button
              type="button"
              onClick={savePassword}
              disabled={pwdSaving}
              className="w-full py-3 rounded-full text-sm font-bold uppercase tracking-widest text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #92400e, #b45309)",
              }}
            >
              {pwdSaving ? (
                <>
                  <CircularProgress size={14} sx={{ color: "white" }} />
                  Saving...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
