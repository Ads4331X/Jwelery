import { Box, Typography } from "@mui/material";

export default function LoginHeader() {
  return (
    <Box className="text-center mb-8">
      <Typography
        variant="overline"
        className="text-stone-400 tracking-widest text-xs"
      >
        Admin Panel
      </Typography>
      <Typography variant="h5" className="font-semibold text-stone-800 mt-1">
        Pashupatisunchadi Pasal{" "}
      </Typography>
    </Box>
  );
}
