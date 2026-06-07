import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import AdminSettings from "./components/AdminSettings";
import Overview from "./components/Overview";
import AdminProducts from "./components/AdminProducts";
import AdminAnalytics from "./components/AdminAnalytics";

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
            <Route path="/analytics" element={<AdminAnalytics />} />
            <Route path="/settings" element={<AdminSettings />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}
