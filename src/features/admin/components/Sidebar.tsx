import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  IconButton,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DiamondIcon from "@mui/icons-material/Diamond";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const items = [
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

function SidebarContent({ onClose }: { onClose?: () => void }) {
  return (
    <div className="h-full w-64 bg-white flex flex-col">
      <div className="p-5 border-b border-stone-100 flex items-center justify-between">
        <div>
          <p className="text-xs text-stone-400 uppercase tracking-widest">
            Admin Panel
          </p>
          <p className="text-base font-semibold text-stone-800 mt-0.5">
            Pashupatisunchadu
          </p>
        </div>
        {onClose && (
          <IconButton
            size="small"
            onClick={onClose}
            className="text-stone-400 md:hidden"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </div>

      <List component="nav" className="flex-1 px-2 py-3">
        {items.map((item) => (
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
                  className={`min-w-0 mr-3 ${isActive ? "text-white" : "text-stone-400"}`}
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
      <div className="p-4">
        <p className="text-xs text-stone-300 text-center">
          Jewellery Store v1.0
        </p>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <IconButton
        className="fixed top-3 left-3 z-50 bg-white shadow-sm md:hidden"
        onClick={() => setMobileOpen(true)}
        size="small"
      >
        <MenuIcon fontSize="small" />
      </IconButton>

      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        variant="temporary"
        ModalProps={{ keepMounted: true }}
        className="md:hidden"
        classes={{ paper: "w-64" }}
      >
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </Drawer>

      <div className="hidden md:block h-full shadow-sm border-r border-stone-100">
        <SidebarContent />
      </div>
    </>
  );
}
