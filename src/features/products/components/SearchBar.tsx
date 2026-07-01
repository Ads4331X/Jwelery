import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

interface SearchBarProps {
  query: string;
  pageSize: number;
  pageSizeOptions: number[];
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onPageSizeChange: (value: number) => void;
}

export function SearchBar({
  query,
  pageSize,
  pageSizeOptions,
  onQueryChange,
  onSearch,
  onPageSizeChange,
}: SearchBarProps) {
  return (
    <Box
      component="form"
      onSubmit={(e: React.FormEvent) => {
        e.preventDefault();
        onSearch();
      }}
      className="flex flex-col sm:flex-row gap-3 sm:items-center"
    >
      <Box
        className="flex flex-1 items-center rounded-md overflow-hidden border border-stone-300 bg-white"
        sx={{
          "&:focus-within": {
            borderColor: "#b45309",
            boxShadow: "0 0 0 2px rgba(180,83,9,0.12)",
          },
        }}
      >
        <InputBase
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search gold rings, silver necklaces, bridal sets…"
          fullWidth
          className="px-3 py-2"
          sx={{ fontSize: "0.9rem", color: "#1c1917" }}
        />
        <IconButton
          type="submit"
          disableRipple
          sx={{
            bgcolor: "#b45309",
            color: "#fff",
            borderRadius: 0,
            px: 2,
            py: 1.25,
            "&:hover": { bgcolor: "#92400e" },
          }}
        >
          <SearchIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <Box className="flex items-center gap-2 shrink-0">
        <Typography className="text-xs text-stone-500 whitespace-nowrap">
          Show
        </Typography>
        <Select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          size="small"
          sx={{
            minWidth: 88,
            bgcolor: "#fff",
            fontSize: "0.85rem",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d6d3d1",
            },
          }}
        >
          {pageSizeOptions.map((size) => (
            <MenuItem key={size} value={size} sx={{ fontSize: "0.85rem" }}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  );
}

export default SearchBar;
