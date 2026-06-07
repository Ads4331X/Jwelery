import { Box } from "@mui/material";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { StorySection } from "./components/StorySection";
import { CraftsmanshipSection } from "./components/CraftsmanshipSection";
import { ValuesSection } from "./components/ValuesSection";
import { CTASection } from "./components/CTASection";

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
