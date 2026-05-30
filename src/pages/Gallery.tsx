import { Box, Container, Typography } from "@mui/material";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function Gallery() {
  return (
    <Box>
      <Header />
      <Container maxWidth="lg">
        <Box className="mt-32 mb-16">
          <Typography variant="h3" component="h1" className="mb-4 font-bold">
            Gallery
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Browse our stunning collection of jewelry pieces. Each image
            showcases the craftsmanship and attention to detail that goes into
            every creation.
          </Typography>
        </Box>
        {/* Gallery grid will be added here */}
      </Container>
      <Footer />
    </Box>
  );
}
