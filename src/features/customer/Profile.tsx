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

import MyAddresses from "./MyAddresses";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../features/auth/context/context";
import {
  customerChangePassword,
  customerUpdateProfile,
  getToken,
} from "../../services/authApi";

import { setAuthCookies } from "../../features/auth/context/authCookies";

type NameForm = { firstName: string; lastName: string };
type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type TabKey = "account" | "security";

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

  const [tab, setTab] = useState<TabKey>("account");

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

  const [signOutConfirm, setSignOutConfirm] = useState(false);

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
      "U"
    : "U";

  const saveName = async () => {
    if (!auth) return;

    setNameErr(null);
    setNameSuccess(false);

    const firstName = nameForm.firstName.trim();
    const lastName = nameForm.lastName.trim();

    if (!firstName) {
      setNameErr("First name is required.");
      return;
    }

    setNameSaving(true);
    try {
      const res = await customerUpdateProfile(firstName, lastName || "");
      if (res.error) {
        setNameErr(res.error);
        return;
      }
      if (!res.user) {
        setNameErr("Could not update name. Please try again.");
        return;
      }

      // Refresh cookie + context so it survives a page refresh.
      // Token cookie remains valid; we re-write the user cookie with updated data.
      auth.setUser(res.user);
      const token = getToken();
      if (token) {
        setAuthCookies(token, JSON.stringify(res.user));
      }

      setNameSuccess(true);
    } catch {
      setNameErr("Could not update name. Try again.");
    } finally {
      setNameSaving(false);
    }
  };

  const savePassword = async () => {
    if (!auth) return;

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
    if (pwdForm.newPassword === pwdForm.currentPassword) {
      setPwdErr("New password must be different from your current password.");
      return;
    }

    setPwdSaving(true);
    try {
      const res = await customerChangePassword(
        pwdForm.currentPassword,
        pwdForm.newPassword,
      );
      if (res.error) {
        setPwdErr(res.error);
        return;
      }

      setPwdSuccess(true);
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setPwdErr("Could not change password. Try again.");
    } finally {
      setPwdSaving(false);
    }
  };

  const tabButtonSx = (active: boolean) =>
    ({
      flex: 1,
      py: 1.2,
      px: 2,
      borderRadius: "999px",
      border: "1px solid rgba(180,83,9,0.12)",
      background: active ? "linear-gradient(135deg, #92400e, #b45309)" : "#fff",
      color: active ? "#fff" : "#b45309",
      fontWeight: 800,
      fontSize: "0.82rem",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      cursor: "pointer",
      transition: "all 200ms ease",
    }) as const;

  const gradientButtonClass =
    "w-full py-3 rounded-full text-sm font-bold uppercase tracking-widest text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2";

  const stopConfirm = () => setSignOutConfirm(false);

  const handleSignOut = () => {
    stopConfirm();
    auth?.logout();
    navigate("/login");
  };

  return (
    <Box className="min-h-screen bg-[#fafaf7]">
      <Box className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
        {/* Back + actions */}
        <Box className="flex items-start justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-amber-900/60 hover:text-amber-700 text-sm font-medium tracking-wide transition-colors duration-200 cursor-pointer"
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            Back
          </button>

          <Box className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/orders")}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold tracking-widest transition-all duration-200 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #92400e, #b45309)",
                color: "#fff",
              }}
            >
              Orders
            </button>

            <Box className="relative">
              {!signOutConfirm ? (
                <button
                  type="button"
                  onClick={() => setSignOutConfirm(true)}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold tracking-widest transition-all duration-200 cursor-pointer"
                  style={{
                    background: "transparent",
                    color: "#b45309",
                    border: "1px solid rgba(180,83,9,0.18)",
                  }}
                >
                  Sign Out
                </button>
              ) : (
                <Box
                  className="bg-white rounded-[16px] border border-amber-900/[0.08] p-3"
                  sx={{ minWidth: 220 }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.78rem",
                      color: "#78716c",
                      mb: 1,
                    }}
                  >
                    Sign out from this device?
                  </Typography>
                  <Box className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSignOut()}
                      className="flex-1 py-2 rounded-full text-sm font-bold tracking-widest text-white transition-all duration-200 cursor-pointer"
                      style={{
                        background: "linear-gradient(135deg, #92400e, #b45309)",
                      }}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => stopConfirm()}
                      className="flex-1 py-2 rounded-full text-sm font-bold tracking-widest text-amber-900/70 transition-all duration-200 cursor-pointer"
                      style={{
                        background: "rgba(180,83,9,0.06)",
                      }}
                    >
                      No
                    </button>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

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

        {/* Tabs */}
        <Box className="bg-white rounded-[20px] border border-amber-900/[0.08] p-2 mb-4">
          <Box className="flex gap-2">
            <button
              type="button"
              style={tabButtonSx(tab === "account")}
              onClick={() => setTab("account")}
            >
              Account
            </button>
            <button
              type="button"
              style={tabButtonSx(tab === "security")}
              onClick={() => setTab("security")}
            >
              Security
            </button>
          </Box>
        </Box>

        {/* Content */}
        {tab === "account" ? (
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
                Account
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
              <TextField
                label="Email"
                size="small"
                value={user?.email ?? ""}
                disabled
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

            <Box sx={{ mt: 2 }}>
              <MyAddresses />
            </Box>

            <Divider sx={{ my: 3, borderColor: "rgba(180,83,9,0.08)" }} />

            <button
              type="button"
              onClick={saveName}
              disabled={nameSaving}
              className={gradientButtonClass}
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
                "Save Changes"
              )}
            </button>
          </Box>
        ) : (
          <Box className="bg-white rounded-[20px] border border-amber-900/[0.08] p-6">
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
                Security
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

            <Typography
              sx={{
                textAlign: "center",
                mt: 2,
                fontSize: "0.82rem",
                color: "#78716c",
              }}
            >
              Forgot password instead?{" "}
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="font-bold"
                style={{
                  color: "#b45309",
                  textDecoration: "none",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                }}
              >
                Reset it
              </button>
            </Typography>

            <Divider sx={{ my: 3, borderColor: "rgba(180,83,9,0.08)" }} />

            <button
              type="button"
              onClick={savePassword}
              disabled={pwdSaving}
              className={gradientButtonClass}
              style={{
                background: "linear-gradient(135deg, #92400e, #b45309)",
              }}
            >
              {pwdSaving ? (
                <>
                  <CircularProgress size={14} sx={{ color: "white" }} />
                  Updating...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
