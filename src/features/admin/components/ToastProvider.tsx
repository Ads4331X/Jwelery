import { useRef, useState, type ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";
import { ToastContext, type ToastSeverity } from "./ToastContext";

interface Toast {
  id: number;
  message: string;
  severity: ToastSeverity;
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const showToast = (message: string, severity: ToastSeverity = "success") => {
    const id = ++counter.current;
    setToasts((p) => [...p, { id, message, severity }]);
  };

  const remove = (id: number) => setToasts((p) => p.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((t, i) => (
        <Snackbar
          key={t.id}
          open
          autoHideDuration={3500}
          onClose={() => remove(t.id)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          style={{ top: `${16 + i * 64}px` }}
        >
          <Alert
            onClose={() => remove(t.id)}
            severity={t.severity}
            variant="filled"
            sx={{
              borderRadius: "10px",
              fontWeight: 500,
              fontSize: "0.85rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              minWidth: 280,
            }}
          >
            {t.message}
          </Alert>
        </Snackbar>
      ))}
    </ToastContext.Provider>
  );
}
