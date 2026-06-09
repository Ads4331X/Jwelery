import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  TextField,
} from "@mui/material";
import type { ChangeEvent } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  resetMsg: string | null;
  tempPassword: string;
  setTempPassword: (value: string) => void;
  setResetMsg: (msg: string | null) => void;
};

export default function ResetAdminDialog({
  open,
  onClose,
  onConfirm,
  resetMsg,
  tempPassword,
  setTempPassword,
  setResetMsg,
}: Props) {
  const handleClose = () => {
    setResetMsg(null);
    onClose();
  };

  const handleConfirm = () => {
    setResetMsg(null);
    onConfirm();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className="text-stone-800 font-semibold">
        Reset Credentials
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" className="text-stone-600 mb-4">
          Reset the password for admin. The admin can log in with this temporary
          password.
        </Typography>
        {resetMsg && (
          <Alert severity="error" className="mb-4 text-xs">
            {resetMsg}
          </Alert>
        )}
        <TextField
          autoFocus
          fullWidth
          type="password"
          label="Temporary Password"
          size="small"
          value={tempPassword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setTempPassword(e.target.value)
          }
        />
      </DialogContent>
      <DialogActions className="p-4">
        <Button onClick={handleClose} className="normal-case text-stone-500">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          className="normal-case bg-stone-800 hover:bg-stone-700 text-white rounded-lg"
        >
          Reset Credentials
        </Button>
      </DialogActions>
    </Dialog>
  );
}
