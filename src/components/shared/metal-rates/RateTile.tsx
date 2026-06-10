import { Box, Typography } from "@mui/material";
import { formatNPR } from "./utils/formatNPR";

interface Props {
  label: string;
  val: number;
  accent: string;
  accentSoft: string;
  tileBg: string;
}

export default function RateTile({
  label,
  val,
  accent,
  accentSoft,
  tileBg,
}: Props) {
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
