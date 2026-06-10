import { Box, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { CATEGORIES, METALS } from "./types";

interface Props {
  search: string;
  category: string;
  metal: string;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onMetalChange: (v: string) => void;
}

export default function ProductFilters({
  search,
  category,
  metal,
  onSearchChange,
  onCategoryChange,
  onMetalChange,
}: Props) {
  return (
    <Box className="flex flex-col gap-3 mb-5">
      <TextField
        size="small"
        placeholder="Search by name…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <SearchIcon fontSize="small" className="text-stone-400 mr-2" />
            ),
          },
        }}
        className="max-w-xs"
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
      />
      <ToggleButtonGroup
        value={metal}
        exclusive
        onChange={(_, v) => {
          if (v) onMetalChange(v);
        }}
        size="small"
        sx={{ flexWrap: "wrap", gap: 0.5 }}
      >
        {["All", ...METALS].map((m) => (
          <ToggleButton
            key={m}
            value={m}
            sx={{
              borderRadius: "20px !important",
              border: "1px solid #e7e5e4 !important",
              px: 2,
              py: 0.5,
              fontSize: "0.72rem",
              textTransform: "none",
              fontWeight: 500,
              color: "#78716c",
              "&.Mui-selected": {
                backgroundColor: "#1c1917 !important",
                color: "white !important",
                borderColor: "#1c1917 !important",
              },
            }}
          >
            {m}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <ToggleButtonGroup
        value={category}
        exclusive
        onChange={(_, v) => {
          if (v) onCategoryChange(v);
        }}
        size="small"
        sx={{ flexWrap: "wrap", gap: 0.5 }}
      >
        {CATEGORIES.map((c: string) => (
          <ToggleButton
            key={c}
            value={c}
            sx={{
              borderRadius: "20px !important",
              border: "1px solid #e7e5e4 !important",
              px: 2,
              py: 0.5,
              fontSize: "0.72rem",
              textTransform: "none",
              fontWeight: 500,
              color: "#78716c",
              "&.Mui-selected": {
                backgroundColor: "#1c1917 !important",
                color: "white !important",
                borderColor: "#1c1917 !important",
              },
            }}
          >
            {c}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </Box>
  );
}
