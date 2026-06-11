import { Box, Typography } from "@mui/material";

export default function AdminSettingsHeader() {
  return (
    <Box>
      <Typography variant="h5" className="font-semibold text-stone-800 mb-1">
        Settings
      </Typography>
      <Typography variant="body2" className="text-stone-400">
        Manage your password and admin accounts.
      </Typography>
    </Box>
  );
}
