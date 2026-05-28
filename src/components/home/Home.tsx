import { Box } from "@mui/material";
import { HomeHero } from "./HomeHero";
import Header from "../layout/Header";

export default function Home() {
  return (
    <Box>
      <Header />
      <HomeHero />
    </Box>
  );
}
