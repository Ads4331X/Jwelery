import { Box, Container } from "@mui/material";
import { ImageStack } from "./ImageStack";

export function Story() {
  return (
    <Container maxWidth="xl">
      <Box className="py-16">
        <Box className="flex flex-col lg:flex-row items-center gap-8 lg:gap-10">
          {" "}
          {/* Left Content */}
          <Box className="flex-1 max-w-2xl">
            {" "}
            <Box
              component="p"
              className="text-amber-500 uppercase tracking-[3px] font-semibold mb-3"
            >
              Our Story
            </Box>
            <Box
              component="h1"
              className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6"
            >
              A Legacy Born in Nepal
            </Box>
            <Box component="p" className="text-gray-600 text-lg leading-8">
              Our journey began with a love for Nepal's culture, craftsmanship,
              and traditions. We created this store to share authentic Nepali
              products that reflect the beauty and spirit of our homeland.
            </Box>
            <Box component="p" className="text-gray-600 text-lg leading-8 mt-4">
              Every item is carefully chosen to celebrate the artistry, quality,
              and heritage of Nepal. We take pride in bringing together
              tradition and modern style while supporting local makers and
              communities.
            </Box>
            {/* Small Decorative Line */}
            <Box className="w-24 h-1 bg-amber-500 rounded-full mt-8" />
          </Box>
          {/* Right Image */}
          <Box className="flex-[1.1] flex justify-center lg:justify-end">
            {" "}
            <Box className="relative">
              {/* Decorative Glow */}
              <Box className="absolute inset-0 bg-amber-200 blur-3xl opacity-30 rounded-full scale-110" />

              {/* Image */}
              <ImageStack />
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
