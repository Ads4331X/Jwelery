import { useState } from "react";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SidebarContent from "./SidebarContent";

export default function MobileSidebarDrawer() {
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
    </>
  );
}
