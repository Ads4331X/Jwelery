import { Box, Grid } from "@mui/material";
import type { AdminAccount } from "../../utils/adminUser";

import SecuritySection from "./SecuritySection";
import AdminManagement from "./AdminManagement";
import DeleteAdminDialog from "./DeleteAdminDialog";

type Message = { type: "success" | "error"; text: string };

type Props = {
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  pwdMsg: Message | null;
  onUpdatePassword: () => void;

  displayName: string;
  setDisplayName: (v: string) => void;
  nameMsg: Message | null;
  onUpdateDisplayName: () => void;

  isSuperAdmin: boolean;

  admins: AdminAccount[];
  adminsLoaded: boolean;
  newAdminEmail: string;
  setNewAdminEmail: (v: string) => void;
  newAdminDisplayName: string;
  setNewAdminDisplayName: (v: string) => void;
  newAdminPwd: string;
  setNewAdminPwd: (v: string) => void;
  adminMgmtMsg: Message | null;
  onAddAdmin: () => void;
  onSetDeleteTarget: (admin: AdminAccount) => void;
  onPromote: (admin: AdminAccount) => void;

  deleteTarget: AdminAccount | null;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
};

export default function AdminSettingsPanels({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  pwdMsg,
  onUpdatePassword,
  displayName,
  setDisplayName,
  nameMsg,
  onUpdateDisplayName,
  isSuperAdmin,
  admins,
  adminsLoaded,
  newAdminEmail,
  setNewAdminEmail,
  newAdminDisplayName,
  setNewAdminDisplayName,
  newAdminPwd,
  setNewAdminPwd,
  adminMgmtMsg,
  onAddAdmin,
  onSetDeleteTarget,
  onPromote,
  deleteTarget,
  onCloseDelete,
  onConfirmDelete,
}: Props) {
  return (
    <Box className="flex flex-col gap-6">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <SecuritySection
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            pwdMsg={pwdMsg}
            onUpdatePassword={onUpdatePassword}
            displayName={displayName}
            setDisplayName={setDisplayName}
            nameMsg={nameMsg}
            onUpdateDisplayName={onUpdateDisplayName}
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
              onAddAdmin={onAddAdmin}
              onSetDeleteTarget={onSetDeleteTarget}
              onPromote={onPromote}
            />
          </Grid>
        )}
      </Grid>

      <DeleteAdminDialog
        open={!!deleteTarget}
        target={deleteTarget}
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete}
      />
    </Box>
  );
}
