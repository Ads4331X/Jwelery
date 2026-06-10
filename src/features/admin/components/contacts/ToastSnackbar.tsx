import { Alert, Snackbar } from "@mui/material";

export function ToastSnackbar({
  toast,
  onClose,
}: {
  toast: string | null;
  onClose: () => void;
}) {
  return (
    <Snackbar
      open={toast !== null}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert severity="error" variant="filled" className="rounded-xl">
        {toast}
      </Alert>
    </Snackbar>
  );
}
