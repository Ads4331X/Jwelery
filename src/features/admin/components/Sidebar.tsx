import { Box } from "@mui/material";
import MobileSidebarDrawer from "./MobileSidebarDrawer";
import SidebarContent from "./SidebarContent";

export default function Sidebar() {
  return (
    <>
      <MobileSidebarDrawer />

      <Box className="hidden md:block h-full shadow-sm border-r border-stone-100">
        <SidebarContent />
      </Box>
    </>
  );
}
