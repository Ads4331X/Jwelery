import { Box, Container, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 8, suffix: "+", label: "Years of craftsmanship" },
  { value: 1200, suffix: "+", label: "Pieces created" },
  { value: 3500, suffix: "+", label: "Happy customers" },
  { value: 40, suffix: "+", label: "Collections designed" },
];

function StatCard({ value, suffix, label }: (typeof STATS)[0]) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - t0) / 1400, 1);
      setCount(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, value]);

  return (
    <Box
      ref={ref}
      className="flex flex-col items-center rounded-2xl border border-amber-900/10 bg-white px-6 py-7 shadow-[0_8px_28px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(180,83,9,0.09)]"
    >
      <Typography className="text-4xl font-semibold text-stone-900">
        {count}
        {suffix}
      </Typography>
      <Typography className="mt-2 text-center text-[0.68rem] uppercase tracking-[0.22em] text-stone-500">
        {label}
      </Typography>
    </Box>
  );
}

export function StatsSection() {
  return (
    <Box className="bg-[#fafaf7]">
      <Container maxWidth="xl" className="py-10 sm:py-14">
        <Box className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
