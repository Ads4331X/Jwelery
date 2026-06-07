// components/ActiveFilterPill.tsx
import CloseIcon from "@mui/icons-material/Close";
import { Chip } from "@mui/material";

interface ActiveFilterPillProps {
  label: string;
  onRemove: () => void;
}

export function ActiveFilterPill({ label, onRemove }: ActiveFilterPillProps) {
  return (
    <Chip
      label={label}
      onDelete={onRemove}
      deleteIcon={<CloseIcon className="!text-[9px] !text-amber-900" />}
      className="!bg-amber-100 !border !border-amber-700/20 !text-amber-900 !text-[0.65rem] !tracking-wide !rounded-full !h-auto !py-0.5 !px-1 hover:!bg-amber-200 !transition-colors"
    />
  );
}
