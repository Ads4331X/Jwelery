import { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  Button,
  Alert,
  Typography,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";

import { AuthContext } from "../../../auth/context/context";
import {
  listAdmins,
  createAdmin,
  deleteAdmin,
  type AdminAccount,
} from "../../utils/adminUser";
import type { AdminRole } from "../../../auth/context/context";

import ToastProvider from "../ToastProvider";
import { useToast } from "../useToast";

import AdminManagement from "./AdminManagement";

type Message = { type: "success" | "error"; text: string };

function AdminSettingsInner() {
  const auth = useContext(AuthContext);
  const isSuperAdmin = auth?.role === "SUPER_ADMIN";
  const { showToast } = useToast();

  // ── Display name ─────────────────────────────────────────────────────────
  const [displayName, setDisplayName] = useState(auth?.user?.username ?? "");
  const [nameMsg, setNameMsg] = useState<Message | null>(null);

  // ── Password ─────────────────────────────────────────────────────────────
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState<Message | null>(null);

  // ── Admin management ─────────────────────────────────────────────────────
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [adminsLoaded, setAdminsLoaded] = useState(false);

  const refreshAdmins = useCallback(async () => {
    const list = await listAdmins();
    setAdmins(list);
    setAdminsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isSuperAdmin) return;
    void Promise.resolve().then(() => refreshAdmins());
  }, [isSuperAdmin, refreshAdmins]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleUpdateDisplayName = async () => {
    setNameMsg(null);
    if (!displayName.trim()) {
      setNameMsg({ type: "error", text: "Display name cannot be empty." });
      return;
    }
    const { updateDisplayName } = await import("../../utils/adminUser");
    const { error } = await updateDisplayName(displayName.trim());
    if (error) {
      setNameMsg({ type: "error", text: error });
      showToast(error, "error");
    } else {
      setNameMsg({
        type: "success",
        text: "Display name updated successfully.",
      });
      showToast("Display name updated.", "success");
    }
  };

  const handleUpdatePassword = async () => {
    setPwdMsg(null);
    if (!newPassword) {
      setPwdMsg({ type: "error", text: "Please enter a new password." });
      return;
    }
    if (newPassword.length < 6) {
      setPwdMsg({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: "error", text: "Passwords do not match." });
      return;
    }
    const { updateOwnPassword } = await import("../../utils/adminUser");
    const { error } = await updateOwnPassword(newPassword);
    if (error) {
      setPwdMsg({ type: "error", text: error });
      showToast(error, "error");
    } else {
      setPwdMsg({ type: "success", text: "Password updated successfully." });
      showToast("Password updated.", "success");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleAddAdmin = async (
    email: string,
    pwd: string,
    name: string,
    role: AdminRole,
  ): Promise<{ error?: string | null }> => {
    const result = await createAdmin(email, pwd, name, role);
    if (!result.error) {
      showToast(`Admin "${name}" created.`, "success");
      setTimeout(() => refreshAdmins(), 500);
    } else {
      // result.error may be null, but showToast expects a string; guard against null
      showToast(result.error ?? "An unknown error occurred.", "error");
    }
    return result;
  };

  const handlePromote = async (admin: AdminAccount, newRole: AdminRole) => {
    const { updateAdminRole } = await import("../../utils/adminUser");
    const { error } = await updateAdminRole(admin.id, newRole);
    if (error) {
      showToast(error, "error");
      throw new Error(error);
    }
    showToast(`${admin.display_name}'s role updated successfully.`, "success");
    await refreshAdmins();
  };

  const handleDelete = async (target: AdminAccount) => {
    const ok = await deleteAdmin(target.id);
    if (ok) {
      showToast(
        `${target.display_name}'s account has been deleted.`,
        "success",
      );
      refreshAdmins();
    } else {
      showToast("Failed to delete account. Please try again.", "error");
    }
  };

  return (
    <Box className="flex flex-col gap-6">
      {/* Header */}
      <Box>
        <Typography variant="h5" className="font-semibold text-stone-800 mb-1">
          Settings
        </Typography>
        <Typography variant="body2" className="text-stone-400">
          Manage your password and admin accounts.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Security Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={0} className="border border-stone-100 rounded-xl">
            <CardContent className="p-6">
              {/* Display Name */}
              <Box className="flex items-center gap-2 mb-4">
                <PersonIcon className="text-amber-700" />
                <Typography
                  variant="subtitle1"
                  className="font-semibold text-stone-800"
                >
                  Change Display Name
                </Typography>
              </Box>
              <Divider className="mb-4" />
              {nameMsg && (
                <Alert severity={nameMsg.type} className="mb-4 text-sm">
                  {nameMsg.text}
                </Alert>
              )}
              <Box className="flex flex-col gap-4 mb-8">
                <TextField
                  fullWidth
                  label="New Display Name"
                  size="small"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <Button
                  variant="contained"
                  disableElevation
                  onClick={handleUpdateDisplayName}
                  className="normal-case rounded-lg h-9 w-fit"
                  sx={{
                    backgroundColor: "#b45309",
                    "&:hover": { backgroundColor: "#92400e" },
                  }}
                >
                  Update Name
                </Button>
              </Box>

              {/* Password */}
              <Box className="flex items-center gap-2 mb-4">
                <SecurityIcon className="text-amber-700" />
                <Typography
                  variant="subtitle1"
                  className="font-semibold text-stone-800"
                >
                  Change Password
                </Typography>
              </Box>
              <Divider className="mb-4" />
              {pwdMsg && (
                <Alert severity={pwdMsg.type} className="mb-4 text-sm">
                  {pwdMsg.text}
                </Alert>
              )}
              <Box className="flex flex-col gap-4">
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  size="small"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm Password"
                  size="small"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  variant="contained"
                  disableElevation
                  onClick={handleUpdatePassword}
                  className="normal-case rounded-lg h-9 w-fit"
                  sx={{
                    backgroundColor: "#1c1917",
                    "&:hover": { backgroundColor: "#292524" },
                  }}
                >
                  Update Password
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Admin Management */}
        {isSuperAdmin && (
          <Grid size={{ xs: 12 }}>
            <AdminManagement
              admins={admins}
              adminsLoaded={adminsLoaded}
              onAddAdmin={handleAddAdmin}
              onDeleteAdmin={handleDelete}
              onPromote={handlePromote}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default function AdminSettings() {
  return (
    <ToastProvider>
      <AdminSettingsInner />
    </ToastProvider>
  );
}
