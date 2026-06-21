import { Chip, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { AdminAccount } from "../../utils/adminUser";
import { ROLE_CONFIG } from "./RoleConfig";

type Props = { adm: AdminAccount; onPromote?: (a: AdminAccount) => void };

export default function RoleChip({ adm, onPromote }: Props) {
  const isSuperAdmin = adm.role === "SUPER_ADMIN";
  const role = ROLE_CONFIG[adm.role] ?? ROLE_CONFIG.ADMIN;

  return (
    <Tooltip title={isSuperAdmin ? "" : "Change role"} placement="top">
      <Chip
        label={role.label}
        size="small"
        onClick={isSuperAdmin || !onPromote ? undefined : () => onPromote(adm)}
        icon={
          !isSuperAdmin ? (
            <EditIcon sx={{ fontSize: "11px !important" }} />
          ) : undefined
        }
        sx={{
          fontSize: "0.68rem",
          height: 22,
          cursor: isSuperAdmin ? "default" : "pointer",
          ...role.sx,
          ...(isSuperAdmin ? {} : { "&:hover": { opacity: 0.8 } }),
        }}
      />
    </Tooltip>
  );
}
