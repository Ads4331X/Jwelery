import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { getMetalRates } from "../../features/admin/utils/metalRates";

// Types
type MetalEntry = { tola: number; ten_gram: number };
type RateData = { gold: MetalEntry; silver: MetalEntry };
type MetalKey = "gold" | "silver";

type MetalTheme = {
  label: string;
  symbol: string;
  icon: string;
  accent: string;
  accentSoft: string;
  tileBg: string;
  radial: string;
  barGradient: string;
  shadowHover: string;
  borderColor: string;
  dividerGradient: string;
  tolaLabel: string;
  tiles: (e: MetalEntry) => { label: string; val: number }[];
};

const THEME: Record<MetalKey, MetalTheme> = {
  gold: {
    label: "Gold",
    symbol: "XAU · Chapawal",
    icon: "Au",
    accent: "#b45309",
    accentSoft: "#fef3c7",
    tileBg: "#fffdf5",
    radial: "radial-gradient(ellipse at 15% 85%, #fef3c7 0%, transparent 55%)",
    barGradient: "linear-gradient(90deg, #b45309, #fcd34d, #b45309)",
    shadowHover: "0 24px 60px rgba(180,83,9,0.15)",
    borderColor: "rgba(180,83,9,0.12)",
    dividerGradient:
      "linear-gradient(90deg, transparent, rgba(180,83,9,0.2), transparent)",
    tolaLabel: "Chapawal Gold per tola",
    tiles: (e) => [
      { label: "Chapawal / tola", val: e.tola },
      { label: "Chapawal / 10g", val: e.ten_gram },
    ],
  },
  silver: {
    label: "Silver",
    symbol: "XAG · 999",
    icon: "Ag",
    accent: "#475569",
    accentSoft: "#f1f5f9",
    tileBg: "#f8fafc",
    radial: "radial-gradient(ellipse at 85% 15%, #e2e8f0 0%, transparent 55%)",
    barGradient: "linear-gradient(90deg, #475569, #94a3b8, #475569)",
    shadowHover: "0 24px 60px rgba(71,85,105,0.15)",
    borderColor: "rgba(71,85,105,0.12)",
    dividerGradient:
      "linear-gradient(90deg, transparent, rgba(71,85,105,0.2), transparent)",
    tolaLabel: "Silver per tola",
    tiles: (e) => [
      { label: "Silver / tola", val: e.tola },
      { label: "Silver / 10g", val: e.ten_gram },
    ],
  },
};

const METAL_KEYS: MetalKey[] = ["gold", "silver"];

const formatNPR = (n?: number) =>
  typeof n === "number" && n > 0
    ? "Rs " +
      new Intl.NumberFormat("en-NP", { maximumFractionDigits: 0 }).format(n)
    : "N/A";

// RateTile
function RateTile({
  label,
  val,
  accent,
  accentSoft,
  tileBg,
}: {
  label: string;
  val: number;
  accent: string;
  accentSoft: string;
  tileBg: string;
}) {
  return (
    <Box
      className="rounded-2xl px-3 py-3.5 text-center transition-all duration-300 hover:scale-[1.03] cursor-default"
      style={{ backgroundColor: tileBg, border: `1px solid ${accent}15` }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${accent}35`;
        (e.currentTarget as HTMLElement).style.backgroundColor = accentSoft;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${accent}15`;
        (e.currentTarget as HTMLElement).style.backgroundColor = tileBg;
      }}
    >
      <Typography
        className="text-[0.58rem] uppercase tracking-[0.2em] mb-1"
        style={{ color: "rgba(0,0,0,0.4)" }}
      >
        {label}
      </Typography>
      <Typography
        className="text-base sm:text-lg font-semibold"
        style={{ fontFamily: "'Playfair Display', serif", color: accent }}
      >
        {formatNPR(val)}
      </Typography>
    </Box>
  );
}

