import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { AdminAccount } from "../../utils/adminUser";
import RoleChip from "./RoleChip";

type Props = {
  adm: AdminAccount;
  onDelete: (a: AdminAccount) => void;
  onPromote: (a: AdminAccount) => void;
};

export default function AdminCard({ adm, onDelete, onPromote }: Props) {
  const isSuperAdmin = adm.role === "SUPER_ADMIN";

  return (
    <Box className="flex items-start justify-between gap-3 p-4 rounded-xl border border-stone-100 bg-white">
      <Box className="flex flex-col gap-1.5 min-w-0">
        <Typography variant="body2" className="font-semibold text-stone-800">
          {adm.display_name}
        </Typography>
        <Typography variant="caption" className="text-stone-400 break-all">
          {adm.email}
        </Typography>
        <RoleChip adm={adm} onPromote={onPromote} />
        <Typography variant="caption" className="text-stone-300">
          {new Date(adm.created_at).toLocaleDateString()}
        </Typography>
      </Box>
      {!isSuperAdmin && (
        <Tooltip title="Delete account">
          <IconButton size="small" color="error" onClick={() => onDelete(adm)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
}
