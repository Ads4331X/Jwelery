import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import type { AdminAccount } from "../../utils/adminUser";
import type { AdminRole } from "../../utils/adminUser";
import DialogShell from "./DialogShell";
import PromoteDialog from "./PromoteDialog";
import AdminCreateForm from "./AdminCreateForm";
import AdminCard from "./AdminCard";
import AdminTable from "./AdminTable";

type Props = {
  admins: AdminAccount[];
  adminsLoaded: boolean;
  onAddAdmin: (
    email: string,
    pwd: string,
    name: string,
    role: AdminRole,
  ) => Promise<{ error?: string | null }>;
  onDeleteAdmin: (admin: AdminAccount) => void;
  onPromote: (admin: AdminAccount, newRole: AdminRole) => Promise<void>;
};

export default function AdminManagement({
  admins,
  adminsLoaded,
  onAddAdmin,
  onDeleteAdmin,
  onPromote,
}: Props) {
  const [promoteTarget, setPromoteTarget] = useState<AdminAccount | null>(null);
  const [superAdminInfo, setSuperAdminInfo] = useState<AdminAccount | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);

  const handlePromoteConfirm = async (newRole: AdminRole) => {
    if (!promoteTarget) return;
    setPromoteTarget(null);
    try {
      await onPromote(promoteTarget, newRole);
      if (newRole === "SUPER_ADMIN")
        setSuperAdminInfo({ ...promoteTarget, role: newRole });
    } catch {
      // Error toast handled by parent
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDeleteAdmin(deleteTarget);
      setDeleteTarget(null);
    }
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
            sx={{
              fontSize: "0.68rem",
              height: 20,
              backgroundColor: "#fffbeb",
              color: "#92400e",
              border: "1px solid #fde68a",
              ml: 1,
            }}
          />
        </Box>
        <Divider className="mb-6" />

        <Box className="grid gap-8">
          <AdminCreateForm onAdd={onAddAdmin} />

          <Box>
            <Typography
              variant="subtitle2"
              className="text-stone-700 font-semibold mb-3"
            >
              Admin Accounts
            </Typography>
            {!adminsLoaded ? (
              <Box className="flex justify-center py-6">
                <CircularProgress size={24} className="text-stone-400" />
              </Box>
            ) : admins.length === 0 ? (
              <Typography
                variant="body2"
                className="text-stone-400 py-4 text-center"
              >
                No admin accounts found.
              </Typography>
            ) : (
              <>
                <Box className="flex flex-col gap-3 md:hidden">
                  {admins.map((adm) => (
                    <AdminCard
                      key={adm.id}
                      adm={adm}
                      onDelete={setDeleteTarget}
                      onPromote={setPromoteTarget}
                    />
                  ))}
                </Box>
                <AdminTable
                  admins={admins}
                  onDelete={setDeleteTarget}
                  onPromote={setPromoteTarget}
                />
              </>
            )}
          </Box>
        </Box>
      </CardContent>

      <PromoteDialog
        open={!!promoteTarget}
        target={promoteTarget}
        onClose={() => setPromoteTarget(null)}
        onConfirm={handlePromoteConfirm}
      />
      <PromoteDialog
        open={!!superAdminInfo}
        target={superAdminInfo}
        onClose={() => setSuperAdminInfo(null)}
        mode="info"
      />

      <DialogShell
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Admin Account"
        actions={[
          { label: "Cancel", onClick: () => setDeleteTarget(null) },
          {
            label: "Delete Account",
            onClick: handleDeleteConfirm,
            variant: "contained",
            sx: {
              backgroundColor: "#dc2626",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#b91c1c" },
            },
          },
        ]}
      >
        <Typography variant="body2" className="text-stone-600">
          Are you sure you want to delete{" "}
          <strong>{deleteTarget?.display_name ?? "this admin"}</strong>? This
          will permanently revoke their access.
        </Typography>
      </DialogShell>
    </Card>
  );
}
