import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface Props {
  open: boolean;
  productName: string;
  deleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteProductDialog({
  open,
  productName,
  deleting,
  onConfirm,
  onClose,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          className: "rounded-2xl",
          sx: { maxWidth: 400, width: "100%" },
        },
      }}
    >
      <DialogTitle className="flex items-center gap-2 pb-2">
        <WarningAmberIcon className="text-amber-600" />
        <span className="font-semibold text-stone-800 text-base">
          Delete product?
        </span>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" className="text-stone-500">
          <strong className="text-stone-700">{productName}</strong> will be
          permanently removed. This cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions className="px-6 pb-4 gap-2">
        <Button
          onClick={onClose}
          disabled={deleting}
          variant="outlined"
          size="small"
          className="normal-case rounded-lg border-stone-200 text-stone-600"
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={deleting}
          variant="contained"
          disableElevation
          size="small"
          className="normal-case rounded-lg bg-red-600 hover:bg-red-700"
          sx={{
            backgroundColor: "#dc2626",
            "&:hover": { backgroundColor: "#b91c1c" },
          }}
        >
          {deleting ? (
            <CircularProgress size={16} className="text-white" />
          ) : (
            "Delete"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
