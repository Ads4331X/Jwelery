import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../../assets/images/branding/logo.png";

export default function Header() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about_us" },
    { label: "Products", path: "/products" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <Box className="fixed w-screen top-0 z-50 bg-white shadow-md">
      {/* header */}
      <Box className="flex justify-between items-center p-3 md:px-10">
        {/* logo + shopname */}
        <Box className="flex items-center gap-3 min-w-0">
          <Box
            component="img"
            src={logo}
            className="h-14 w-auto object-contain  shrink-0"
          />
          <Box className="min-w-0">
            <Box
              component={"span"}
              className="block truncate text-sm sm:text-base md:text-lg font-semibold text-stone-900 leading-none"
            >
              Jewellery Shop
            </Box>
          </Box>
        </Box>

        {/* desktop nav */}
        <Box className="hidden md:flex gap-6">
          {navLinks.map((el) => (
            <NavLink
              key={el.path}
              to={el.path}
              className={({ isActive }) =>
                `relative text-lg transition-all duration-300
                ${isActive ? "text-black" : "text-gray-500"}
                after:content-[''] after:absolute after:left-0 after:-bottom-1
                after:h-0.5 after:bg-black after:transition-all after:duration-300
                ${isActive ? "after:w-full" : "after:w-0"}
                hover:after:w-full`
              }
            >
              {el.label}
            </NavLink>
          ))}
        </Box>

        {/* mobile icon */}
        <IconButton className="md:hidden" onClick={() => setOpen(!open)}>
          <MenuIcon />
        </IconButton>
      </Box>

      {/* dropdown  */}
      <Box
        className={`
          md:hidden overflow-hidden bg-white shadow-md
          transition-all duration-300 ease-in-out
          ${open ? "max-h-96 py-4" : "max-h-0 py-0"}
        `}
      >
        <Box className="flex flex-col px-5">
          {navLinks.map((el) => (
            <NavLink
              key={el.path}
              to={el.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-lg py-3 px-2 border-t border-gray-100 first:border-t
        transition-all duration-200
        ${isActive ? "text-black font-semibold" : "text-gray-500"}
        hover:bg-gray-50`
              }
            >
              {el.label}
            </NavLink>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
