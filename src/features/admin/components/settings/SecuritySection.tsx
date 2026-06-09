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

type Props = {
  newPassword: string;
  setNewPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  pwdMsg: { type: "success" | "error"; text: string } | null;
  onUpdatePassword: () => void;
};

export default function SecuritySection({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  pwdMsg,
  onUpdatePassword,
}: Props) {
  return (
    <Card elevation={0} className="border border-stone-100 rounded-xl">
      <CardContent className="p-6">
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
