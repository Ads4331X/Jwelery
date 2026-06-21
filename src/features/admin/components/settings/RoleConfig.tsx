import type { ReactNode } from "react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import type { AdminRole } from "../../../auth/context/context";

export const ROLE_LABEL: Record<AdminRole, string> = {
  DELIVERY_STAFF: "Delivery Staff",
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
};

export const ROLE_OPTIONS: { value: AdminRole; label: string }[] = [
  { value: "DELIVERY_STAFF", label: "Delivery Staff" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

export const ROLE_CHIP_SX: Record<AdminRole, object> = {
  SUPER_ADMIN: {
    backgroundColor: "#fffbeb",
    color: "#92400e",
    border: "1px solid #fde68a",
  },
  ADMIN: {
    backgroundColor: "#f5f5f4",
    color: "#57534e",
    border: "1px solid #e7e5e4",
  },
  DELIVERY_STAFF: {
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
  },
};

export const ROLE_CONFIG: Record<AdminRole, { label: string; sx: object }> = {
  SUPER_ADMIN: { label: "Super Admin", sx: ROLE_CHIP_SX.SUPER_ADMIN },
  ADMIN: { label: "Admin", sx: ROLE_CHIP_SX.ADMIN },
  DELIVERY_STAFF: { label: "Delivery Staff", sx: ROLE_CHIP_SX.DELIVERY_STAFF },
};

const SM = { fontSize: 15 } as const;
const MD = { fontSize: 16 } as const;

export const ROLE_ICONS_SM: Record<AdminRole, ReactNode> = {
  DELIVERY_STAFF: <LocalShippingIcon sx={SM} />,
  ADMIN: <AdminPanelSettingsIcon sx={SM} />,
  SUPER_ADMIN: <SupervisorAccountIcon sx={SM} />,
};

export const ROLE_ICONS_MD: Record<AdminRole, ReactNode> = {
  DELIVERY_STAFF: <LocalShippingIcon sx={MD} />,
  ADMIN: <AdminPanelSettingsIcon sx={MD} />,
  SUPER_ADMIN: <SupervisorAccountIcon sx={MD} />,
};

export const ROLE_TOGGLE_SX = {
  "& .MuiToggleButton-root": {
    textTransform: "none" as const,
    fontSize: "0.72rem",
    fontWeight: 500,
    color: "#78716c",
    borderColor: "#e7e5e4",
    flexDirection: "column" as const,
    gap: "4px",
    py: 1.2,
  },
  "& .MuiToggleButton-root.Mui-selected": {
    backgroundColor: "#fffbeb",
    color: "#92400e",
    borderColor: "#fcd34d",
    fontWeight: 600,
  },
};
