import { Box, Typography } from "@mui/material";

export function ContactHero() {
  return (
    <Box
      className="flex flex-col items-center justify-center text-center px-6 py-24 sm:py-32 bg-[#fafaf7]"
      style={{ marginTop: 72, borderBottom: "1px solid rgba(180,83,9,0.08)" }}
    >
      <Box className="flex items-center gap-3 mb-6 justify-center">
        <Box className="w-8 h-px bg-amber-600" />
        <Typography className="text-[0.65rem] uppercase tracking-[0.45em] text-amber-700">
          Pashupatisunchadi Pasal
        </Typography>
        <Box className="w-8 h-px bg-amber-600" />
      </Box>

      <Typography
        component="h1"
        className="text-5xl sm:text-6xl lg:text-7xl font-semibold text-stone-900 leading-tight"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        Contact Our{" "}
        <Box component="span" className="italic text-amber-700">
          Showroom
        </Box>
      </Typography>

      <Box className="mt-6 flex items-center gap-2 justify-center">
        <Box className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400" />
        <Box className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <Box className="w-1.5 h-1.5 rounded-full border border-amber-400" />
        <Box className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <Box className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400" />
      </Box>

      <Typography className="mt-6 text-sm sm:text-base text-gray-500 leading-relaxed max-w-lg">
        Experience the craft of fine jewelry. Our artisans are available for
        bespoke consultations, private viewings, and heritage inquiries.
      </Typography>
    </Box>
  );
}
