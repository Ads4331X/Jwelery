import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { getMetalRates } from "../../../features/admin/utils/metalRates";
import MetalCard from "./MetalCard";
import { METAL_KEYS } from "./theme";
import type { RateData } from "./types";

export default function MetalRates() {
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

  if (isLoading || !visible) return null;

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
