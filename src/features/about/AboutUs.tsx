import { Box } from "@mui/material";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Hero } from "../home/components/Hero";
import MetalRates from "../../components/shared/MetalRates";
import { FeaturedCategories } from "../home/components/GallerySection";
import { StatsSection } from "./components/StatsSection";

import { OurStory } from "./components/StorySection";
import { CraftsmanshipSection } from "./components/CraftsmanshipSection";
import { ValuesSection } from "./components/ValuesSection";
import { CTASection } from "./components/CTASection";
import ContactSection from "../home/components/ContactSection";

export default function AboutUs() {
  return (
    <Box className="bg-[#fafaf7] text-stone-900 overflow-hidden">
      <Header />
      <Hero />
      <MetalRates />
      <FeaturedCategories />
      <StatsSection />
      <OurStory />
      <CraftsmanshipSection />
      <ValuesSection />
      <CTASection />
      <ContactSection />
      <Footer />
    </Box>
  );
}
