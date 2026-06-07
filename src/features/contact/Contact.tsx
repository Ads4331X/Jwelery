import { Box } from "@mui/material";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ContactSection from "../home/components/ContactSection";
import { ContactHero } from "./components/ContactHero";
import { ContactSocialSection } from "./components/ContactSocialSection";

export default function Contact() {
  return (
    <Box>
      <Header />
      <ContactHero />
      <ContactSection />
      <ContactSocialSection />
      <Footer />
    </Box>
  );
}
