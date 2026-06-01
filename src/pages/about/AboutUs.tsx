import { Box } from "@mui/material";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { HeroSection } from "./HeroSection";
import { StatsSection } from "./StatsSection";
import { StorySection } from "./StorySection";
import { CraftsmanshipSection } from "./CraftsmanshipSection";
import { ValuesSection } from "./ValuesSection";
import { CTASection } from "./CTASection";

export default function AboutUs() {
  return (
    <Box className="bg-[#fafaf7] text-stone-900">
      <Header />

      <HeroSection />
      <StatsSection />
      <StorySection />
      <CraftsmanshipSection />
      <ValuesSection />
      <CTASection />

      <Footer />
    </Box>
  );
}
