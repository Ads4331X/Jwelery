import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import heroImage from "../../../assets/images/our-story/ourstory.jpeg";
import heroAccentImage from "../../../assets/images/our-story/ourstory2.jpeg";
import detailImage from "../../../assets/images/common/detail.jpeg";

function SectionLabel({ children }: { children: string }) {
  return (
    <Box className="mb-5 flex items-center gap-3">
      <Box className="h-px w-8 bg-amber-600" />
      <Typography className="text-[0.65rem] uppercase tracking-[0.45em] text-amber-700">
        {children}
      </Typography>
    </Box>
  );
}

//  DRY IMAGE CARDS DATA
const imageCards = [
  {
    image: heroAccentImage,
    alt: "Fine jewelry detail",
    label: "Hand-finished",
    gradient: "from-black/35",
  },
  {
    image: detailImage,
    alt: "Jewelry detail",
    label: "Crafted details",
    gradient: "from-black/30",
  },
];

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <Box className="relative overflow-hidden border-b border-amber-900/5">
      <Box className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.10),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(180,83,9,0.08),transparent_38%)]" />

      <Container maxWidth="xl" className="relative py-14 sm:py-20 lg:py-28">
        <Box className="grid items-center gap-12 lg:grid-cols-[1fr_0.98fr]">
          {/* LEFT CONTENT */}
          <Box>
            <SectionLabel>About Us</SectionLabel>

            <Typography
              component="h1"
              className="max-w-3xl text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Jewelry crafted to feel personal, refined, and enduring.
            </Typography>

            <Typography className="mt-6 max-w-2xl text-sm leading-8 text-stone-600 sm:text-base">
              We design fine jewelry with a quiet sense of luxury, shaped by
              craftsmanship, thoughtful materials, and a lasting respect for
              beauty. Every piece is created to feel elegant in the moment and
              meaningful for years to come.
            </Typography>

            <Box className="mt-8 flex flex-wrap gap-4">
              <Button
                onClick={() => navigate("/products")}
                className="!rounded-full !bg-amber-700 !px-6 !py-3 !text-xs !font-semibold !uppercase !tracking-[0.28em] !text-white !transition-all hover:!bg-amber-800 hover:!shadow-[0_14px_30px_rgba(180,83,9,0.22)]"
              >
                Explore Collections
              </Button>

              <Button
                onClick={() => navigate("/contact")}
                className="!rounded-full !border !border-amber-700 !px-6 !py-3 !text-xs !font-semibold !uppercase !tracking-[0.28em] !text-amber-800 !transition-all hover:!bg-amber-100"
              >
                Private Inquiry
              </Button>
            </Box>
          </Box>

          {/* RIGHT IMAGE GRID */}
          <Box className="relative">
            <Box className="absolute -inset-6 rounded-[2rem] bg-amber-200/20 blur-3xl" />

            <Box className="relative grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
              {/* BIG IMAGE */}
              <Box className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-stone-900 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
                <Box
                  component="img"
                  src={heroImage}
                  alt="Jewelry craftsmanship"
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                <Box className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <Box className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.16),transparent_35%)]" />

                <Box className="relative flex min-h-[520px] flex-col justify-end p-6 sm:p-7">
                  <Typography className="text-[0.65rem] uppercase tracking-[0.45em] text-white/80">
                    Signature presence
                  </Typography>

                  <Typography
                    className="mt-3 max-w-sm text-3xl font-semibold leading-tight text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    A collection presented with warmth and distinction.
                  </Typography>
                </Box>
              </Box>

              {/* SMALL CARDS (LOOPED) */}
              <Box className="grid gap-4">
                {imageCards.map((card, index) => (
                  <Box
                    key={index}
                    className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.08)]"
                  >
                    <Box
                      component="img"
                      src={card.image}
                      alt={card.alt}
                      className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />

                    <Box
                      className={`absolute inset-0 bg-gradient-to-t ${card.gradient} to-transparent`}
                    />

                    <Box className="relative flex min-h-[248px] items-end p-5">
                      <Typography className="text-xs uppercase tracking-[0.35em] text-white/90">
                        {card.label}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
