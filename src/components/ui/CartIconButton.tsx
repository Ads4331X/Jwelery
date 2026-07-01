// src/components/shared/CartIconButton.tsx
// Drop this into your Header.tsx next to the nav links
import { Badge, IconButton } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

// Minimal, build-safe stub (cart flow will be wired later).
export function CartIconButton() {
  return (
    <IconButton
      aria-label="Cart"
      className="!text-amber-900 hover:!bg-amber-50"
      disabled
    >
      <Badge
        badgeContent={0}
        sx={{
          "& .MuiBadge-badge": {
            bgcolor: "#b45309",
            color: "#fff",
            fontSize: "0.6rem",
            minWidth: 16,
            height: 16,
          },
        }}
      >
        <ShoppingBagOutlinedIcon sx={{ fontSize: 22 }} />
      </Badge>
    </IconButton>
  );
}
