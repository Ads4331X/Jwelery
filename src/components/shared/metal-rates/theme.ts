import type { MetalKey, MetalTheme, MetalEntry } from "./types";

export const THEME: Record<MetalKey, MetalTheme> = {
  gold: {
    label: "Gold",
    accent: "#b45309",
    accentSoft: "#fef3c7",
    tileBg: "#fffdf5",
    radial: "radial-gradient(ellipse at 15% 85%, #fef3c7 0%, transparent 55%)",
    barGradient: "linear-gradient(90deg, #b45309, #fcd34d, #b45309)",
    shadowHover: "0 24px 60px rgba(180,83,9,0.15)",
    borderColor: "rgba(180,83,9,0.12)",
    dividerGradient:
      "linear-gradient(90deg, transparent, rgba(180,83,9,0.2), transparent)",
    tiles: (e: MetalEntry) => [
      { label: "Chapawal / tola", val: e.tola },
      { label: "Chapawal / 10g", val: e.ten_gram },
    ],
  },
  silver: {
    label: "Silver",
    accent: "#475569",
    accentSoft: "#f1f5f9",
    tileBg: "#f8fafc",
    radial: "radial-gradient(ellipse at 85% 15%, #e2e8f0 0%, transparent 55%)",
    barGradient: "linear-gradient(90deg, #475569, #94a3b8, #475569)",
    shadowHover: "0 24px 60px rgba(71,85,105,0.15)",
    borderColor: "rgba(71,85,105,0.12)",
    dividerGradient:
      "linear-gradient(90deg, transparent, rgba(71,85,105,0.2), transparent)",
    tiles: (e: MetalEntry) => [
      { label: "Silver / tola", val: e.tola },
      { label: "Silver / 10g", val: e.ten_gram },
    ],
  },
};

export const METAL_KEYS: MetalKey[] = ["gold", "silver"];
