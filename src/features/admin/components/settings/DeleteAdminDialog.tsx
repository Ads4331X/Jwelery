import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import type { AdminAccount } from "../../utils/adminUser";

type Props = {
  open: boolean;
  target: AdminAccount | null;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteAdminDialog({
  open,
  target,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle className="text-stone-800 font-semibold">
        Delete Admin Account
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" className="text-stone-600">
          Are you sure you want to delete{" "}
          <strong>{target?.display_name ?? "this admin"}</strong>? This will
          permanently revoke their access.
        </Typography>
      </DialogContent>
      <DialogActions className="p-4">
        <Button onClick={onClose} className="normal-case text-stone-500">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          className="normal-case rounded-lg"
        >
          Delete Account
        </Button>
      </DialogActions>
    </Dialog>
  );
}
