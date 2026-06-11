import { Box, Typography, IconButton, Link } from "@mui/material";
import {
  Facebook,
  Instagram,
  LocationOnOutlined,
  EmailOutlined,
  PhoneOutlined,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import logo from "../../assets/images/branding/logo.png";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about_us" },
  { label: "Products", path: "/products" },
  { label: "Contact", path: "/contact" },
];

const MAPS_URL =
  "https://www.google.com/maps/place/Pashupati+sunchandi+pasal/@27.741355,85.354204,15z/data=!4m6!3m5!1s0x87bae54d1de46cbb:0x50398dc4114eec49!8m2!3d27.7413552!4d85.3542036!16s%2Fg%2F11yct2pnl8?hl=en-US&entry=ttu&g_ep=EgoyMDI2MDYwOS4wIKXMDSoASAFQAw%3D%3D";
const CONTACTS = [
  {
    icon: <LocationOnOutlined fontSize="small" />,
    label: "Jyotinagar Road, Kathmandu",
    href: MAPS_URL,
  },
  {
    icon: <EmailOutlined fontSize="small" />,
    label: "pashupatisunchadipasal@gmail.com",
    href: "mailto:pashupatisunchadipasal@gmail.com",
  },
  {
    icon: <PhoneOutlined fontSize="small" />,
    label: "986-2765445",
    href: "tel:+9779862765445",
  },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: <Facebook fontSize="small" />,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: <Instagram fontSize="small" />,
  },
];

// Shared heading style — same as header nav label tracking
const SECTION_HEADING_SX = {
  mb: 3,
  fontSize: "0.72rem",
  letterSpacing: "0.28em",
  textTransform: "uppercase" as const,
  color: "#b45309",
  fontWeight: 600,
};

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#fafaf7",
        borderTop: "1px solid rgba(180,83,9,0.08)",
        px: { xs: 3, sm: 5, lg: 10 },
        py: 8,
      }}
    >
      <Box sx={{ maxWidth: "1200px", mx: "auto" }}>
        {/* Main Footer */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr 1fr" },
            gap: 6,
            pb: 6,
            borderBottom: "1px solid rgba(180,83,9,0.08)",
          }}
        >
          {/* Brand */}
          <Box className="flex flex-col items-start gap-4">
            {/* Logo + shopname */}
            <Box className="flex items-center gap-3 self-start">
              <Box
                component="img"
                src={logo}
                alt="Pashupati Sunchadi Pasal"
                className="h-14 w-auto object-contain scale-200 shrink-0"
              />
              <Typography
                component="span"
                sx={{
                  fontSize: { xs: "0.85rem", sm: "0.98rem", md: "1.08rem" },
                  color: "#111827",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  maxWidth: { xs: 170, sm: 220, md: 260 },
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Pashupatisunchadi Pasal
              </Typography>
            </Box>

            {/* Text */}
            <Typography
              sx={{
                fontSize: "0.92rem",
                color: "#6b7280",
                lineHeight: 1.9,
                maxWidth: 340,
                textAlign: "left",
              }}
            >
              Premium handcrafted gold and silver jewelry from Jyotinagar Road,
              Kathmandu. Trusted since 2017.
            </Typography>
          </Box>

          {/* Navigation */}
          <Box>
            <Typography sx={SECTION_HEADING_SX}>Navigation</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8 }}>
              {NAV_LINKS.map(({ label, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  // mirrors header: black when active, gray otherwise, underline grows on hover/active
                  className={({ isActive }) =>
                    `relative text-[0.92rem] no-underline transition-colors duration-200 w-fit
                    after:content-[''] after:absolute after:left-0 after:-bottom-0.5
                    after:h-px after:bg-stone-900 after:transition-all after:duration-300
                    ${
                      isActive
                        ? "text-stone-900 font-medium after:w-full"
                        : "text-gray-500 after:w-0 hover:text-stone-900 hover:after:w-full"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </Box>
          </Box>

          {/* Contact */}
          <Box>
            <Typography sx={SECTION_HEADING_SX}>Contact</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {CONTACTS.map(({ icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  underline="none"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    color: "#6b7280",
                    transition: "color 0.2s",
                    "&:hover": { color: "#1c1917" },
                    "&:active": { color: "#b45309" },
                  }}
                >
                  {icon}
                  <Typography
                    sx={{ fontSize: "0.9rem", wordBreak: "break-word" }}
                  >
                    {label}
                  </Typography>
                </Link>
              ))}

              {/* Socials */}
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                {SOCIAL_LINKS.map(({ label, href, icon }) => (
                  <IconButton
                    key={label}
                    href={href}
                    target="_blank"
                    aria-label={label}
                    sx={{
                      width: 42,
                      height: 42,
                      border: "1px solid rgba(180,83,9,0.18)",
                      color: "#b45309",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        bgcolor: "#b45309",
                        color: "#fff",
                        borderColor: "#b45309",
                      },
                      "&:active": { bgcolor: "#92400e", color: "#fff" },
                    }}
                  >
                    {icon}
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Bottom Bar */}
        <Box
          sx={{
            pt: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography sx={{ fontSize: "0.8rem", color: "rgba(0,0,0,0.45)" }}>
            © {new Date().getFullYear()} Pashupati Sunchadi Pasal. All rights
            reserved.
          </Typography>
          <Typography
            sx={{
              fontSize: "0.72rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(180,83,9,0.7)",
            }}
          >
            Since 2017
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
