import { Box, Container, Typography } from "@mui/material";
import { SectionLabel, Bullet, NavBtn } from "./shared";

const POINTS = [
  "Considered recommendations tailored to the occasion.",
  "A calm, premium buying experience from start to finish.",
  "Pieces selected for beauty, durability, and meaning.",
];

export function CTASection() {
  return (
    <Box className="border-t border-amber-900/5 bg-[#fafaf7]">
      <Container maxWidth="xl" className="py-16 sm:py-20">
        <Box className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-amber-900/8 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          <Box className="grid lg:grid-cols-2">
            {/* Left */}
            <Box className="flex flex-col justify-center p-8 sm:p-10">
              <SectionLabel>Our Promise</SectionLabel>
              <Typography
                component="h2"
                className="text-3xl font-semibold leading-tight sm:text-4xl"
              >
                Guided by clarity, warmth, and respect.
              </Typography>
              <Typography className="mt-5 text-sm leading-[1.9] text-stone-500 sm:text-base">
                Whether choosing a signature piece, selecting a gift, or
                planning something custom, we make the process feel personal and
                reassuring.
              </Typography>
              <Box className="mt-8 flex flex-wrap gap-3">
                <NavBtn
                  label="View Collections"
                  variant="solid"
                  to="/products"
                />
                <NavBtn label="Contact Us" variant="outline" to="/contact" />
              </Box>
            </Box>

            {/* Right */}
            <Box className="flex flex-col justify-center gap-4 border-t border-amber-900/8 bg-[#fafaf7] p-8 sm:p-10 lg:border-l lg:border-t-0">
              <Typography
                className="text-xl font-semibold text-stone-900"
              >
                What you can expect
              </Typography>
              <Box className="flex flex-col gap-3">
                {POINTS.map((t) => (
                  <Bullet key={t} text={t} />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
