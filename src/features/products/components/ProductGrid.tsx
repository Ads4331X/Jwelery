// components/ProductGrid.tsx
import { Box, Grid, Skeleton, Typography } from "@mui/material";
import ProductCard from "./ProductCard";
import type { Product } from "../types";
interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
}

function CardSkeleton() {
  return (
    <Box className="rounded-[20px] overflow-hidden border border-amber-900/[0.06] bg-white">
      <Skeleton variant="rectangular" height={256} animation="wave" />
      <Box className="px-5 py-4 space-y-2">
        <Skeleton width="30%" height={10} />
        <Skeleton width="85%" height={18} />
        <Skeleton width="45%" height={18} />
        <Skeleton width="75%" height={12} />
        <Skeleton width="65%" height={12} />
      </Box>
    </Box>
  );
}

export default function ProductGrid({
  products,
  loading,
  error,
}: ProductGridProps) {
  if (error) {
    return (
      <Box className="rounded-2xl border border-amber-700/20 bg-amber-50 px-5 py-4 text-amber-900 text-sm">
        {error}
      </Box>
    );
  }

  if (loading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, lg: 4 }}>
            <CardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!products.length) {
    return (
      <Box className="text-center py-20 px-6 rounded-[20px] border border-amber-900/[0.08] bg-white">
        {/* Decorative dots */}
        <Box className="flex justify-center items-center gap-2 mb-5">
          <Box
            className="w-8 h-px"
            style={{
              background: "linear-gradient(to right, transparent, #f59e0b)",
            }}
          />
          <Box className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <Box className="w-1.5 h-1.5 rounded-full border border-amber-400" />
          <Box className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <Box
            className="w-8 h-px"
            style={{
              background: "linear-gradient(to left, transparent, #f59e0b)",
            }}
          />
        </Box>
        <Typography
          component="h3"
          className="!text-2xl !font-semibold !text-stone-900 !mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          No Pieces Found
        </Typography>
        <Typography className="!text-sm !text-black/40 max-w-xs mx-auto">
          Try a different search or adjust your filters.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 12, sm: 6, lg: 4 }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
