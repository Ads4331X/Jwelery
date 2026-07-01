import { Box, Container, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getMetalRates } from "../../../features/admin/utils/metalRates";
import type { MetalRateRow } from "../../../features/admin/utils/metalRates";
import { formatNPR } from "../../../components/shared/metal-rates/utils/formatNPR";

function formatRate(val?: number) {
  if (typeof val !== "number" || val <= 0) return "N/A";
  return formatNPR(val);
}

export function LiveMetalRateSection() {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [row, setRow] = useState<MetalRateRow | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchRates = async () => {
      try {
        const res = await getMetalRates();
        if (!cancelled) setRow(res);
        if (!cancelled && res) setVisible(res.visible);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchRates();

    // Optional equal-interval refresh on the client side (keeps UI fresh).
    const intervalMs = 6 * 60 * 60 * 1000; // 4x/day
    const id = window.setInterval(() => {
      void fetchRates();
    }, intervalMs);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  if (loading || !visible || !row) return null;

  return (
    <Box className="bg-white border-y border-amber-900/5" component="section">
      <Container maxWidth="xl" className="py-12 sm:py-16">
        <Box className="flex flex-col items-center text-center">
          <Box className="inline-flex items-center rounded-full border border-amber-700/25 bg-amber-100 px-5 py-1.5 text-[0.65rem] uppercase tracking-[0.35em] text-amber-700 mb-4">
            Live Metal Rate
          </Box>
          <Typography
            component="h2"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "2rem", sm: "2.6rem" },
              fontWeight: 600,
              color: "#1c1917",
              lineHeight: 1.1,
            }}
          >
            Today&apos;s Precious Metal Pricing
          </Typography>
          <Typography className="mt-3 text-sm text-stone-500 leading-7 max-w-2xl">
            Fetches today&apos;s gold and silver rates from the backend.
          </Typography>
        </Box>

        <Box className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          <Box className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-[0_8px_28px_rgba(0,0,0,0.04)]">
            <Typography className="text-[0.6rem] uppercase tracking-[0.3em] text-stone-400 mb-2">
              Gold per tola
            </Typography>
            <Typography
              className="text-4xl sm:text-5xl font-semibold"
              sx={{ fontFamily: "'Playfair Display', serif", color: "#1a1207" }}
            >
              {formatRate(row.gold_tola)}
            </Typography>
            <Typography className="mt-2 text-sm text-stone-500">
              10g: {formatRate(row.gold_ten_gram)}
            </Typography>
          </Box>

          <Box className="rounded-3xl border border-amber-900/10 bg-white p-6 shadow-[0_8px_28px_rgba(0,0,0,0.04)]">
            <Typography className="text-[0.6rem] uppercase tracking-[0.3em] text-stone-400 mb-2">
              Silver per tola
            </Typography>
            <Typography
              className="text-4xl sm:text-5xl font-semibold"
              sx={{ fontFamily: "'Playfair Display', serif", color: "#1a1207" }}
            >
              {formatRate(row.silver_tola)}
            </Typography>
            <Typography className="mt-2 text-sm text-stone-500">
              10g: {formatRate(row.silver_ten_gram)}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
