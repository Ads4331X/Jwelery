import { Box, Chip, Typography } from "@mui/material";
import LazyImage from "../../../components/ui/LazyImage";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Box className="group relative rounded-[20px] overflow-hidden bg-white border border-amber-900/[0.08] cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(180,83,9,0.12)]">
      {/* Image */}
      <Box className="relative overflow-hidden h-64 bg-stone-100">
        {product.image_url ? (
          <Box className="h-full transition-transform duration-700 group-hover:scale-105">
            <LazyImage
              src={product.image_url}
              alt={product.name}
              height={256}
            />
          </Box>
        ) : (
          <Box className="h-full flex items-center justify-center">
            <Typography className="!text-stone-300 !text-xs !uppercase !tracking-widest">
              No image
            </Typography>
          </Box>
        )}

        {/* Badges row */}
        <Box className="absolute top-3.5 left-3.5 flex gap-1.5">
          <Box className="inline-flex items-center px-3 py-1 rounded-full backdrop-blur-md bg-white/85 border border-amber-700/15">
            <Typography className="!text-[0.6rem] !uppercase !tracking-[0.2em] !font-semibold !text-amber-900">
              {product.metal}
            </Typography>
          </Box>
          {product.is_featured && (
            <Box className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-700/90 backdrop-blur-md">
              <Typography className="!text-[0.6rem] !uppercase !tracking-[0.15em] !font-semibold !text-white">
                Featured
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box className="px-5 pt-4 pb-5">
        {/* Gold accent line */}
        <Box
          className="h-[1.5px] rounded-sm mb-3 transition-all duration-300 w-6 group-hover:w-12"
          style={{ background: "linear-gradient(90deg, #b45309, #f59e0b)" }}
        />

        {/* Title + price */}
        <Box className="flex items-start justify-between gap-2 mb-1.5">
          <Typography
            component="h3"
            className="flex-1 !text-[1.05rem] !font-semibold !text-stone-900 !leading-snug"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {product.name}
          </Typography>
          {product.price != null && (
            <Typography className="!text-[0.95rem] !font-bold !text-amber-700 !whitespace-nowrap">
              Rs {Number(product.price).toLocaleString("en-NP")}
            </Typography>
          )}
        </Box>

        {/* Category + status row */}
        <Box className="flex items-center gap-2 mb-2.5">
          <Chip
            label={product.category}
            size="small"
            className="!bg-stone-100 !text-[0.58rem] !uppercase !tracking-[0.15em] !text-stone-500 !font-medium !rounded-full !h-auto !py-0.5 !border-0"
          />
          <Chip
            label={product.status}
            size="small"
            sx={{
              fontSize: "0.58rem",
              height: "auto",
              py: "2px",
              fontWeight: 500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRadius: "9999px",
              border: "none",
              backgroundColor:
                product.status === "Available" ? "#f0fdf4" : "#fef2f2",
              color: product.status === "Available" ? "#15803d" : "#dc2626",
            }}
          />
        </Box>

        {/* Description */}
        {product.description && (
          <Typography className="!text-[0.8rem] !text-black/45 !leading-relaxed !mb-3 line-clamp-2">
            {product.description}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
