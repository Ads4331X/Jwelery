import { Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Header() {
  const navLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about_us" },
    { label: "Products", path: "/products" },
    { label: "Gallery", path: "/gallery" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <Box
      className="sticky top-0 z-50 bg-white flex justify-around items-center flex-wrap"
      component="header"
    >
      <Box
        component="img"
        src={logo}
        className="w-16 h-16 object-cover rounded-xl scale-300"
      />

      <Box component="nav" className="flex">
        {navLinks.map((el) => (
          <NavLink
            to={el.path}
            className={({ isActive }) =>
              `relative text-xl p-2 m-2 no-underline
            after:content-[''] after:absolute after:left-0 after:bottom-0
            ${isActive ? "text-black" : "text-gray-500"}
            after:transition-all after:duration-300
            ${isActive ? "after:w-full" : "after:w-0"}
            after:h-0.5 after:bg-black
            hover:after:w-full`
            }
          >
            {el.label}
          </NavLink>
        ))}
      </Box>
    </Box>
  );
}
