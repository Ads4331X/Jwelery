import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ShieldIcon from "@mui/icons-material/Shield";
import { useState } from "react";
import type { AdminAccount } from "../../utils/adminUser";
import type { AdminRole } from "../../../auth/context/context";
import DialogShell from "./DialogShell";
import {
  ROLE_LABEL,
  ROLE_OPTIONS,
  ROLE_TOGGLE_SX,
  ROLE_ICONS_SM,
} from "./RoleConfig.tsx";

type Mode = "pick" | "confirm" | "info";

type Props = {
  open: boolean;
  target: AdminAccount | null;
  onClose: () => void;
  onConfirm?: (newRole: AdminRole) => void;
  mode?: Mode;
};

function PickStep({
  target,
  selected,
  setSelected,
  onClose,
  onNext,
}: {
  target: AdminAccount;
  selected: AdminRole;
  setSelected: (r: AdminRole) => void;
  onClose: () => void;
  onNext: () => void;
}) {
  const unchanged = selected === target.role;
  return (
    <DialogShell
      open
      title="Change Role"
      onClose={onClose}
      actions={[
        { label: "Cancel", onClick: onClose },
        {
          label: "Continue",
          onClick: onNext,
          variant: "contained",
          disabled: unchanged,
          sx: {
            color: "white",
            backgroundColor: "#b45309",
            "&:hover": { backgroundColor: "#92400e" },
            "&.Mui-disabled": { backgroundColor: "#e7e5e4", color: "#a8a29e" },
          },
        },
      ]}
    >
      <Box className="flex items-center gap-3 mb-5">
        <Box
          className="flex-1 text-center py-2 rounded-lg text-xs font-medium"
          sx={{ backgroundColor: "#f5f5f4", color: "#78716c" }}
        >
          {ROLE_LABEL[target.role]}
        </Box>
        <ArrowForwardIcon
          sx={{ color: "#a8a29e", fontSize: 18, flexShrink: 0 }}
        />
        <Box
          className="flex-1 text-center py-2 rounded-lg text-xs font-semibold"
          sx={{
            backgroundColor: unchanged ? "#f5f5f4" : "#fffbeb",
            color: unchanged ? "#a8a29e" : "#92400e",
            border: unchanged ? "none" : "1px solid #fde68a",
          }}
        >
          {ROLE_LABEL[selected]}
        </Box>
      </Box>

      <Typography variant="caption" className="text-stone-400 mb-2 block">
        Select new role for{" "}
        <strong className="text-stone-600">{target.display_name}</strong>
      </Typography>
      <ToggleButtonGroup
        value={selected}
        exclusive
        fullWidth
        size="small"
        onChange={(_, v) => {
          if (v) setSelected(v as AdminRole);
        }}
        sx={ROLE_TOGGLE_SX}
      >
        {ROLE_OPTIONS.map(({ value, label }) => (
          <ToggleButton key={value} value={value}>
            {ROLE_ICONS_SM[value]}
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      {unchanged && (
        <Typography
          variant="caption"
          sx={{ color: "#f59e0b", display: "block", mt: 2 }}
        >
          Select a different role to continue.
        </Typography>
      )}
    </DialogShell>
  );
}

function ConfirmStep({
  target,
  selected,
  onBack,
  onConfirm,
}: {
  target: AdminAccount;
  selected: AdminRole;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const isSuper = selected === "SUPER_ADMIN";
  return (
    <DialogShell
      open
      title="Confirm Role Change"
      onClose={onBack}
      actions={[
        { label: "Back", onClick: onBack },
        {
          label: isSuper ? "Yes, promote to Super Admin" : "Apply Change",
          onClick: onConfirm,
          variant: "contained",
          sx: {
            color: "white",
            backgroundColor: isSuper ? "#c2410c" : "#b45309",
            "&:hover": { backgroundColor: isSuper ? "#9a3412" : "#92400e" },
          },
        },
      ]}
    >
      {isSuper ? (
        <Box
          sx={{
            backgroundColor: "#fff7ed",
            border: "1px solid #fed7aa",
            borderRadius: "10px",
            p: 2,
          }}
        >
          <Box className="flex items-center gap-2 mb-1">
            <WarningAmberIcon sx={{ color: "#c2410c", fontSize: 18 }} />
            <Typography
              variant="body2"
              sx={{ color: "#c2410c", fontWeight: 700 }}
            >
              High-privilege role
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#7c2d12" }}>
            Promoting <strong>{target.display_name}</strong> to Super Admin
            gives full access. Super Admin accounts{" "}
            <strong>cannot be deleted or demoted</strong> by regular admins.
          </Typography>
        </Box>
      ) : (
        <Typography variant="body2" className="text-stone-600">
          Change <strong>{target.display_name}</strong>'s role from{" "}
          <strong>{ROLE_LABEL[target.role]}</strong> to{" "}
          <strong>{ROLE_LABEL[selected]}</strong>?
        </Typography>
      )}
    </DialogShell>
  );
}

function InfoStep({
  target,
  onClose,
}: {
  target: AdminAccount;
  onClose: () => void;
}) {
  return (
    <DialogShell
      open
      onClose={onClose}
      title={
        <Box className="flex items-center gap-2">
          <ShieldIcon sx={{ color: "#b45309", fontSize: 20 }} />
          Role Updated to Super Admin
        </Box>
      }
      actions={[
        {
          label: "Got it",
          onClick: onClose,
          variant: "contained",
          sx: {
            backgroundColor: "#b45309",
            "&:hover": { backgroundColor: "#92400e" },
          },
        },
      ]}
    >
      <Box
        sx={{
          backgroundColor: "#fffbeb",
          border: "1px solid #fde68a",
          borderRadius: "10px",
          p: 2,
          mb: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: "#92400e", fontWeight: 600, mb: 0.5 }}
        >
          ⚠ Super Admin accounts are protected
        </Typography>
        <Typography variant="body2" sx={{ color: "#78350f" }}>
          <strong>{target.display_name}</strong> is now a Super Admin. Their
          account cannot be deleted or demoted by regular admins.
        </Typography>
      </Box>
      <Typography variant="caption" className="text-stone-400 block mt-2">
        Only another Super Admin can manage this account in the future.
      </Typography>
    </DialogShell>
  );
}

function PromoteDialogInner({
  target,
  onClose,
  onConfirm,
  initialMode,
}: {
  target: AdminAccount;
  onClose: () => void;
  onConfirm?: (r: AdminRole) => void;
  initialMode: Mode;
}) {
  const [step, setStep] = useState<Mode>(initialMode);
  const [selected, setSelected] = useState<AdminRole>(target.role);

  if (step === "info") return <InfoStep target={target} onClose={onClose} />;
  if (step === "confirm")
    return (
      <ConfirmStep
        target={target}
        selected={selected}
        onBack={() => setStep("pick")}
        onConfirm={() => onConfirm?.(selected)}
      />
    );
  return (
    <PickStep
      target={target}
      selected={selected}
      setSelected={setSelected}
      onClose={onClose}
      onNext={() => setStep("confirm")}
    />
  );
}

export default function PromoteDialog({
  open,
  target,
  onClose,
  onConfirm,
  mode = "pick",
}: Props) {
  if (!open || !target) return null;
  return (
    <PromoteDialogInner
      key={`${target.id}-${mode}`}
      target={target}
      onClose={onClose}
      onConfirm={onConfirm}
      initialMode={mode}
    />
  );
}
