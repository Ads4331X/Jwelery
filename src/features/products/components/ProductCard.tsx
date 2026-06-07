// components/ProductCard.tsx
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
      <Box className="relative overflow-hidden h-64">
        <Box className="h-full transition-transform duration-700 group-hover:scale-105">
          <LazyImage src={product.image} alt={product.title} height={256} />
        </Box>

        {/* Tag badge */}
        {product.tags[0] && (
          <Box className="absolute top-3.5 left-3.5 inline-flex items-center px-3 py-1 rounded-full backdrop-blur-md bg-white/85 border border-amber-700/15">
            <Typography className="!text-[0.6rem] !uppercase !tracking-[0.2em] !font-semibold !text-amber-900">
              {product.tags[0]}
            </Typography>
          </Box>
        )}
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
            {product.title}
          </Typography>
          <Typography className="!text-[0.95rem] !font-bold !text-amber-700 !whitespace-nowrap">
            {product.price}
          </Typography>
        </Box>

        {/* Description */}
        <Typography className="!text-[0.8rem] !text-black/45 !leading-relaxed !mb-3 !min-h-[48px] line-clamp-2">
          {product.shortDescription}
        </Typography>

        {/* Tags */}
        {product.tags.length > 1 && (
          <Box className="flex flex-wrap gap-1.5 mb-4">
            {product.tags.slice(1, 4).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                className="!bg-amber-50 !border !border-amber-700/12 !text-[0.58rem] !uppercase !tracking-[0.15em] !text-amber-900 !font-medium !rounded-full !h-auto !py-0.5"
              />
            ))}
          </Box>
        )}

        {/* CTA */}
        <Box className="inline-flex items-center gap-1.5 opacity-40 translate-y-0.5 transition-all duration-250 group-hover:opacity-100 group-hover:translate-y-0">
          <Typography className="!text-[0.62rem] !uppercase !tracking-[0.25em] !font-semibold !text-amber-700">
            View Details
          </Typography>
          <Typography className="!text-amber-700 !text-sm !leading-none">
            →
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
