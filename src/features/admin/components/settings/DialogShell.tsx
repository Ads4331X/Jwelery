import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  type SxProps,
} from "@mui/material";
import type { ReactNode } from "react";

type Action = {
  label: string;
  onClick: () => void;
  variant?: "text" | "outlined" | "contained";
  sx?: SxProps;
  disabled?: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  actions: Action[];
};

/** Thin reusable shell: Dialog + title + scrollable content + action row. */
export default function DialogShell({
  open,
  onClose,
  title,
  children,
  actions,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { className: "rounded-2xl" } }}
    >
      <DialogTitle className="font-semibold text-stone-800 text-base pb-1 pt-5">
        {title}
      </DialogTitle>
      <DialogContent className="pt-3!">{children}</DialogContent>
      <DialogActions className="px-6 pb-5 gap-2">
        {actions.map((a) => (
          <Button
            key={a.label}
            onClick={a.onClick}
            variant={a.variant ?? "outlined"}
            disableElevation
            size="small"
            disabled={a.disabled}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              borderColor: "#e7e5e4",
              color: "#78716c",
              ...a.sx,
            }}
          >
            {a.label}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
}
