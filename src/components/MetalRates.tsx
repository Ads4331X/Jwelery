import { useEffect, useState } from "react";
import { Box, Typography, Skeleton } from "@mui/material";

const api_key = import.meta.env.VITE_API_KEY;

// ---- Types ----
interface MetalData {
  price: number;
  price_gram_24k?: number;
  price_gram_22k?: number;
  price_gram_18k?: number;
  ch?: number;
  chp?: number;
  currency: string;
  timestamp: number;
}

type MetalKey = "gold" | "silver";

const metalSymbols: Record<MetalKey, string> = {
  gold: "XAU",
  silver: "XAG",
};

// ---- Theme (UI only, not data) ----
const metalTheme: Record<
  MetalKey,
  {
    label: string;
    symbol: string;
    accent: string;
    accentSoft: string;
    tileBg: string;
    radial: string;
    icon: string;
  }
> = {
  gold: {
    label: "Gold",
    symbol: "XAU · 24K",
    accent: "#b45309",
    accentSoft: "#fef3c7",
    tileBg: "#fffdf5",
    radial: "radial-gradient(ellipse at 15% 85%, #fef3c7 0%, transparent 55%)",
    icon: "◈",
  },
  silver: {
    label: "Silver",
    symbol: "XAG · 999",
    accent: "#475569",
    accentSoft: "#f1f5f9",
    tileBg: "#f8fafc",
    radial: "radial-gradient(ellipse at 85% 15%, #e2e8f0 0%, transparent 55%)",
    icon: "◇",
  },
};

// ---- Utils ----
const formatINR = (n?: number) =>
  typeof n === "number"
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(n)
    : "—";

// ---- API ----
async function fetchMetalRates(): Promise<Record<MetalKey, MetalData>> {
  const header = new Headers();
  header.append("x-access-token", api_key);
  header.append("Content-Type", "application/json");

  const results = await Promise.all(
    (Object.entries(metalSymbols) as [MetalKey, string][]).map(
      async ([key, symbol]) => {
        const res = await fetch(`https://www.goldapi.io/api/${symbol}/INR`, {
          method: "GET",
          headers: header,
        });

        if (!res.ok) {
          throw new Error(`API error ${res.status}`);
        }

        const data = await res.json();

        if (data?.error) {
          throw new Error(data.error);
        }

        return [key, data as MetalData] as const;
      },
    ),
  );

  return Object.fromEntries(results) as Record<MetalKey, MetalData>;
}

// ---- Card ----
function MetalCard({
  metalKey,
  data,
}: {
  metalKey: MetalKey;
  data: MetalData;
}) {
  const theme = metalTheme[metalKey];
  const isUp = (data?.chp ?? 0) >= 0;

  const gramTiles =
    metalKey === "gold"
      ? [
          { label: "24K / g", val: data?.price_gram_24k },
          { label: "22K / g", val: data?.price_gram_22k },
          { label: "18K / g", val: data?.price_gram_18k },
        ]
      : [
          { label: "999 / g", val: data?.price_gram_24k },
          { label: "925 / g", val: data?.price_gram_22k },
          { label: "800 / g", val: data?.price_gram_18k },
        ];

  return (
    <Box
      className="rounded-3xl border bg-white p-6"
      style={{ borderColor: `${theme.accent}22` }}
    >
      {/* Header */}
      <Box className="flex justify-between mb-5">
        <Box>
          <Typography className="text-xs uppercase tracking-widest opacity-60">
            {theme.symbol}
          </Typography>
          <Typography className="text-2xl font-semibold">
            {theme.label}
          </Typography>
        </Box>

        <Box
          className="px-3 py-1 rounded-full text-xs"
          style={{
            background: isUp ? "#e7f7ec" : "#fdecec",
            color: isUp ? "#15803d" : "#b91c1c",
          }}
        >
          {(data?.chp ?? 0).toFixed(2)}%
        </Box>
      </Box>

      {/* Price */}
      <Typography className="text-4xl font-bold">
        {formatINR(data?.price)}
      </Typography>

      {/* Change */}
      <Typography
        className="text-xs mt-1"
        style={{ color: isUp ? "#15803d" : "#b91c1c" }}
      >
        {isUp ? "+" : ""}
        {formatINR(data?.ch)} today
      </Typography>

      {/* Divider */}
      <Box className="my-5 h-px bg-gray-200" />

      {/* Gram rates */}
      <Box className="grid grid-cols-3 gap-2">
        {gramTiles.map((t) => (
          <Box
            key={t.label}
            className="p-2 text-center rounded-xl"
            style={{ background: theme.tileBg }}
          >
            <Typography className="text-[10px] opacity-60">
              {t.label}
            </Typography>
            <Typography className="font-semibold">
              {formatINR(t.val)}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Typography className="text-[10px] text-gray-400 mt-4">
        Updated {new Date(data.timestamp * 1000).toLocaleString("en-IN")}
      </Typography>
    </Box>
  );
}

// ---- Main ----
export default function MetalRates() {
  const [data, setData] = useState<Record<MetalKey, MetalData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetalRates()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box className="p-10 bg-[#fffdf8]">
      <Typography className="text-2xl font-bold mb-6 text-center">
        Precious Metal Rates
      </Typography>

      {/* Error state */}
      {error && (
        <Box className="text-center text-red-600 mb-4">
          Failed to load live rates: {error}
        </Box>
      )}

      {/* Loading */}
      {loading && (
        <Box className="grid md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} height={320} className="rounded-3xl" />
          ))}
        </Box>
      )}

      {/* Data */}
      {!loading && data && (
        <Box className="grid md:grid-cols-2 gap-6">
          {(Object.entries(data) as [MetalKey, MetalData][]).map(
            ([key, value]) => (
              <MetalCard key={key} metalKey={key} data={value} />
            ),
          )}
        </Box>
      )}
    </Box>
  );
}
