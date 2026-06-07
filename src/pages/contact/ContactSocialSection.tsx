import { Box, Typography } from "@mui/material";
import { Facebook, Instagram } from "@mui/icons-material";
import ContactPic from "../../assets/ContactSection.jpeg";

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    sub: "Follow our page",
    icon: <Facebook fontSize="small" />,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    sub: "Behind the scenes",
    icon: <Instagram fontSize="small" />,
  },
];

export function ContactSocialSection() {
  return (
    <Box className="border-t border-amber-700/10 bg-white py-10 lg:py-16">
      <Box className="mx-auto max-w-7xl px-6">
        <Box className="grid overflow-hidden rounded-[28px] bg-[#fafaf7] shadow-[0_20px_60px_rgba(0,0,0,0.08)] md:grid-cols-2">
          {/* Image */}
          <Box className="group relative min-h-[320px] overflow-hidden md:min-h-[520px]">
            <Box
              component="img"
              src={ContactPic}
              alt="Jewelry craftsmanship"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <Box className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/5 to-transparent" />
          </Box>

          {/* Content */}
          <Box className="flex flex-col justify-center bg-[#fafaf7] px-8 py-10 lg:px-14 lg:py-14">
            <Box className="mb-5 flex items-center gap-3">
              <Box className="h-px w-8 bg-amber-700" />
              <Typography className="text-[0.7rem] uppercase tracking-[0.35em] text-amber-700">
                Direct Connections
              </Typography>
            </Box>

            <Typography
              component="h2"
              className="mb-4 text-3xl font-semibold leading-tight text-stone-900 sm:text-4xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Stay Connected
            </Typography>

            <Typography className="mb-8 max-w-md text-sm leading-7 text-gray-500">
              Follow us for daily inspiration, new arrivals, behind-the-scenes
              craftsmanship, and exclusive collection previews.
            </Typography>

            <Box className="flex flex-col">
              {SOCIAL_LINKS.map(({ label, href, sub, icon }) => (
                <Box
                  key={label}
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 border-b border-amber-700/10 py-5 no-underline transition-all duration-300 hover:bg-white/40 hover:pl-2"
                >
                  <Box className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-700/20 bg-amber-100 text-amber-700 transition-all duration-300 group-hover:bg-amber-700 group-hover:text-white">
                    {icon}
                  </Box>
                  <Box>
                    <Typography className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-800 group-hover:text-amber-700 transition-colors duration-300">
                      {label}
                    </Typography>
                    <Typography className="mt-1 text-xs text-gray-400">
                      {sub}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            <Typography className="mt-8 border-t border-amber-700/10 pt-4 text-xs italic text-gray-400">
              Jyotinagar Road, Kathmandu · Open Sat to Fri, 10:00 to 19:00
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
