import { Box } from "@mui/material";
export function HomeHero() {
  return (
    <Box className={` flex-1 justify-center items-center `}>
      <Box component={"h1"}> Crafting Timeless Elegance</Box>
      <Box component={"p"}>
        {" "}
        Premium handcrafted gold & silver jewelry designed with trust, purity,
        and luxury. Each piece tells a story of heritage and artisanal mastery.
      </Box>
    </Box>
  );
}
