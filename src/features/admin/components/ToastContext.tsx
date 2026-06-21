import { createContext } from "react";

export type ToastSeverity = "success" | "error" | "info" | "warning";

export interface ToastContextType {
  showToast: (message: string, severity?: ToastSeverity) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);
