import { Box, Container, Typography } from "@mui/material";
import { SectionLabel, Card } from "./shared";

const VALUES = [
  {
    title: "Craftsmanship",
    text: "Every detail is shaped with discipline, from the first sketch to the final polish.",
  },
  {
    title: "Trust",
    text: "Confidence comes from clear communication, dependable quality, and thoughtful service.",
  },
  {
    title: "Timeless beauty",
    text: "We create pieces that feel elegant now and remain relevant long after trends have passed.",
  },
];

const ARTISAN_POINTS = [
  "Skilled makers with deep material knowledge.",
  "Attention to balance, proportion, and finish.",
  "Every piece reviewed before it leaves the studio.",
];

export function ValuesSection() {
  return (
    <Box className="bg-white border-y border-amber-900/5">
      <Container maxWidth="xl" className="py-16 sm:py-24">
        <Box className="grid gap-10 lg:grid-cols-2 lg:items-stretch">
          {/* Left: intro + value cards */}
          <Box className="flex flex-col">
            <SectionLabel>Why Customers Trust Us</SectionLabel>
            <Typography
              component="h2"
              className="text-4xl font-semibold leading-tight sm:text-5xl"
            >
              Confidence is built into every detail.
            </Typography>
            <Typography className="mt-5 text-sm leading-[1.9] text-stone-500 sm:text-base">
              Our clients return for more than a beautiful object. They value a
              calm, informed experience and a team that genuinely cares.
            </Typography>
            <Box className="mt-8 grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {VALUES.map((v) => (
                <Card key={v.title}>
                  <Box className="mb-3 h-0.5 w-6 rounded-full bg-amber-600" />
                  <Typography
                    component="h3"
                    className="text-base font-semibold text-stone-900"
                  >
                    {v.title}
                  </Typography>
                  <Typography className="mt-2 text-sm leading-7 text-stone-500">
                    {v.text}
                  </Typography>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Right: artisan panel */}
          <Box className="flex flex-col rounded-2xl border border-amber-900/10 bg-[#fafaf7] p-8 sm:p-10">
            <SectionLabel>Artisan Showcase</SectionLabel>
            <Typography
              component="h3"
              className="text-3xl font-semibold leading-tight sm:text-4xl"
            >
              The hands behind the heritage.
            </Typography>
            <Typography className="mt-4 text-sm leading-[1.9] text-stone-500">
              Our work is shaped by skilled makers who understand that luxury
              lives in restraint. Their discipline appears in every finish and
              proportion.
            </Typography>

            <Box className="mt-8 flex flex-col gap-3 flex-1">
              {ARTISAN_POINTS.map((point) => (
                <Box
                  key={point}
                  className="flex items-start gap-3 rounded-xl border border-amber-900/8 bg-white px-5 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)]"
                >
                  <Box className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                  <Typography className="text-sm leading-7 text-stone-600">
                    {point}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box className="mt-8 rounded-xl bg-amber-50 px-6 py-5 text-center">
              <Typography className="text-[0.6rem] uppercase tracking-[0.35em] text-amber-700">
                Crafted by hand, presented with care
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
