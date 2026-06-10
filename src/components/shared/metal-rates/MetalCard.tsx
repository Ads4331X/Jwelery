import { Box, Typography } from "@mui/material";
import RateTile from "./RateTile";
import { formatNPR } from "./utils/formatNPR";
import { THEME } from "./theme";
import type { MetalKey, MetalEntry } from "./types";

interface Props {
  metalKey: MetalKey;
  entry: MetalEntry;
}

export default function MetalCard({ metalKey, entry }: Props) {
  const t = THEME[metalKey];
  return (
    <Box
      className="relative overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-2 cursor-default"
      style={{
        background: "white",
        borderColor: t.borderColor,
        boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow = t.shadowHover)
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 24px rgba(0,0,0,0.05)")
      }
    >
      <Box
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: t.radial }}
      />
      <Box
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: t.barGradient }}
      />

      <Box className="relative p-7 sm:p-8">
        <Typography
          component="h3"
          className="text-2xl font-semibold leading-tight mb-6"
          style={{ fontFamily: "'Playfair Display', serif", color: "#1a1207" }}
        >
          {t.label}
        </Typography>

        <Box className="mb-1">
          <Typography
            className="text-[0.6rem] uppercase tracking-[0.3em] mb-1"
            style={{ color: "rgba(0,0,0,0.35)" }}
          >
            {t.label} per tola
          </Typography>
          <Typography
            className="text-5xl sm:text-6xl font-semibold leading-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "#1a1207",
            }}
          >
            {formatNPR(entry.tola)}
          </Typography>
        </Box>

        <Box
          className="my-6 h-px w-full"
          style={{ background: t.dividerGradient }}
        />

        <Typography
          className="text-[0.6rem] uppercase tracking-[0.3em] mb-3"
          style={{ color: "rgba(0,0,0,0.35)" }}
        >
          Rate Breakdown
        </Typography>
        <Box className="grid grid-cols-2 gap-2.5">
          {t.tiles(entry).map((tile) => (
            <RateTile
              key={tile.label}
              label={tile.label}
              val={tile.val}
              accent={t.accent}
              accentSoft={t.accentSoft}
              tileBg={t.tileBg}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
