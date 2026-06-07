// components/FilterChip.tsx
import { Button } from "@mui/material";

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function FilterChip({ label, active, onClick }: FilterChipProps) {
  return (
    <Button
      type="button"
      onClick={onClick}
      disableRipple={false}
      className={[
        "!rounded-full !px-3.5 !py-1 !text-[0.7rem] !tracking-wide !whitespace-nowrap !transition-all !duration-200 !border !cursor-pointer !leading-relaxed !normal-case !min-w-0",
        active
          ? "!bg-gradient-to-br !from-amber-900 !to-amber-700 !border-amber-700 !text-white !font-semibold"
          : "!bg-transparent !border-amber-900/15 !text-amber-900 hover:!border-amber-700 hover:!bg-amber-50",
      ].join(" ")}
    >
      {label}
    </Button>
  );
}
