import { Box, Container, Typography } from "@mui/material";
import { ImageStack } from "../../home/components/ImageStack";

const PILLARS = [
  {
    n: "01",
    title: "Heritage Design",
    text: "Drawing from timeless Nepali forms and goldsmithing traditions.",
  },
  {
    n: "02",
    title: "Careful Selection",
    text: "Every piece reviewed for clarity, finish, and balance.",
  },
  {
    n: "03",
    title: "Made to Last",
    text: "Crafted to remain elegant across seasons and generations.",
  },
  {
    n: "04",
    title: "Personal Service",
    text: "Guided with patience, transparency, and genuine care.",
  },
];

export function OurStory() {
  return (
    <Box
      sx={{ bgcolor: "#fafaf7", borderTop: "1px solid rgba(180,83,9,0.06)" }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 10, sm: 16 } }}>
        <Box className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — text */}
          <Box>
            <Box className="flex items-center gap-3 mb-4">
              <Box className="w-6 h-px bg-amber-600" />
              <Typography
                sx={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.45em",
                  textTransform: "uppercase",
                  color: "#b45309",
                  fontWeight: 600,
                }}
              >
                Our Story
              </Typography>
            </Box>

            <Typography
              component="h2"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: "2rem", sm: "2.6rem" },
                fontWeight: 600,
                color: "#1c1917",
                lineHeight: 1.15,
                mb: 3,
              }}
            >
              A Legacy Born <br />
              in Nepal
            </Typography>

            <Typography
              sx={{
                fontSize: "0.95rem",
                lineHeight: 1.9,
                color: "#78716c",
                mb: 2,
              }}
            >
              Our journey began with a love for Nepal's culture, craftsmanship,
              and traditions — sharing authentic handcrafted pieces that carry
              the spirit of our homeland.
            </Typography>

            <Typography
              sx={{
                fontSize: "0.95rem",
                lineHeight: 1.9,
                color: "#78716c",
                mb: 6,
              }}
            >
              Every item is chosen to celebrate artistry and heritage while
              supporting local makers. Established in 2003, Anand Jewellers has
              spent over two decades building trust one piece at a time.
            </Typography>

            {/* Pillars grid */}
            <Box className="grid grid-cols-2 gap-3">
              {PILLARS.map(({ n, title, text }) => (
                <Box
                  key={n}
                  className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5"
                  sx={{
                    bgcolor: "#fff",
                    border: "1px solid rgba(180,83,9,0.08)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                      color: "#b45309",
                      mb: 1,
                    }}
                  >
                    {n}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#1c1917",
                      mb: 0.5,
                    }}
                  >
                    {title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.78rem",
                      lineHeight: 1.7,
                      color: "#78716c",
                    }}
                  >
                    {text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right — image stack */}
          <Box className="flex justify-center lg:justify-end">
            <Box className="relative">
              <Box className="absolute inset-0 bg-amber-200 blur-3xl opacity-25 rounded-full scale-110" />
              <ImageStack />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
