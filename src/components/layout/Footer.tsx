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
import { useSiteSettings } from "../../features/admin/components/AdminSiteSettings/useSiteSettings";

const NAV_LINKS = [
  { label: "Shop", path: "/" },
  { label: "About Us", path: "/about_us" },
  { label: "Contact", path: "/contact" },
];

const SECTION_HEADING_SX = {
  mb: 3,
  fontSize: "0.72rem",
  letterSpacing: "0.28em",
  textTransform: "uppercase" as const,
  color: "#b45309",
  fontWeight: 600,
};

export default function Footer() {
  const { settings } = useSiteSettings();

  const CONTACTS = [
    {
      icon: <LocationOnOutlined fontSize="small" />,
      label: settings.address,
      href: settings.maps_url,
    },
    {
      icon: <EmailOutlined fontSize="small" />,
      label: settings.email,
      href: `mailto:${settings.email}`,
    },
    {
      icon: <PhoneOutlined fontSize="small" />,
      label: settings.phone,
      href: `tel:+977${settings.phone.replace(/-/g, "")}`,
    },
  ];

  const SOCIAL_LINKS = [
    {
      label: "Facebook",
      href: settings.facebook_url,
      icon: <Facebook fontSize="small" />,
    },
    {
      label: "Instagram",
      href: settings.instagram_url,
      icon: <Instagram fontSize="small" />,
    },
  ];

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
            <Box className="flex items-center gap-3 self-start">
              <Box
                component="img"
                src={logo}
                alt="Anand Jewellers"
                className="h-14 w-auto object-contain shrink-0"
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
                Anand Jewellers
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: "0.92rem",
                color: "#6b7280",
                lineHeight: 1.9,
                maxWidth: 340,
                textAlign: "left",
              }}
            >
              Anand Jewellers, established in 2003, specializes in handcrafted
              24K and 22K gold jewellery. Combining premium materials, expert
              craftsmanship, and timeless designs, we offer unique collections
              that blend tradition with modern elegance.
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
            © {new Date().getFullYear()} Anand Jewellers. All rights reserved.
          </Typography>
          <Typography
            sx={{
              fontSize: "0.72rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "rgba(180,83,9,0.7)",
            }}
          >
            Since 2003
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
