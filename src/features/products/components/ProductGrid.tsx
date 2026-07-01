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
    <Box className="bg-white border border-stone-200 rounded-md overflow-hidden">
      <Skeleton variant="rectangular" className="aspect-square" animation="wave" />
      <Box className="p-3 space-y-2">
        <Skeleton width="90%" height={14} />
        <Skeleton width="70%" height={14} />
        <Skeleton width="40%" height={20} />
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
      <Box className="rounded-md border border-red-200 bg-red-50 px-5 py-4 text-red-800 text-sm">
        {error}
      </Box>
    );
  }

  if (loading) {
    return (
      <Grid container spacing={1.5}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Grid key={i} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
            <CardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (!products.length) {
    return (
      <Box className="text-center py-16 px-6 rounded-md border border-stone-200 bg-white">
        <Typography component="h3" className="!text-lg !font-semibold !text-stone-900 !mb-2">
          No products found
        </Typography>
        <Typography className="!text-sm !text-stone-500">
          Try a different search or adjust your filters.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={1.5}>
      {products.map((product) => (
        <Grid key={product.id} size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}
