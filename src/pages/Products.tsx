import { Box, Container, Typography } from "@mui/material";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function Products() {
  return (
    <Box>
      <Header />
      <Container maxWidth="lg">
        <Box className="mt-32 mb-16">
          <Typography variant="h3" component="h1" className="mb-4 font-bold">
            Our Products
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Explore our exclusive collection of handcrafted gold and silver
            jewelry. Each piece is carefully crafted with precision and passion.
          </Typography>
        </Box>
        {/* Product sections will be added here */}
      </Container>
      <Footer />
    </Box>
  );
}
