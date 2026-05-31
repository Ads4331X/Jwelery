import { Box } from "@mui/material";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ContactSection from "../home/ContactSection";
import { ContactHero } from "./ContactHero";
import { ContactSocialSection } from "./ContactSocialSection";

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
