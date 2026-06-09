import { NavLink } from "react-router-dom";
import {
  Box,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import type { ReactNode } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DiamondIcon from "@mui/icons-material/Diamond";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";

const navItems: Array<{ name: string; to: string; icon: ReactNode }> = [
  { name: "Dashboard", to: "/admin", icon: <DashboardIcon fontSize="small" /> },
  {
    name: "Products",
    to: "/admin/products",
    icon: <DiamondIcon fontSize="small" />,
  },
  {
    name: "Analytics",
    to: "/admin/analytics",
    icon: <BarChartIcon fontSize="small" />,
  },
  {
    name: "Settings",
    to: "/admin/settings",
    icon: <SettingsIcon fontSize="small" />,
  },
];

export default function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <Box className="h-full w-64 bg-white flex flex-col">
      <Box className="p-5 border-b border-stone-100 flex items-center justify-between">
        <Box>
          <Typography className="text-xs text-stone-400 uppercase tracking-widest">
            Admin Panel
          </Typography>
          <Typography className="text-base font-semibold text-stone-800 mt-0.5">
            Pashupatisunchadi
          </Typography>
        </Box>

        {onClose && (
          <IconButton
            size="small"
            onClick={onClose}
            className="text-stone-400 md:hidden"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      <List component="nav" className="flex-1 px-2 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            end={item.to === "/admin"}
            onClick={onClose}
            className="no-underline"
          >
            {({ isActive }) => (
              <ListItemButton
                className={`rounded-lg mb-1 ${
                  isActive
                    ? "bg-stone-800 text-white"
                    : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                <ListItemIcon
                  className={`min-w-0 mr-3 ${
                    isActive ? "text-white" : "text-stone-400"
                  }`}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  slotProps={{
                    primary: {
                      style: {
                        fontSize: 14,
                        fontWeight: isActive ? 600 : 400,
                      },
                    },
                  }}
                />
              </ListItemButton>
            )}
          </NavLink>
        ))}
      </List>

      <Divider className="border-stone-100" />

      <Box className="p-4">
        <Typography className="text-xs text-stone-300 text-center">
          Jewellery Store v1.0
        </Typography>
      </Box>
    </Box>
  );
}
