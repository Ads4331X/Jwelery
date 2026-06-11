import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { useState } from "react";
import type { AdminAccount } from "../../utils/adminUser";

import AdminCreatePanel from "./components/AdminCreatePanel";
import AdminListPanel from "./components/AdminListPanel";
import PromoteDialog from "./components/PromoteDialog";

type Props = {
  admins: AdminAccount[];
  adminsLoaded: boolean;
  newAdminEmail: string;
  setNewAdminEmail: (v: string) => void;
  newAdminDisplayName: string;
  setNewAdminDisplayName: (v: string) => void;
  newAdminPwd: string;
  setNewAdminPwd: (v: string) => void;
  adminMgmtMsg: { type: "success" | "error"; text: string } | null;
  onAddAdmin: () => void;
  onSetDeleteTarget: (admin: AdminAccount) => void;
  onPromote: (admin: AdminAccount) => void;
};

// ── Main component ───────────────────────────────────────────────────────────
export default function AdminManagement({
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
}: Props) {
  const [promoteTarget, setPromoteTarget] = useState<AdminAccount | null>(null);

  const handlePromoteConfirm = () => {
    if (!promoteTarget) return;
    onPromote(promoteTarget);
    setPromoteTarget(null);
  };

  return (
    <Card elevation={0} className="border border-stone-100 rounded-xl">
      <CardContent className="p-6">
        <Box className="flex items-center gap-2 mb-4">
          <GroupAddIcon className="text-amber-700" />
          <Typography
            variant="subtitle1"
            className="font-semibold text-stone-800"
          >
            Admin Management
          </Typography>
          <Chip
            label="Super Admin Only"
            size="small"
            className="text-xs bg-amber-50 text-amber-700 border border-amber-200 ml-1"
          />
        </Box>
        <Divider className="mb-6" />

        {adminMgmtMsg && (
          <Alert severity={adminMgmtMsg.type} className="mb-6 text-sm">
            {adminMgmtMsg.text}
          </Alert>
        )}

        <Box className="grid gap-8">
          <AdminCreatePanel
            newAdminEmail={newAdminEmail}
            setNewAdminEmail={setNewAdminEmail}
            newAdminDisplayName={newAdminDisplayName}
            setNewAdminDisplayName={setNewAdminDisplayName}
            newAdminPwd={newAdminPwd}
            setNewAdminPwd={setNewAdminPwd}
            onAddAdmin={onAddAdmin}
          />

          <AdminListPanel
            admins={admins}
            adminsLoaded={adminsLoaded}
            onSetDeleteTarget={onSetDeleteTarget}
            onSetPromoteTarget={setPromoteTarget}
          />
        </Box>
      </CardContent>

      <PromoteDialog
        open={!!promoteTarget}
        target={promoteTarget}
        onClose={() => setPromoteTarget(null)}
        onConfirm={handlePromoteConfirm}
      />
    </Card>
  );
}
