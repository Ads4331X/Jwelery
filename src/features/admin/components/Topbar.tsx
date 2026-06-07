import { AppBar, Toolbar, Typography, Button, Avatar } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Derive display name from stored username metadata or email
  const displayName =
    user?.user_metadata?.username ?? user?.email?.split("@")[0] ?? "Admin";

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

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <Avatar className="w-7 h-7 text-xs bg-stone-800">
              {displayName[0].toUpperCase()}
            </Avatar>
            <Typography variant="body2" className="text-stone-600">
              {displayName}
            </Typography>
          </div>

          <Button
            onClick={handleLogout}
            size="small"
            startIcon={<LogoutIcon fontSize="small" />}
            className="normal-case text-stone-500 hover:text-stone-800 hover:bg-stone-100 text-sm"
          >
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
