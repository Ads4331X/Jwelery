import { Box, Container, Typography } from "@mui/material";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function AboutUs() {
  return (
    <Box>
      <Header />
      <Container maxWidth="lg">
        <Box className="mt-32 mb-16">
          <Typography variant="h3" component="h1" className="mb-4 font-bold">
            About Us
          </Typography>
          <Typography variant="body1" className="text-gray-600 leading-8">
            Our journey began with a passion for crafting timeless jewelry
            pieces that celebrate heritage and tradition. Since 2017, we've been
            dedicated to creating premium handcrafted gold and silver jewelry
            that reflects the beauty and spirit of Nepalese craftsmanship.
          </Typography>
          <Typography variant="body1" className="text-gray-600 leading-8 mt-4">
            Every piece in our collection is meticulously crafted by skilled
            artisans who bring their expertise and passion to each design. We
            believe in quality, authenticity, and creating jewelry that lasts
            generations.
          </Typography>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
