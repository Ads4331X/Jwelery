import { useState, useEffect, useContext, useCallback } from "react";
import { Box } from "@mui/material";
import { AuthContext } from "../../auth/context/context";

import {
  listAdmins,
  createAdmin,
  deleteAdmin,
  type AdminAccount,
} from "../utils/adminUser";

import AdminSettingsHeader from "./settings/AdminSettingsHeader";
import AdminSettingsPanels from "./settings/AdminSettingsPanels";

type Message = { type: "success" | "error"; text: string };

export default function AdminSettings() {
  const auth = useContext(AuthContext);
  const isSuperAdmin = auth?.role === "super_admin";

  // Display name state
  const [displayName, setDisplayName] = useState(
    auth?.user?.user_metadata?.display_name ?? "",
  );
  const [nameMsg, setNameMsg] = useState<Message | null>(null);

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
  const handleUpdateDisplayName = async () => {
    setNameMsg(null);
    if (!displayName.trim()) {
      setNameMsg({ type: "error", text: "Display name cannot be empty." });
      return;
    }

    const { updateDisplayName } = await import("../utils/adminUser");
    const { error } = await updateDisplayName(displayName.trim());

    if (error) {
      setNameMsg({ type: "error", text: error });
    } else {
      setNameMsg({
        type: "success",
        text: "Display name updated successfully.",
      });
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
  // Promote admin to super_admin
  // -------------------------------------------------------------------------
  const handlePromote = async (admin: AdminAccount) => {
    const { updateAdminRole } = await import("../utils/adminUser");
    const { error } = await updateAdminRole(admin.id, "super_admin");
    if (error) {
      setAdminMgmtMsg({ type: "error", text: error });
    } else {
      setAdminMgmtMsg({
        type: "success",
        text: `${admin.display_name} is now a Super Admin. They must log out and log back in to access super admin features.`,
      });
      refreshAdmins();
    }
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
      <AdminSettingsHeader />

      <AdminSettingsPanels
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        pwdMsg={pwdMsg}
        onUpdatePassword={handleUpdatePassword}
        displayName={displayName}
        setDisplayName={setDisplayName}
        nameMsg={nameMsg}
        onUpdateDisplayName={handleUpdateDisplayName}
        isSuperAdmin={isSuperAdmin}
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
        onPromote={handlePromote}
        deleteTarget={deleteTarget}
        onCloseDelete={() => setDeleteTarget(null)}
        onConfirmDelete={handleDeleteConfirm}
      />
    </Box>
  );
}
