import { Box, Container, Typography } from "@mui/material";
import { SectionLabel, Bullet } from "./shared";
import heroPic from "../../../assets/images/common/image.png";

const PROMISES = [
  "Refined finishing with a focus on comfort, symmetry, and durability.",
  "Thoughtful material selection with an emphasis on authenticity.",
  "A premium buying experience grounded in clarity and care.",
];

export function CraftsmanshipSection() {
  return (
    <Box className="border-y border-amber-900/5 bg-white">
      <Container maxWidth="xl" className="py-16 sm:py-24">
        <Box className="overflow-hidden rounded-2xl border border-amber-900/8 shadow-[0_12px_40px_rgba(0,0,0,0.05)]">
          <Box className="grid md:grid-cols-2">
            {/* Image side */}
            <Box className="group relative overflow-hidden bg-white">
              <Box
                component="img"
                src={heroPic}
                alt="Materials and Quality"
                className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
              />

              <Box className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

              <Box className="absolute bottom-0 left-0 p-5 sm:p-8">
                <Typography className="text-[0.55rem] sm:text-[0.6rem] uppercase tracking-[0.4em] text-white/70">
                  Materials
                </Typography>

                <Typography className="mt-2 text-xl sm:text-2xl md:text-3xl font-semibold text-white">
                  Beauty begins with the right foundation.
                </Typography>
              </Box>
            </Box>

            {/* Content side */}
            <Box className="flex flex-col justify-center gap-7 bg-[#fffdf9] p-8 sm:p-10">
              <Box>
                <SectionLabel>Materials and Quality</SectionLabel>
                <Typography
                  component="h3"
                  className="text-3xl font-semibold leading-tight"
                >
                  Selected for character, finish, and longevity.
                </Typography>
                <Typography className="mt-4 text-sm leading-[1.9] text-stone-500">
                  Each choice supports durability, clarity, and a polished final
                  appearance that endures.
                </Typography>
              </Box>
              <Box className="flex flex-col gap-3">
                {PROMISES.map((t) => (
                  <Bullet key={t} text={t} />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
