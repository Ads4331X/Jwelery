import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import { updateAdminPassword } from "./utils/adminUser";
import { useState } from "react";

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card elevation={0} className="border border-stone-100 rounded-xl">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-stone-100 text-stone-600">
          {icon}
        </div>
        <div>
          <Typography
            variant="caption"
            className="text-stone-400 uppercase tracking-wide"
          >
            {title}
          </Typography>
          <Typography
            variant="h6"
            className="font-semibold text-stone-800 leading-tight"
          >
            {value}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [newPwd, setNewPwd] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handlePasswordUpdate = async () => {
    if (!newPwd) {
      setPwdMsg({ type: "error", text: "Please enter a new password." });
      return;
    }
    if (newPwd.length < 6) {
      setPwdMsg({ type: "error", text: "Minimum 6 characters." });
      return;
    }
    const ok = await updateAdminPassword(newPwd);
    setPwdMsg(
      ok
        ? { type: "success", text: "Password updated successfully." }
        : { type: "error", text: "Failed to update password." },
    );
    if (ok) setNewPwd("");
  };

  return (
    <Box className="flex h-screen bg-stone-50">
      <Sidebar />

      <Box className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <Box className="flex-1 overflow-y-auto p-4 md:p-6">
          <Typography
            variant="h5"
            className="font-semibold text-stone-800 mb-1"
          >
            Overview
          </Typography>
          <Typography variant="body2" className="text-stone-400 mb-6">
            Welcome back to your jewellery store admin panel.
          </Typography>

          <Grid container spacing={2} className="mb-6">
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Products"
                value="248"
                icon={<DiamondOutlinedIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Orders"
                value="64"
                icon={<ShoppingBagOutlinedIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Revenue"
                value="Rs. 1.2L"
                icon={<AttachMoneyIcon fontSize="small" />}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatCard
                title="Customers"
                value="312"
                icon={<PeopleIcon fontSize="small" />}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2} className="mb-6">
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                className="border border-stone-100 rounded-xl h-56"
              >
                <CardContent className="p-5 h-full flex flex-col">
                  <Typography
                    variant="subtitle2"
                    className="text-stone-700 font-semibold mb-3"
                  >
                    Sales Chart
                  </Typography>
                  <div className="flex-1 rounded-lg bg-stone-50 flex items-center justify-center">
                    <Typography variant="body2" className="text-stone-300">
                      Chart coming soon
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                elevation={0}
                className="border border-stone-100 rounded-xl h-56"
              >
                <CardContent className="p-5 h-full flex flex-col">
                  <Typography
                    variant="subtitle2"
                    className="text-stone-700 font-semibold mb-3"
                  >
                    Recent Orders
                  </Typography>
                  <div className="flex-1 rounded-lg bg-stone-50 flex items-center justify-center">
                    <Typography variant="body2" className="text-stone-300">
                      No orders yet
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card elevation={0} className="border border-stone-100 rounded-xl">
            <CardContent className="p-5">
              <Typography
                variant="subtitle2"
                className="text-stone-700 font-semibold mb-1"
              >
                Change Password
              </Typography>
              <Typography
                variant="caption"
                className="text-stone-400 block mb-4"
              >
                Update your admin account password
              </Typography>

              {pwdMsg && (
                <Alert severity={pwdMsg.type} className="mb-4 text-sm">
                  {pwdMsg.text}
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <TextField
                  label="New Password"
                  type="password"
                  variant="outlined"
                  size="small"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  className="w-full sm:w-72"
                />
                <Button
                  variant="contained"
                  disableElevation
                  onClick={handlePasswordUpdate}
                  className="normal-case bg-stone-800 hover:bg-stone-700 rounded-lg h-9 text-sm"
                >
                  Update Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
