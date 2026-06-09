// components/FilterDrawer.tsx
import { Box, Button, Drawer } from "@mui/material";
import { FilterPanel, type Filters } from "./FilterPanel";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  onChange: (key: keyof Filters, value: Filters[keyof Filters]) => void;
  onClear: () => void;
  activeCount: number;
  resultCount: number;
}

export function FilterDrawer({
  open,
  onClose,
  filters,
  onChange,
  onClear,
  activeCount,
  resultCount,
}: FilterDrawerProps) {
  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          className:
            "!rounded-t-3xl !bg-[#fafaf7] !max-h-[82vh] !overflow-y-auto",
        },
      }}
    >
      <Box className="px-5 pt-4 pb-10">
        {/* Drag handle */}
        <Box className="w-9 h-1 rounded-full bg-black/10 mx-auto mb-5" />

        <FilterPanel
          filters={filters}
          onChange={onChange}
          onClear={onClear}
          activeCount={activeCount}
        />

        <Button
          type="button"
          fullWidth
          onClick={onClose}
          className="!mt-8 !py-3.5 !rounded-full !bg-gradient-to-br !from-amber-900 !to-amber-700 !text-white !text-[0.72rem] !font-bold !uppercase !tracking-widest !normal-case"
        >
          Show {resultCount} Result{resultCount !== 1 ? "s" : ""}
        </Button>
      </Box>
    </Drawer>
  );
}
