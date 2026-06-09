import { useState, useEffect, useContext, useCallback } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { AuthContext } from "../../auth/context/context";

import {
  listAdmins,
  createAdmin,
  deleteAdmin,
  type AdminAccount,
} from "../utils/adminUser";

import SecuritySection from "./settings/SecuritySection";
import AdminManagement from "./settings/AdminManagement";
import DeleteAdminDialog from "./settings/DeleteAdminDialog";

type Message = { type: "success" | "error"; text: string };

export default function AdminSettings() {
  const auth = useContext(AuthContext);
  const isSuperAdmin = auth?.role === "super_admin";

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState<Message | null>(null);

  // Admin management state
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [adminsLoaded, setAdminsLoaded] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminDisplayName, setNewAdminDisplayName] = useState("");
  const [newAdminPwd, setNewAdminPwd] = useState("");
  const [adminMgmtMsg, setAdminMgmtMsg] = useState<Message | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);

  // Stable refresh function — always fetches fresh from DB
  const refreshAdmins = useCallback(async () => {
    const list = await listAdmins();
    setAdmins(list);
    setAdminsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isSuperAdmin) return;
    void (async () => {
      await refreshAdmins();
    })();
  }, [isSuperAdmin, refreshAdmins]);

  // -------------------------------------------------------------------------
  // Password update
  // -------------------------------------------------------------------------
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
    const { updateOwnPassword } = await import("../utils/adminUser");
    const { error } = await updateOwnPassword(newPassword);
    if (error) {
      setPwdMsg({ type: "error", text: error });
    } else {
      setPwdMsg({ type: "success", text: "Password updated successfully." });
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  // -------------------------------------------------------------------------
  // Create admin
  // -------------------------------------------------------------------------
  const handleAddAdmin = async () => {
    setAdminMgmtMsg(null);

    if (!newAdminEmail.trim() || !newAdminDisplayName.trim() || !newAdminPwd) {
      setAdminMgmtMsg({ type: "error", text: "Please fill in all fields." });
      return;
    }
    if (!newAdminEmail.includes("@")) {
      setAdminMgmtMsg({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }
    if (newAdminPwd.length < 6) {
      setAdminMgmtMsg({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    const { error } = await createAdmin(
      newAdminEmail.trim(),
      newAdminPwd,
      newAdminDisplayName.trim(),
      "admin",
    );

    if (error) {
      setAdminMgmtMsg({ type: "error", text: error });
      return;
    }

    setAdminMgmtMsg({
      type: "success",
      text: `Admin account "${newAdminDisplayName}" created.`,
    });
    setNewAdminEmail("");
    setNewAdminDisplayName("");
    setNewAdminPwd("");

    // Wait briefly for session restore in createAdmin to fully settle,
    // then refresh the list
    setTimeout(() => refreshAdmins(), 500);
  };

  // -------------------------------------------------------------------------
  // Delete admin
  // -------------------------------------------------------------------------
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    const ok = await deleteAdmin(deleteTarget.id);
    if (ok) {
      setDeleteTarget(null);
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
          Manage your password and admin accounts.
        </Typography>
      </Box>

      <Grid container spacing={3}>
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

        {isSuperAdmin && (
          <Grid size={{ xs: 12 }}>
            <AdminManagement
              admins={admins}
              adminsLoaded={adminsLoaded}
              newAdminEmail={newAdminEmail}
              setNewAdminEmail={setNewAdminEmail}
              newAdminDisplayName={newAdminDisplayName}
              setNewAdminDisplayName={setNewAdminDisplayName}
              newAdminPwd={newAdminPwd}
              setNewAdminPwd={setNewAdminPwd}
              adminMgmtMsg={adminMgmtMsg}
              onAddAdmin={handleAddAdmin}
              onSetDeleteTarget={setDeleteTarget}
            />
          </Grid>
        )}
      </Grid>

      <DeleteAdminDialog
        open={!!deleteTarget}
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
}
