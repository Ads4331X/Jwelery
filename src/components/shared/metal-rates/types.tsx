export type MetalEntry = { tola: number; ten_gram: number };
export type RateData = { gold: MetalEntry; silver: MetalEntry };
export type MetalKey = "gold" | "silver";

export type MetalTheme = {
  label: string;
  accent: string;
  accentSoft: string;
  tileBg: string;
  radial: string;
  barGradient: string;
  shadowHover: string;
  borderColor: string;
  dividerGradient: string;
  tiles: (e: MetalEntry) => { label: string; val: number }[];
};
