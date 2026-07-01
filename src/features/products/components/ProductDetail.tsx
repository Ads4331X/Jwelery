import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

// Minimal implementation to unblock routing.
// Hook this up to your existing products API when ready.
export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();

  const title = useMemo(() => {
    if (!slug) return "Product";
    return slug
      .split("-")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }, [slug]);

  return (
    <Box className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10">
      <Typography
        component="h1"
        className="!text-stone-900 !font-semibold"
        sx={{ fontSize: { xs: 22, md: 28 } }}
      >
        {title}
      </Typography>
      <Typography className="!text-stone-600" sx={{ mt: 1.5 }}>
        Product detail page (slug: {slug ?? "unknown"}).
      </Typography>
    </Box>
  );
}
