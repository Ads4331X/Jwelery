import { Box } from "@mui/material";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ContactSection from "../components/home/ContactSection";

export default function Contact() {
  return (
    <Box>
      <Header />
      <Box className="mt-20">
        <ContactSection />
      </Box>
      <Footer />
    </Box>
  );
}