// MetalCard
function MetalCard({
  metalKey,
  entry,
}: {
  metalKey: MetalKey;
  entry: MetalEntry;
}) {
  const t = THEME[metalKey];
  return (
    <Box
      className="group relative overflow-hidden rounded-3xl border transition-all duration-500 hover:-translate-y-2 cursor-default"
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
        <Box className="flex items-center gap-3 mb-6">
          <Box
            className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold"
            style={{
              background: t.accentSoft,
              color: t.accent,
              border: `1px solid ${t.accent}22`,
            }}
          >
            {t.icon}
          </Box>
          <Box>
            <Typography
              className="text-[0.6rem] uppercase tracking-[0.35em]"
              style={{ color: "rgba(0,0,0,0.4)" }}
            >
              {t.symbol}
            </Typography>
            <Typography
              component="h3"
              className="text-2xl font-semibold leading-tight"
              style={{
                fontFamily: "'Playfair Display', serif",
                color: "#1a1207",
              }}
            >
              {t.label}
            </Typography>
          </Box>
        </Box>

        <Box className="mb-1">
          <Typography
            className="text-[0.6rem] uppercase tracking-[0.3em] mb-1"
            style={{ color: "rgba(0,0,0,0.35)" }}
          >
            {t.tolaLabel}
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

        <Box className="mt-6 flex items-center gap-1.5">
          <Box className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <Typography
            className="text-[0.65rem] tracking-wide"
            style={{ color: "rgba(0,0,0,0.3)" }}
          >
            Live · FENEGOSIDA · Updated daily after 11 AM NPT
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// MetalRates — reads from Supabase, respects visibility toggle
function MetalRates() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<RateData | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    void (async () => {
      const row = await getMetalRates();
      if (row) {
        setVisible(row.visible);
        setData({
          gold: { tola: row.gold_tola, ten_gram: row.gold_ten_gram },
          silver: { tola: row.silver_tola, ten_gram: row.silver_ten_gram },
        });
      }
      setIsLoading(false);
    })();
  }, []);

  // Hidden by admin toggle or still loading
  if (isLoading) return null;
  if (!visible) return null;

  return (
    <Box
      component="section"
      className="relative w-full overflow-hidden bg-[#fffdf8] px-6 py-16 sm:px-10 lg:px-16 lg:py-24"
    >
      <Box
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 10% 10%, #fef3c7, transparent 50%), radial-gradient(ellipse at 90% 90%, #fef3c7, transparent 50%)",
        }}
      />

      <Box className="relative mx-auto mb-12 flex max-w-3xl flex-col items-center text-center lg:mb-16">
        <Box
          component="span"
          className="inline-flex items-center rounded-full border border-amber-700/25 bg-amber-100 px-5 py-1.5 text-[0.65rem] uppercase tracking-[0.35em] text-amber-700 mb-5"
        >
          Live Market Rates
        </Box>

        <Typography
          component="h2"
          className="font-semibold leading-tight text-[#1a1207]"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
          }}
        >
          {"Today's "}
          <Box component="span" className="text-amber-700">
            Precious Metal
          </Box>
          {" Rates"}
        </Typography>

        <Box className="mt-5 flex items-center gap-2">
          <Box className="w-12 h-px bg-gradient-to-r from-transparent to-amber-400" />
          <Box className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <Box className="w-1.5 h-1.5 rounded-full border border-amber-400" />
          <Box className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <Box className="w-12 h-px bg-gradient-to-l from-transparent to-amber-400" />
        </Box>

        <Typography className="mt-5 max-w-md text-[0.95rem] leading-8 text-gray-500">
          Official FENEGOSIDA rates, transparent pricing so every piece carries
          its true value.
        </Typography>
      </Box>

      <Box className="relative mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {data &&
          METAL_KEYS.map((key) => (
            <MetalCard key={key} metalKey={key} entry={data[key]} />
          ))}
      </Box>

      <Typography className="relative mx-auto mt-10 max-w-2xl text-center text-xs italic text-gray-400">
        Rates sourced from FENEGOSIDA. Final jewellery price includes making
        charges and taxes.
      </Typography>
    </Box>
  );
}

export default MetalRates;
