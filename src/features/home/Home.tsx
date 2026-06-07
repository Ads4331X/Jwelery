import { Box } from "@mui/material";
import { Hero } from "./components/Hero";
import Header from "../../components/layout/Header";
import { Story } from "./components/Story";
import { GallerySection } from "./components/GallerySection";
import MetalRates from "../../components/shared/MetalRates";
import ContactSection from "./components/ContactSection";
import Footer from "../../components/layout/Footer";

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
