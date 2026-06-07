import { Box, Container, Typography } from "@mui/material";
import { SectionLabel, Card } from "./shared";

const ITEMS = [
  {
    n: "01",
    title: "Heritage led design",
    text: "Our collections draw from timeless forms and a refined understanding of what jewelry should feel like on the body.",
  },
  {
    n: "02",
    title: "Careful selection",
    text: "We focus on clarity, finish, and balance so every piece reflects a consistent standard of quality.",
  },
  {
    n: "03",
    title: "Made to last",
    text: "Each piece is created to remain elegant, wearable, and meaningful across seasons and generations.",
  },
  {
    n: "04",
    title: "Personal service",
    text: "We guide every client with patience, transparency, and a genuine respect for the occasion.",
  },
];

export function StorySection() {
  return (
    <Box className="bg-[#fafaf7]">
      <Container maxWidth="xl" className="py-16 sm:py-24">
        <Box className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Text */}
          <Box>
            <SectionLabel>Our Story</SectionLabel>
            <Typography
              component="h2"
              className="text-4xl font-semibold leading-tight sm:text-5xl"
            >
              A legacy shaped by patience and precision.
            </Typography>
            <Typography className="mt-5 text-sm leading-[1.9] text-stone-500 sm:text-base">
              Our journey began with a belief that fine jewelry should do more
              than shine. It should carry presence, sentiment, and a sense of
              permanence.
            </Typography>
            <Typography className="mt-4 text-sm leading-[1.9] text-stone-500 sm:text-base">
              We preserve the warmth of tradition while refining each piece for
              a modern and sophisticated experience.
            </Typography>
          </Box>

          {/* Cards grid */}
          <Box className="grid grid-cols-2 gap-4">
            {ITEMS.map(({ n, title, text }) => (
              <Card key={n}>
                <Typography className="mb-3 text-xs font-semibold tracking-[0.2em] text-amber-600">
                  {n}
                </Typography>
                <Typography
                  component="h3"
                  className="text-base font-semibold text-stone-900 leading-snug"
                >
                  {title}
                </Typography>
                <Typography className="mt-2 text-sm leading-7 text-stone-500">
                  {text}
                </Typography>
              </Card>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
