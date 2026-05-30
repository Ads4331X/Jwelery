import { Box, Typography, IconButton, Link } from "@mui/material";

import {
  Facebook,
  Instagram,
  LocationOnOutlined,
  EmailOutlined,
  PhoneOutlined,
} from "@mui/icons-material";

import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about_us" },
  { label: "Products", path: "/products" },
  { label: "Gallery", path: "/gallery" },
  { label: "Contact", path: "/contact" },
];

const MAPS_URL =
  "https://www.google.com/maps/place/Pashupati+sunchandi+pasal/@27.7413552,85.3542036,17z";

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
      <Box
        sx={{
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        {/* Main Footer */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1.2fr 0.8fr 1fr",
            },
            gap: 6,
            pb: 6,
            borderBottom: "1px solid rgba(180,83,9,0.08)",
          }}
        >
          {/* Brand */}
          <Box>
            <Box
              component="img"
              src={logo}
              alt="Pashupati Sunchadi Pasal"
              sx={{
                height: 60,
                width: "auto",
                mb: 3,
              }}
            />

            <Typography
              sx={{
                fontSize: "0.92rem",
                color: "#6b7280",
                lineHeight: 1.9,
                maxWidth: 340,
              }}
            >
              Premium handcrafted gold and silver jewelry from Jyotinagar Road,
              Kathmandu. Trusted since 2017.
            </Typography>
          </Box>

          {/* Navigation */}
          <Box>
            <Typography
              sx={{
                mb: 3,
                fontSize: "0.72rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#b45309",
                fontWeight: 600,
              }}
            >
              Navigation
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.8,
              }}
            >
              {NAV_LINKS.map(({ label, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  style={{
                    textDecoration: "none",
                    color: "#6b7280",
                    fontSize: "0.92rem",
                    transition: "0.2s",
                  }}
                >
                  {label}
                </NavLink>
              ))}
            </Box>
          </Box>

          {/* Contact */}
          <Box>
            <Typography
              sx={{
                mb: 3,
                fontSize: "0.72rem",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#b45309",
                fontWeight: 600,
              }}
            >
              Contact
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {CONTACTS.map(({ icon, label, href }) => (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  underline="none"
                  color="inherit"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    color: "#6b7280",
                    transition: "0.2s",
                    "&:hover": {
                      color: "#1c1917",
                    },
                  }}
                >
                  {icon}

                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      wordBreak: "break-word",
                    }}
                  >
                    {label}
                  </Typography>
                </Link>
              ))}

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 1,
                }}
              >
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
                      transition: "all .25s ease",
                      "&:hover": {
                        bgcolor: "#b45309",
                        color: "#fff",
                      },
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
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.8rem",
              color: "rgba(0,0,0,0.45)",
            }}
          >
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
