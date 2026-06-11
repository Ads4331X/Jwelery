import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";

import PersonIcon from "@mui/icons-material/Person";

type Props = {
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  pwdMsg: { type: "success" | "error"; text: string } | null;
  onUpdatePassword: () => void;

  displayName: string;
  setDisplayName: (value: string) => void;
  nameMsg: { type: "success" | "error"; text: string } | null;
  onUpdateDisplayName: () => void;
};

export default function SecuritySection({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  pwdMsg,
  onUpdatePassword,
  displayName,
  setDisplayName,
  nameMsg,
  onUpdateDisplayName,
}: Props) {
  return (
    <Card elevation={0} className="border border-stone-100 rounded-xl">
      <CardContent className="p-6">
        {/* Change Display Name */}
        <Box className="flex items-center gap-2 mb-4">
          <PersonIcon className="text-amber-700" />
          <Typography
            variant="subtitle1"
            className="font-semibold text-stone-800"
          >
            Change Display Name
          </Typography>
        </Box>
        <Divider className="mb-4" />

        {nameMsg && (
          <Alert severity={nameMsg.type} className="mb-4 text-sm">
            {nameMsg.text}
          </Alert>
        )}

        <Box className="flex flex-col gap-4 mb-8">
          <TextField
            fullWidth
            label="New Display Name"
            size="small"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Button
            variant="contained"
            disableElevation
            onClick={onUpdateDisplayName}
            className="normal-case bg-stone-800 hover:bg-stone-700 rounded-lg h-9 w-fit"
            sx={{
              backgroundColor: "#b45309",
              "&:hover": { backgroundColor: "#92400e" },
            }}
          >
            Update Name
          </Button>
        </Box>

        {/* Change Password */}
        <Box className="flex items-center gap-2 mb-4">
          <SecurityIcon className="text-amber-700" />
          <Typography
            variant="subtitle1"
            className="font-semibold text-stone-800"
          >
            Change Password
          </Typography>
        </Box>
        <Divider className="mb-4" />

        {pwdMsg && (
          <Alert severity={pwdMsg.type} className="mb-4 text-sm">
            {pwdMsg.text}
          </Alert>
        )}

        <Box className="flex flex-col gap-4">
          <TextField
            fullWidth
            type="password"
            label="New Password"
            size="small"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            size="small"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            variant="contained"
            disableElevation
            onClick={onUpdatePassword}
            className="normal-case bg-stone-800 hover:bg-stone-700 rounded-lg h-9 w-fit"
          >
            Update Password
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
