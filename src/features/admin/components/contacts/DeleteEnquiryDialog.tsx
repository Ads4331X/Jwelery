import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

export function DeleteEnquiryDialog({
  open,
  onClose,
  onConfirm,
  deleting,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (!deleting) onClose();
      }}
      slotProps={{
        paper: { className: "rounded-2xl", sx: { maxWidth: 360 } },
      }}
    >
      <DialogTitle className="font-semibold text-stone-800 text-base pb-1">
        Delete enquiry?
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" className="text-stone-500">
          This will permanently remove the enquiry from your dashboard.
        </Typography>
        {deleting && (
          <Alert severity="info" className="mt-3 rounded-xl" variant="outlined">
            Deleting…
          </Alert>
        )}
      </DialogContent>
      <DialogActions className="px-6 pb-4 gap-2">
        <Button
          onClick={onClose}
          variant="outlined"
          size="small"
          className="normal-case rounded-lg border-stone-200 text-stone-600"
          disabled={deleting}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          disableElevation
          size="small"
          className="normal-case rounded-lg"
          disabled={deleting}
          sx={{
            backgroundColor: "#dc2626",
            "&:hover": { backgroundColor: "#b91c1c" },
          }}
        >
          {deleting ? <CircularProgress size={16} sx={{ color: "white" }} /> : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

