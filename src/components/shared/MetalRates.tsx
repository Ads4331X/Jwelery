import { useEffect, useState } from "react";
import { Box, Skeleton, Typography } from "@mui/material";
import { getMetalRates } from "../../features/admin/utils/metalRates";
import MetalCard from "./metal-rates/MetalCard";
import type { RateData, MetalKey } from "./metal-rates/types";
import { THEME } from "./metal-rates/theme";

// ── Generic skeleton, reused for both gold and silver cards ──────────────────
function MetalCardSkeleton({ metalKey }: { metalKey: MetalKey }) {
  const t = THEME[metalKey];
  return (
    <Box
      className="relative overflow-hidden rounded-3xl border bg-white p-7 shadow-[0_4px_24px_rgba(0,0,0,0.05)] sm:p-8"
      style={{ borderColor: t.borderColor }}
    >
      <Skeleton
        variant="text"
        width="45%"
        height={36}
        sx={{ mb: 3, bgcolor: "#f3f4f6" }}
      />
      <Skeleton
        variant="text"
        width="35%"
        height={18}
        sx={{ mb: 1.5, bgcolor: "#f3f4f6" }}
      />
      <Skeleton
        variant="text"
        width="72%"
        height={72}
        sx={{ mb: 4, bgcolor: "#f3f4f6" }}
      />
      <Skeleton
        variant="rectangular"
        height={1}
        sx={{ mb: 3, bgcolor: `${t.accent}1f` }}
      />
      <Skeleton
        variant="text"
        width="42%"
        height={18}
        sx={{ mb: 2.5, bgcolor: "#f3f4f6" }}
      />
      <Box className="grid grid-cols-2 gap-2.5">
        {[0, 1].map((tile) => (
          <Box
            key={tile}
            className="rounded-2xl border border-gray-100 p-4"
            style={{ backgroundColor: t.tileBg }}
          >
            <Skeleton
              variant="text"
              width="78%"
              height={16}
              sx={{ mb: 1.5, bgcolor: "#f3f4f6" }}
            />
            <Skeleton
              variant="text"
              width="64%"
              height={24}
              sx={{ bgcolor: "#f3f4f6" }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ── Validity check, shared between gold and silver ───────────────────────────
function isValidEntry(entry?: { tola: number; ten_gram: number } | null) {
  return (
    !!entry &&
    typeof entry.tola === "number" &&
    Number.isFinite(entry.tola) &&
    entry.tola > 0 &&
    typeof entry.ten_gram === "number" &&
    Number.isFinite(entry.ten_gram) &&
    entry.ten_gram > 0
  );
}

export default function MetalRates() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<RateData | null>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let isActive = true;

    void (async () => {
      try {
        const row = await getMetalRates();
        if (!isActive) return;

        if (!row?.visible) {
          setVisible(false);
          setData(null);
          return;
        }

        setVisible(true);
        setData({
          gold: { tola: row.gold_tola, ten_gram: row.gold_ten_gram },
          silver: { tola: row.silver_tola, ten_gram: row.silver_ten_gram },
        });
      } catch {
        if (isActive) {
          // Fetch failed (e.g. backend/DB issue) — keep section visible but
          // let each card fall back to its own skeleton below, rather than
          // hiding the whole section or showing "N/A".
          setVisible(true);
          setData(null);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, []);

  if (!visible) return null;

  const goldValid = isValidEntry(data?.gold);
  const silverValid = isValidEntry(data?.silver);

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
          Official rates, transparent pricing so every piece carries its true
          value.
        </Typography>
      </Box>

      <Box className="relative mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
        {isLoading || !goldValid ? (
          <MetalCardSkeleton metalKey="gold" />
        ) : (
          <MetalCard metalKey="gold" entry={data!.gold} />
        )}

        {isLoading || !silverValid ? (
          <MetalCardSkeleton metalKey="silver" />
        ) : (
          <MetalCard metalKey="silver" entry={data!.silver} />
        )}
      </Box>
    </Box>
  );
}
