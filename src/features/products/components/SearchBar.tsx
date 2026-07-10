import { useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
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
  const inputRef = useRef<HTMLInputElement>(null);

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
        className="flex flex-1 items-center rounded-full bg-white transition-shadow duration-150"
        sx={{
          border: "1px solid #e7e5e4",
          boxShadow: "0 1px 2px rgba(28,25,23,0.04)",
          "&:focus-within": {
            borderColor: "#b45309",
            boxShadow: "0 0 0 3px rgba(180,83,9,0.10)",
          },
        }}
      >
        <SearchIcon
          sx={{ fontSize: 19, color: "#a8a29e", ml: "16px", flexShrink: 0 }}
        />

        <InputBase
          inputRef={inputRef}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search gold rings, silver necklaces, bridal sets…"
          fullWidth
          className="px-3 py-2.5"
          sx={{
            fontSize: "0.9rem",
            color: "#1c1917",
            "& input::placeholder": {
              color: "#a8a29e",
              opacity: 1,
            },
          }}
        />

        {query && (
          <IconButton
            type="button"
            disableRipple
            onClick={() => {
              onQueryChange("");
              inputRef.current?.focus();
            }}
            sx={{
              color: "#a8a29e",
              p: "6px",
              mr: "4px",
              "&:hover": { color: "#78716c", bgcolor: "#f5f5f4" },
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        )}

        <IconButton
          type="submit"
          disableRipple
          sx={{
            bgcolor: "#b45309",
            color: "#fff",
            borderRadius: "9999px",
            m: "5px",
            px: 2.25,
            py: 1,
            fontSize: "0.82rem",
            fontWeight: 600,
            gap: 0.75,
            transition: "background-color 150ms",
            "&:hover": { bgcolor: "#92400e" },
          }}
        >
          <SearchIcon sx={{ fontSize: 17 }} />
          <Typography
            component="span"
            className="hidden sm:inline"
            sx={{ fontSize: "0.82rem", fontWeight: 600, ml: 0.25 }}
          >
            Search
          </Typography>
        </IconButton>
      </Box>

      <Box className="flex items-center gap-2 shrink-0 justify-end sm:justify-start">
        <Typography className="text-xs text-stone-500 whitespace-nowrap">
          Show
        </Typography>
        <Select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          size="small"
          sx={{
            minWidth: 84,
            bgcolor: "#fff",
            fontSize: "0.85rem",
            borderRadius: "9999px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e7e5e4",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#d6d3d1",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#b45309",
              borderWidth: "1px",
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
