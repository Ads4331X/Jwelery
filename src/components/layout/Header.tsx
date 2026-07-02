import { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Badge, Avatar, Box, Drawer, IconButton } from "@mui/material";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../../features/auth/context/context";
import { useCart } from "../../hooks/useCart";
import logo from "../../assets/images/branding/logo.png";

const NAV = [
  { label: "Shop", path: "/" },
  { label: "About Us", path: "/about_us" },
  { label: "Contact", path: "/contact" },
];

export default function Header() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { cartCount } = useCart();
  const user = auth?.user ?? null;
  const [open, setOpen] = useState(false);

  const initials = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : "";

  const close = () => setOpen(false);

  return (
    <>
      <Box
        component="header"
        className="sticky top-0 z-50 bg-white"
        sx={{
          borderBottom: "1px solid rgba(180,83,9,0.08)",
          boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
        }}
      >
        <Box className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-14 sm:h-16">
          <NavLink
            to="/"
            className="flex items-center gap-2 shrink-0 no-underline"
          >
            <Box
              component="img"
              src={logo}
              alt="Anand Jewellers"
              className="h-8 sm:h-10 w-auto"
            />
            <Box className="hidden sm:block leading-none">
              <span className="block text-sm font-bold text-stone-900 tracking-tight">
                Anand Jewellers
              </span>
              <span className="block text-[9px] text-amber-600 tracking-[0.22em] uppercase mt-0.5">
                Since 2003
              </span>
            </Box>
          </NavLink>

          <Box className="flex items-center gap-1 sm:gap-2 ml-auto">
            {!user && (
              <Box className="flex items-center gap-1 sm:gap-2 mr-1">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-[0.7rem] sm:text-sm font-semibold text-amber-800 rounded-full border cursor-pointer hover:bg-amber-50 transition-colors"
                  style={{ borderColor: "#b45309" }}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-[0.7rem] sm:text-sm font-bold text-white rounded-full cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #92400e, #b45309)",
                  }}
                >
                  Sign Up
                </button>
              </Box>
            )}

            <IconButton
              onClick={() => navigate("/cart")}
              aria-label="Cart"
              sx={{ color: "#1c1917" }}
            >
              <Badge
                badgeContent={cartCount}
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: "#b45309",
                    color: "#fff",
                    fontSize: "0.55rem",
                    minWidth: 16,
                    height: 16,
                  },
                }}
              >
                <ShoppingBagOutlinedIcon
                  sx={{ fontSize: { xs: 20, sm: 22 } }}
                />
              </Badge>
            </IconButton>

            {user && (
              <IconButton
                onClick={() => navigate("/profile")}
                aria-label="Profile"
                size="small"
                sx={{ ml: 0.5 }}
              >
                <Avatar
                  sx={{
                    width: { xs: 24, sm: 30 },
                    height: { xs: 24, sm: 30 },
                    bgcolor: "#78350f",
                    fontSize: { xs: "0.55rem", sm: "0.65rem" },
                    fontWeight: 700,
                  }}
                >
                  {initials}
                </Avatar>
              </IconButton>
            )}

            <IconButton
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              sx={{ color: "#1c1917" }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      <Drawer
        anchor="right"
        open={open}
        onClose={close}
        slotProps={{ paper: { sx: { width: 260 } } }}
      >
        <Box
          className="flex items-center justify-between px-5 py-4"
          sx={{ borderBottom: "1px solid #f0ede8" }}
        >
          <span className="text-sm font-semibold text-stone-900">Menu</span>
          <IconButton size="small" onClick={close} aria-label="Close menu">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box className="flex flex-col px-3 pt-3 gap-0.5">
          {NAV.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={close}
              className={({ isActive }) =>
                `px-4 py-2.5 rounded-xl text-sm font-medium no-underline transition-colors ${isActive ? "bg-amber-50 text-amber-800" : "text-stone-600 hover:bg-stone-100"}`
              }
            >
              {label}
            </NavLink>
          ))}
        </Box>

        <Box className="mx-3 my-4" sx={{ height: 1, bgcolor: "#f0ede8" }} />

        {user ? (
          <Box className="flex flex-col px-3 gap-0.5">
            <Box className="flex items-center gap-3 px-4 py-3 mb-2">
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: "#78350f",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                }}
              >
                {initials}
              </Avatar>
              <Box>
                <div className="text-sm font-semibold text-stone-900">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-[11px] text-stone-500">{user.email}</div>
              </Box>
            </Box>
            <button
              onClick={() => {
                navigate("/orders");
                close();
              }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-stone-600 hover:bg-stone-100 cursor-pointer text-left w-full"
            >
              <ReceiptLongOutlinedIcon
                sx={{ fontSize: 17, color: "#b45309" }}
              />{" "}
              My Orders
            </button>
            <button
              onClick={() => {
                auth?.logout();
                close();
              }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 cursor-pointer text-left w-full mt-1"
            >
              <LogoutIcon sx={{ fontSize: 17 }} /> Sign Out
            </button>
          </Box>
        ) : (
          <Box className="flex flex-col gap-2 px-5">
            <button
              onClick={() => {
                navigate("/login");
                close();
              }}
              className="w-full py-2.5 rounded-full border text-sm font-semibold cursor-pointer text-amber-800 hover:bg-amber-50 transition-colors"
              style={{ borderColor: "#b45309" }}
            >
              Log In
            </button>
            <button
              onClick={() => {
                navigate("/signup");
                close();
              }}
              className="w-full py-2.5 rounded-full text-sm font-bold text-white cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #92400e, #b45309)",
              }}
            >
              Sign Up
            </button>
          </Box>
        )}
      </Drawer>
    </>
  );
}
