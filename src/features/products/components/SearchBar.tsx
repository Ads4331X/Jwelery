// components/SearchBar.tsx
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
      className="bg-white rounded-[20px] border border-amber-700/10 shadow-[0_8px_40px_rgba(0,0,0,0.05)] overflow-hidden mb-3 md:mb-4"
    >
      <Box className="px-5 sm:px-6 pt-4 pb-5 flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-end">
        {/* Search input */}
        <Box className="flex-1 group">
          <Typography className="!block !text-[0.65rem] !tracking-[0.18em] !uppercase !text-black/35 !mb-1.5 transition-colors group-focus-within:!text-amber-700">
            Search Collection
          </Typography>
          <Box className="flex items-center border-b border-amber-700/20 pb-1 transition-colors focus-within:border-amber-700">
            <InputBase
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Gold necklace, silver ring, bridal..."
              fullWidth
              className="!text-[0.9rem] !text-stone-900 [&_.MuiInputBase-input]:!placeholder-black/25"
            />
            <IconButton
              type="submit"
              disableRipple
              className={[
                "!p-0 !mb-0.5 !shrink-0 !transition-colors !duration-200",
                query
                  ? "!text-amber-700 hover:!text-amber-900"
                  : "!text-black/25 hover:!text-amber-700",
              ].join(" ")}
            >
              <SearchIcon style={{ fontSize: 20 }} />
            </IconButton>
          </Box>
        </Box>

        {/* Divider — sm+ only */}
        <Box className="hidden sm:block w-px h-8 bg-amber-700/10 shrink-0" />

        {/* Page size */}
        <Box className="w-full sm:w-36 shrink-0">
          <Typography className="!block !text-[0.65rem] !tracking-[0.18em] !uppercase !text-black/35 !mb-1.5">
            Per page
          </Typography>
          <Select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            variant="standard"
            fullWidth
            disableUnderline
            className="!text-[0.875rem] !text-stone-900 !border-b !border-amber-700/20 hover:!border-amber-700 !transition-colors"
          >
            {pageSizeOptions.map((size) => (
              <MenuItem
                key={size}
                value={size}
                className="!text-[0.875rem] !text-stone-900"
              >
                {size} items
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {/* Amber accent bar */}
      <Box
        className="h-0.5 opacity-50"
        style={{
          background:
            "linear-gradient(90deg, #b45309 0%, #f59e0b 60%, transparent 100%)",
        }}
      />
    </Box>
  );
}

export default SearchBar;
