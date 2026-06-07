import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export function SectionLabel({
  children,
  center,
}: {
  children: string;
  center?: boolean;
}) {
  return (
    <Box
      className={`mb-4 flex items-center gap-3 ${center ? "justify-center" : ""}`}
    >
      <Box className="h-px w-6 bg-amber-600" />
      <Typography className="text-[0.6rem] uppercase tracking-[0.45em] text-amber-700">
        {children}
      </Typography>
      {center && <Box className="h-px w-6 bg-amber-600" />}
    </Box>
  );
}

export function Bullet({ text }: { text: string }) {
  return (
    <Box className="flex items-start gap-3 rounded-xl bg-white px-4 py-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-colors duration-200 hover:bg-amber-50/60">
      <Box className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
      <Typography className="text-sm leading-7 text-stone-600">
        {text}
      </Typography>
    </Box>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Box
      className={`rounded-2xl border border-amber-900/10 bg-white p-6 shadow-[0_8px_28px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(180,83,9,0.09)] ${className}`}
    >
      {children}
    </Box>
  );
}

export function NavBtn({
  label,
  variant,
  to,
}: {
  label: string;
  variant: "solid" | "outline";
  to: string;
}) {
  const navigate = useNavigate();
  const base =
    "!rounded-full !px-6 !py-2.5 !text-[0.7rem] !font-semibold !uppercase !tracking-[0.25em] !transition-all";
  const styles =
    variant === "solid"
      ? "!bg-amber-700 !text-white hover:!bg-amber-800"
      : "!border !border-amber-700/60 !text-amber-800 hover:!bg-amber-50";
  return (
    <Button onClick={() => navigate(to)} className={`${base} ${styles}`}>
      {label}
    </Button>
  );
}

export function ImageOverlay({
  src,
  alt,
  label,
  minH = "360px",
}: {
  src: string;
  alt: string;
  label?: string;
  minH?: string;
}) {
  return (
    <Box
      className="group relative overflow-hidden rounded-2xl"
      style={{ minHeight: minH }}
    >
      <Box
        component="img"
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <Box className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      {label && (
        <Box className="absolute bottom-0 left-0 p-5">
          <Typography className="text-[0.6rem] uppercase tracking-[0.4em] text-white/80">
            {label}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
