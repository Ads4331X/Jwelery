// components/ProductsHero.tsx
import { Box, Stack, Typography } from "@mui/material";

export function ProductsHero() {
  return (
    <Box
      component="section"
      className="flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32 bg-[#fafaf7] border-b border-amber-700/[0.08]"
      style={{ marginTop: 72 }}
    >
      {/* Label */}
      <Stack className="gap-3 mb-5">
        <Box className="w-8 h-px bg-amber-700" />
        <Typography className="!text-[0.65rem] !uppercase !tracking-[0.45em] !text-amber-700">
          Pashupatisunchadi Pasal
        </Typography>
        <Box className="w-8 h-px bg-amber-700" />
      </Stack>

      {/* Title */}
      <Typography
        component="h1"
        className="!text-5xl sm:!text-6xl lg:!text-7xl !font-semibold !text-stone-900 !leading-tight"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Our{" "}
        <Box component="span" className="italic text-amber-700">
          Collection
        </Box>
      </Typography>

      {/* Subtitle */}
      <Typography className="!mt-5 !text-sm sm:!text-base !text-black/40 !leading-relaxed max-w-md">
        Handcrafted gold & silver jewelry each piece a celebration of Nepal's
        heritage and timeless artistry.
      </Typography>
    </Box>
  );
}
