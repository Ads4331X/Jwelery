// components/FilterPanel.tsx
import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import { FilterChip } from "./FilterChip";

const METAL_OPTIONS = ["All", "Gold", "Silver"];
const CATEGORY_OPTIONS = [
  "All",
  "Ring",
  "Necklace",
  "Earring",
  "Bracelet",
  "Bangle",
  "Pendant",
  "Bridal",
];

export type Filters = { metal: string; category: string };

interface FilterPanelProps {
  filters: Filters;
  onChange: (key: keyof Filters, value: string) => void;
  onClear: () => void;
  activeCount: number;
}

export function FilterPanel({
  filters,
  onChange,
  onClear,
  activeCount,
}: FilterPanelProps) {
  return (
    <Box>
      {/* Header */}
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between", mb: 2.5 }}
      >
        <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
          <Box className="w-3.5 h-px bg-amber-700" />
          <Typography className="!text-[0.6rem] !uppercase !tracking-[0.4em] !text-amber-700 !font-semibold">
            Filters
          </Typography>
        </Stack>
        {activeCount > 0 && (
          <Button
            type="button"
            onClick={onClear}
            disableRipple
            className="!text-[0.65rem] !uppercase !tracking-wide !text-stone-400 !underline !normal-case !p-0 !min-w-0 hover:!text-amber-700"
          >
            Clear all
          </Button>
        )}
      </Stack>

      {/* Metal */}
      <Box className="mb-5">
        <Typography className="!text-[0.58rem] !uppercase !tracking-[0.3em] !text-stone-400 !font-semibold !mb-2.5">
          Metal
        </Typography>
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
          {METAL_OPTIONS.map((m) => (
            <FilterChip
              key={m}
              label={m}
              active={filters.metal === m}
              onClick={() => onChange("metal", m)}
            />
          ))}
        </Stack>
      </Box>

      <Divider className="!border-amber-900/[0.07] !mb-5" />

      {/* Category */}
      <Box>
        <Typography className="!text-[0.58rem] !uppercase !tracking-[0.3em] !text-stone-400 !font-semibold !mb-2.5">
          Category
        </Typography>
        <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
          {CATEGORY_OPTIONS.map((c) => (
            <FilterChip
              key={c}
              label={c}
              active={filters.category === c}
              onClick={() => onChange("category", c)}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
