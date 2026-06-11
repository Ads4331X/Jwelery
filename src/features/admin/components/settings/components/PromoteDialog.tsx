import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { AdminAccount } from "../../../utils/adminUser";

type Props = {
  open: boolean;
  target: AdminAccount | null;
  onClose: () => void;
  onConfirm: () => void;
};

export default function PromoteDialog({
  open,
  target,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { className: "rounded-2xl" } }}
    >
      <DialogTitle className="font-semibold text-stone-800 text-base">
        Promote to Super Admin?
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" className="text-stone-500">
          <strong className="text-stone-700">{target?.display_name}</strong>{" "}
          will become a Super Admin and gain full access including creating and
          deleting admins. They must log out and log back in for changes to take
          effect.
        </Typography>
      </DialogContent>
      <DialogActions className="px-6 pb-4 gap-2">
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          className="normal-case rounded-lg border-stone-200 text-stone-600"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disableElevation
          size="small"
          sx={{
            backgroundColor: "#b45309",
            "&:hover": { backgroundColor: "#92400e" },
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          Yes, Promote
        </Button>
      </DialogActions>
    </Dialog>
  );
}
