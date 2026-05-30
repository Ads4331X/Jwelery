import { Box } from "@mui/material";
import { HomeHero } from "./HomeHero";
import Header from "../layout/Header";
import { OurStory } from "./OurStory";
import { HomeGallery } from "./HomeGallery";
import MetalRates from "../MetalRates";
import HomeContact from "./HomeContact";

export default function Home() {
  return (
    <Box className="overflow-hidden">
      <Header />

      <HomeHero />
      <MetalRates />

      {/* Responsive spacing */}
      <Box
        className="
          pt-4
          sm:pt-6
          md:pt-8
          lg:pt-10
        "
      >
        <OurStory />
      </Box>
      <HomeGallery />
      <HomeContact />
    </Box>
  );
}
