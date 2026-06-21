import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Chip,
  Box,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useContext } from "react";
import { AuthContext } from "../../../../features/auth/context/context";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth?.logout();
    navigate("/login");
  };

  const displayName =
    auth?.user?.username ??
    auth?.user?.email?.split("@")[0] ??
    "Admin";

  const isSuperAdmin = auth?.role === "SUPER_ADMIN";

  return (
    <AppBar
      position="static"
      elevation={0}
      className="bg-white border-b border-stone-100"
    >
      <Toolbar className="flex justify-between min-h-14 pl-14 md:pl-4">
        <Typography
          variant="subtitle1"
          className="font-semibold text-stone-800"
        >
          Dashboard
        </Typography>

        <Box className="flex items-center gap-3">
          <Box className="hidden sm:flex items-center gap-2">
            <Avatar className="w-7 h-7 text-xs bg-stone-800">
              {displayName[0].toUpperCase()}
            </Avatar>
            <Typography variant="body2" className="text-stone-600">
              {displayName}
            </Typography>
            {isSuperAdmin && (
              <Chip
                label="Super Admin"
                size="small"
                className="text-xs bg-amber-100 text-amber-800 border-0 h-5"
              />
            )}
          </Box>

          <Button
            onClick={handleLogout}
            size="small"
            startIcon={<LogoutIcon fontSize="small" />}
            className="normal-case text-stone-500 hover:text-stone-800 hover:bg-stone-100 text-sm"
          >
            <Box component={"span"} className="hidden sm:inline">
              Logout
            </Box>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
