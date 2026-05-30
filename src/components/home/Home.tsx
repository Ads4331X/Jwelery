import { Box } from "@mui/material";
import { Hero } from "./Hero";
import Header from "../layout/Header";
import { Story } from "./Story";
import { GallerySection } from "./GallerySection";
import MetalRates from "../MetalRates";
import ContactSection from "./ContactSection";
import Footer from "../layout/Footer";

export default function Home() {
  return (
    <Box className="overflow-hidden">
      <Header />

      <Hero />
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
        <Story />
      </Box>
      <GallerySection />
      <ContactSection />
      <Footer />
    </Box>
  );
}
