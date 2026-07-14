import { Box, Chip, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types";
import { METAL_LABELS, getPrimaryImage } from "../types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const imageUrl = getPrimaryImage(product);
  const inStock = product.stock > 0;

  return (
    <Box
      onClick={() => navigate(`/products/${product.slug}`)}
      className="group h-full flex flex-col bg-white border border-stone-200 rounded-md overflow-hidden cursor-pointer transition-shadow duration-200 hover:shadow-md"
    >
      <Box className="relative aspect-square bg-stone-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Box className="h-full flex items-center justify-center">
            <Typography className="!text-stone-300 !text-xs">
              No image
            </Typography>
          </Box>
        )}

        {!inStock && (
          <Box className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Typography className="!text-white !text-xs !font-semibold !uppercase !tracking-wide">
              Out of Stock
            </Typography>
          </Box>
        )}

        {product.isDealOfDay && inStock && (
          <Chip
            label="Deal"
            size="small"
            sx={{
              position: "absolute",
              top: 8,
              left: 8,
              height: 22,
              fontSize: "0.65rem",
              fontWeight: 700,
              bgcolor: "#dc2626",
              color: "#fff",
            }}
          />
        )}
      </Box>

      <Box className="flex flex-col flex-1 p-3 gap-1.5">
        <Typography
          component="h3"
          className="!text-sm !font-normal !text-stone-800 !leading-snug line-clamp-2 min-h-[2.5rem]"
        >
          {product.name}
        </Typography>

        {product.reviewCount != null && product.reviewCount > 0 && (
          <Box className="flex items-center gap-1 -mt-1 mb-1">
            <svg
              className="w-3.5 h-3.5 text-amber-500 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <Typography className="!text-[0.7rem] !text-stone-600 !font-medium">
              {product.avgRating} <span className="text-stone-400 font-normal">({product.reviewCount})</span>
            </Typography>
          </Box>
        )}

        <Box className="flex items-center gap-1.5 flex-wrap mt-auto">
          <Chip
            label={METAL_LABELS[product.metalType]}
            size="small"
            sx={{
              height: 20,
              fontSize: "0.6rem",
              bgcolor: "#fef3c7",
              color: "#92400e",
            }}
          />
          <Typography className="!text-[0.7rem] !text-stone-400">
            {product.weightGrams}g
          </Typography>
        </Box>

        {product.computedPrice != null && product.computedPrice > 0 ? (
          <Typography className="!text-lg !font-bold !text-stone-900">
            Rs {Number(product.computedPrice).toLocaleString("en-NP")}
          </Typography>
        ) : (
          <Typography className="!text-[0.75rem] !text-stone-500 italic">
            Price on request
          </Typography>
        )}

        {inStock ? (
          <Typography className="!text-[0.7rem] !text-green-700">
            In stock
          </Typography>
        ) : (
          <Typography className="!text-[0.7rem] !text-red-600">
            Sold out
          </Typography>
        )}
      </Box>
    </Box>
  );
}
