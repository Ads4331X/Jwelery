import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import AdminSettings from "./components/AdminSettings";
import Overview from "./components/overview/Overview";
import AdminProducts from "./components/products/AdminProducts";
import AdminMetalRates from "./components/AdminMetalRates";

export default function Dashboard() {
  return (
    <Box className="flex h-screen w-screen overflow-hidden bg-stone-50">
      <Sidebar />

      <Box className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <Box className="flex-1 overflow-y-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/products" element={<AdminProducts />} />
            <Route path="/metal-rates" element={<AdminMetalRates />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}
