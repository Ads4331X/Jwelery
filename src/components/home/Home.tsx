import { Box } from "@mui/material";
import { HomeHero } from "./HomeHero";
import Header from "../layout/Header";
import { OurStory } from "./OurStory";

export default function Home() {
  return (
    <Box>
      <Header />
      <HomeHero />
      <OurStory />
    </Box>
  );
}
