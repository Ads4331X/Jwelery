import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import type { AdminAccount } from "../../../utils/adminUser";

type Props = {
  adm: AdminAccount;
  onDelete: (adm: AdminAccount) => void;
  onPromote: (adm: AdminAccount) => void;
};

export default function AdminCard({ adm, onDelete, onPromote }: Props) {
  const isSuperAdmin = adm.role === "super_admin";

  return (
    <Box className="flex items-start justify-between gap-3 p-4 rounded-xl border border-stone-100 bg-white">
      <Box className="flex flex-col gap-1 min-w-0">
        <Box className="flex items-center gap-2 flex-wrap">
          <Typography variant="body2" className="font-semibold text-stone-800">
            {adm.display_name}
          </Typography>
          <Chip
            label={isSuperAdmin ? "Super Admin" : "Admin"}
            size="small"
            className={
              isSuperAdmin
                ? "text-xs bg-amber-50 text-amber-700 border border-amber-200"
                : "text-xs bg-stone-50 text-stone-500 border border-stone-200"
            }
          />
        </Box>
        <Typography variant="caption" className="text-stone-400 break-all">
          {adm.email}
        </Typography>
        <Typography variant="caption" className="text-stone-300">
          {new Date(adm.created_at).toLocaleDateString()}
        </Typography>
      </Box>

      {!isSuperAdmin && (
        <Box className="flex items-center gap-1 shrink-0">
          <Tooltip title="Promote to Super Admin">
            <IconButton size="small" onClick={() => onPromote(adm)}>
              <StarIcon fontSize="small" sx={{ color: "#b45309" }} />
            </IconButton>
          </Tooltip>
          <IconButton size="small" color="error" onClick={() => onDelete(adm)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
