import { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
// Icons are used in subcomponents; no direct usage here.
import { useAuth } from "../../../hooks/useAuth";
import {
  updateAdminUsername,
  updateAdminPassword,
  listAdmins,
  createAdmin,
  deleteAdminAccount,
  resetAdminAccount,
  isSuperAdmin,
  type AdminAccount,
} from "../utils/adminUser";

// New component imports
import ProfileSection from "./AdminSettingsTabs/ProfileSection";
import SecuritySection from "./AdminSettingsTabs/SecuritySection";
import AdminManagement from "./AdminSettingsTabs/AdminManagement";
import DeleteAdminDialog from "./AdminSettingsTabs/DeleteAdminDialog";
import ResetAdminDialog from "./AdminSettingsTabs/ResetAdminDialog";

// Reusable message type for success/error feedback
type Message = {
  type: "success" | "error";
  text: string;
};

export default function AdminSettings() {
  const { user } = useAuth();
  const superAdmin = isSuperAdmin(user);

  // Profile fields
  const [username, setUsername] = useState(
    user?.user_metadata?.username ?? user?.email?.split("@")[0] ?? "",
  );
  const [profileMsg, setProfileMsg] = useState<Message | null>(null);

  // Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState<Message | null>(null);

  // Admin Management state
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [newAdminUser, setNewAdminUser] = useState("");
  const [newAdminPwd, setNewAdminPwd] = useState("");
  const [adminMgmtMsg, setAdminMgmtMsg] = useState<Message | null>(null);

  // Destructive Actions state
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);
  const [resetTarget, setResetTarget] = useState<AdminAccount | null>(null);
  const [tempPassword, setTempPassword] = useState("");
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  // Function to refresh admin list for manual calls
  const refreshAdmins = async () => {
    if (!superAdmin) return;
    setAdmins(await listAdmins());
  };

  // Load admins on mount or when superAdmin changes without triggering sync setState warning
  useEffect(() => {
    if (!superAdmin) return;
    (async () => {
      const list = await listAdmins();
      setAdmins(list);
    })();
  }, [superAdmin]);

  // Profile Update handler
  const handleUpdateUsername = async () => {
    setProfileMsg(null);
    if (!username.trim()) {
      setProfileMsg({ type: "error", text: "Username cannot be empty." });
      return;
    }
    const ok = await updateAdminUsername(username.trim(), user?.id ?? "");
    if (ok) {
      setProfileMsg({
        type: "success",
        text: "Username updated successfully. Changes will apply on reload.",
      });
    } else {
      setProfileMsg({ type: "error", text: "Failed to update username." });
    }
  };

  // Password Update handler
  const handleUpdatePassword = async () => {
    setPwdMsg(null);
    if (!newPassword) {
      setPwdMsg({ type: "error", text: "Please enter a new password." });
      return;
    }
    if (newPassword.length < 6) {
      setPwdMsg({
        type: "error",
        text: "Password must be at least 6 characters long.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: "error", text: "Passwords do not match." });
      return;
    }

    const currentUsername =
      user?.user_metadata?.username ?? user?.email?.split("@")[0] ?? "";
    const ok = await updateAdminPassword(newPassword, currentUsername);
    if (ok) {
      setPwdMsg({ type: "success", text: "Password updated successfully." });
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPwdMsg({ type: "error", text: "Failed to update password." });
    }
  };

  // Add Admin handler
  const handleAddAdmin = async () => {
    setAdminMgmtMsg(null);
    if (!newAdminUser.trim() || !newAdminPwd) {
      setAdminMgmtMsg({ type: "error", text: "Please fill all fields." });
      return;
    }
    if (newAdminPwd.length < 6) {
      setAdminMgmtMsg({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    const { error } = await createAdmin(newAdminUser.trim(), newAdminPwd);
    if (error) {
      setAdminMgmtMsg({ type: "error", text: error });
    } else {
      setAdminMgmtMsg({
        type: "success",
        text: `Admin account "${newAdminUser}" created.`,
      });
      setNewAdminUser("");
      setNewAdminPwd("");
      refreshAdmins();
    }
  };

  // Delete Admin handler
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const ok = await deleteAdminAccount(deleteTarget.id, deleteTarget.username);
    if (ok) {
      setDeleteTarget(null);
      refreshAdmins();
    }
  };

  // Reset Admin Password handler
  const handleResetConfirm = async () => {
    if (!resetTarget || !tempPassword) return;
    if (tempPassword.length < 6) {
      setResetMsg("Password must be at least 6 characters.");
      return;
    }
    const ok = await resetAdminAccount(resetTarget.username, tempPassword);
    if (ok) {
      setResetTarget(null);
      setTempPassword("");
      setResetMsg(null);
      setAdminMgmtMsg({
        type: "success",
        text: `Successfully reset credentials for "${resetTarget.username}".`,
      });
      refreshAdmins();
    }
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h5" className="font-semibold text-stone-800 mb-1">
          Settings
        </Typography>
        <Typography variant="body2" className="text-stone-400">
          Manage your account profile, password, and administrative users.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ProfileSection
            username={username}
            setUsername={setUsername}
            profileMsg={profileMsg}
            onUpdateUsername={handleUpdateUsername}
          />
        </Grid>

        {/* Security Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SecuritySection
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            pwdMsg={pwdMsg}
            onUpdatePassword={handleUpdatePassword}
          />
        </Grid>

        {/* Super Admin Management section */}
        {superAdmin && (
          <Grid size={{ xs: 12 }}>
            <AdminManagement
              admins={admins}
              newAdminUser={newAdminUser}
              setNewAdminUser={setNewAdminUser}
              newAdminPwd={newAdminPwd}
              setNewAdminPwd={setNewAdminPwd}
              adminMgmtMsg={adminMgmtMsg}
              onAddAdmin={handleAddAdmin}
              onSetDeleteTarget={setDeleteTarget}
              onSetResetTarget={setResetTarget}
            />
          </Grid>
        )}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <DeleteAdminDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Reset Password Dialog */}
      <ResetAdminDialog
        open={!!resetTarget}
        onClose={() => {
          setResetTarget(null);
          setResetMsg(null);
          setTempPassword("");
        }}
        onConfirm={handleResetConfirm}
        resetMsg={resetMsg}
        tempPassword={tempPassword}
        setTempPassword={setTempPassword}
        setResetMsg={setResetMsg}
      />
    </Box>
  );
}
