// pages/products/ProductDetail.tsx
import { useEffect, useState, useContext, useCallback } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Footer from "../../../components/layout/Footer";
import Header from "../../../components/layout/Header";
import { fetchProducts } from "../../../services/productsApi";
import type { Product } from "../types";
import { METAL_LABELS } from "../types";
import { AuthContext } from "../../auth/context/context";
import { useCart } from "../../../hooks/useCart";

/* ─── payment button helper ─────────────────────────── */
interface PayBtnProps {
  logo: string;
  label: string;
  color: string;
  hoverColor: string;
  textColor?: string;
  onClick: () => void;
  disabled?: boolean;
}

function PayButton({
  logo,
  label,
  color,
  hoverColor,
  textColor = "#fff",
  onClick,
  disabled,
}: PayBtnProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-2xl font-semibold text-sm tracking-wide transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
      style={{ background: color, color: textColor }}
      onMouseEnter={(e) =>
        !disabled && (e.currentTarget.style.background = hoverColor)
      }
      onMouseLeave={(e) =>
        !disabled && (e.currentTarget.style.background = color)
      }
    >
      <span className="text-[0.7rem] font-bold tracking-widest uppercase">
        {logo}
      </span>
      <span>{label}</span>
    </button>
  );
}

/* ─── image gallery ──────────────────────────────────── */
function ImageGallery({ images }: { images: Product["images"] }) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [active, setActive] = useState(
    sorted.find((i) => i.isPrimary)?.url ?? sorted[0]?.url ?? "",
  );

  if (!sorted.length) {
    return (
      <Box className="aspect-square rounded-[24px] bg-stone-100 flex items-center justify-center">
        <Typography className="!text-stone-300 !text-xs !uppercase !tracking-widest">
          No image
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col gap-3">
      {/* Main image */}
      <Box className="relative aspect-square rounded-[24px] overflow-hidden bg-stone-50 border border-amber-900/[0.07]">
        <img
          src={active}
          alt="Product"
          className="w-full h-full object-cover transition-opacity duration-300"
        />
        {/* Subtle gradient overlay at bottom */}
        <Box
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(28,25,23,0.08), transparent)",
          }}
        />
      </Box>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <Box className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(img.url)}
              className={[
                "shrink-0 w-16 h-16 rounded-[12px] overflow-hidden border-2 transition-all duration-200 cursor-pointer",
                active === img.url
                  ? "border-amber-600 shadow-[0_0_0_3px_rgba(180,83,9,0.15)]"
                  : "border-transparent opacity-60 hover:opacity-90",
              ].join(" ")}
            >
              <img
                src={img.url}
                alt={img.altText ?? ""}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </Box>
      )}
    </Box>
  );
}

/* ─── main component ─────────────────────────────────── */
export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState<{
    open: boolean;
    msg: string;
    severity: "success" | "error" | "info";
  }>({ open: false, msg: "", severity: "success" });

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        const found = data.find((p) => p.slug === slug);
        if (!found) setError("Product not found.");
        else setProduct(found);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : String(err)),
      )
      .finally(() => setLoading(false));
  }, [slug]);

  const requireAuth = useCallback(
    (action: () => void) => {
      if (!auth?.user) {
        navigate("/login", {
          state: { from: { pathname: `/products/${slug}` } },
        });
        return;
      }
      action();
    },
    [auth, navigate, slug],
  );

  const handleAddToCart = useCallback(() => {
    requireAuth(() => {
      if (!product) return;
      addToCart(product, qty);
      setToast({
        open: true,
        msg: `${product.name} added to cart`,
        severity: "success",
      });
    });
  }, [requireAuth, product, qty, addToCart]);

  const handleBuyNow = useCallback(
    (method: "esewa" | "khalti" | "cod") => {
      requireAuth(() => {
        if (!product) return;
        addToCart(product, qty);
        // Pass chosen payment method to checkout
        navigate("/checkout", { state: { paymentMethod: method } });
      });
    },
    [requireAuth, product, qty, addToCart, navigate],
  );

  if (loading) {
    return (
      <Box className="min-h-screen bg-[#fafaf7] flex flex-col">
        <Header />
        <Box className="flex-1 flex items-center justify-center">
          <CircularProgress sx={{ color: "#b45309" }} />
        </Box>
        <Footer />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box className="min-h-screen bg-[#fafaf7] flex flex-col">
        <Header />
        <Box className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
          <Typography className="!text-stone-400 !text-sm">
            {error ?? "Product not found."}
          </Typography>
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="text-amber-700 text-sm underline"
          >
            Back to collection
          </button>
        </Box>
        <Footer />
      </Box>
    );
  }

  const inStock = product.stock > 0;
  const metalLabel = METAL_LABELS[product.metalType];

  return (
    <Box className="min-h-screen bg-[#fafaf7]">
      <Header />

      <Box className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Back + Breadcrumb — unified header row */}
        <Box className="flex items-center gap-1 mb-8 -ml-2">
          <IconButton
            onClick={() => navigate(-1)}
            size="small"
            className="!text-amber-900/50 hover:!text-amber-800 hover:!bg-amber-50 !rounded-full !mr-1"
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
          </IconButton>

          <Box className="flex items-center gap-1.5 text-[0.72rem] tracking-wide min-w-0">
            <NavLink
              to="/products"
              className="text-stone-400 hover:text-amber-700 transition-colors shrink-0"
            >
              Collection
            </NavLink>
            <span className="text-stone-300 shrink-0">/</span>
            <span className="text-amber-800 font-semibold truncate">
              {product.name}
            </span>
          </Box>
        </Box>

        {/* Grid: image | info */}
        <Box className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ── Left: Gallery ── */}
          <ImageGallery images={product.images} />

          {/* ── Right: Info ── */}
          <Box className="flex flex-col">
            {/* Badges */}
            <Box className="flex flex-wrap gap-2 mb-4">
              <Box className="inline-flex items-center px-3 py-1 rounded-full border border-amber-700/20 bg-amber-50">
                <Typography className="!text-[0.6rem] !uppercase !tracking-[0.2em] !font-semibold !text-amber-800">
                  {metalLabel}
                  {product.purity ? ` · ${product.purity}` : ""}
                </Typography>
              </Box>
              {product.isFeatured && (
                <Box className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-700">
                  <Typography className="!text-[0.6rem] !uppercase !tracking-[0.15em] !font-semibold !text-white">
                    Featured
                  </Typography>
                </Box>
              )}
              {product.isDealOfDay && (
                <Box className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-700">
                  <Typography className="!text-[0.6rem] !uppercase !tracking-[0.15em] !font-semibold !text-white">
                    Deal of the Day
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Title */}
            <Typography
              component="h1"
              className="!text-3xl sm:!text-[2.2rem] !font-semibold !text-stone-900 !leading-tight !mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {product.name}
            </Typography>

            {/* Gold accent */}
            <Box
              className="h-[2px] w-12 rounded-sm mb-5"
              style={{ background: "linear-gradient(90deg, #b45309, #f59e0b)" }}
            />

            {/* Price */}
            {product.computedPrice != null ? (
              <Box className="mb-5">
                <Typography className="!text-3xl !font-bold !text-amber-700">
                  Rs {Number(product.computedPrice).toLocaleString("en-NP")}
                </Typography>
                <Typography className="!text-[0.65rem] !text-stone-400 !mt-0.5">
                  Price calculated at today's gold rate
                </Typography>
              </Box>
            ) : (
              <Typography className="!text-sm !text-stone-400 !mb-5 !italic">
                Price on request
              </Typography>
            )}

            {/* Details row */}
            <Box className="flex flex-wrap gap-2 mb-6">
              <Chip
                label={product.category?.name ?? "Jewellery"}
                size="small"
                className="!bg-stone-100 !text-[0.6rem] !uppercase !tracking-[0.15em] !text-stone-500 !font-medium !rounded-full !h-auto !py-1"
              />
              <Chip
                label={`${product.weightGrams}g`}
                size="small"
                className="!bg-stone-100 !text-[0.6rem] !uppercase !tracking-[0.15em] !text-stone-500 !font-medium !rounded-full !h-auto !py-1"
              />
              <Chip
                label={inStock ? `In stock (${product.stock})` : "Out of stock"}
                size="small"
                sx={{
                  fontSize: "0.6rem",
                  height: "auto",
                  py: "4px",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  borderRadius: "9999px",
                  backgroundColor: inStock ? "#f0fdf4" : "#fef2f2",
                  color: inStock ? "#15803d" : "#dc2626",
                }}
              />
            </Box>

            {/* Description */}
            {product.description && (
              <Typography className="!text-[0.88rem] !text-stone-600 !leading-relaxed !mb-6">
                {product.description}
              </Typography>
            )}

            <Divider className="!border-amber-900/[0.07] !mb-6" />

            {/* Quantity */}
            <Box className="flex items-center gap-4 mb-6">
              <Typography className="!text-[0.6rem] !uppercase !tracking-[0.2em] !text-stone-400 !font-semibold w-20">
                Quantity
              </Typography>
              <Box className="flex items-center gap-2 border border-amber-900/15 rounded-full px-2 py-1">
                <IconButton
                  size="small"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="!text-amber-900 !w-7 !h-7"
                >
                  <RemoveIcon sx={{ fontSize: 14 }} />
                </IconButton>
                <Typography className="!w-6 !text-center !font-semibold !text-stone-900 !text-sm">
                  {qty}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  disabled={qty >= product.stock}
                  className="!text-amber-900 !w-7 !h-7"
                >
                  <AddIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            </Box>

            {/* Add to cart */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!inStock}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl text-sm font-bold uppercase tracking-widest text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer mb-3"
              style={{
                background: inStock
                  ? "linear-gradient(135deg, #92400e, #b45309)"
                  : "#d4d4d4",
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
              Add to Cart
            </button>

            {/* Payment methods label */}
            <Typography className="!text-[0.58rem] !uppercase !tracking-[0.2em] !text-stone-400 !text-center !mb-2.5">
              Or buy directly with
            </Typography>

            {/* Payment buttons */}
            <Box className="flex gap-2">
              <PayButton
                logo="eSewa"
                label="Pay"
                color="#4CAF50"
                hoverColor="#43A047"
                onClick={() => handleBuyNow("esewa")}
                disabled={!inStock}
              />
              <PayButton
                logo="Khalti"
                label="Pay"
                color="#5C2D91"
                hoverColor="#4a2275"
                onClick={() => handleBuyNow("khalti")}
                disabled={!inStock}
              />
              <PayButton
                logo="COD"
                label="Cash"
                color="#1c1917"
                hoverColor="#292524"
                onClick={() => handleBuyNow("cod")}
                disabled={!inStock}
              />
            </Box>

            {!auth?.user && (
              <Typography className="!text-[0.68rem] !text-center !text-stone-400 !mt-3">
                You'll be asked to{" "}
                <NavLink
                  to="/login"
                  className="text-amber-700 font-semibold underline"
                >
                  sign in
                </NavLink>{" "}
                before checkout.
              </Typography>
            )}

            <Divider className="!border-amber-900/[0.07] !mt-6 !mb-5" />

            {/* Trust badges */}
            <Box className="flex flex-col sm:flex-row gap-3">
              {[
                {
                  icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
                  text: "Certified purity",
                },
                {
                  icon: <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />,
                  text: "Free delivery in Kathmandu",
                },
                {
                  icon: <ShoppingBagOutlinedIcon sx={{ fontSize: 16 }} />,
                  text: "Easy returns within 7 days",
                },
              ].map(({ icon, text }) => (
                <Box
                  key={text}
                  className="flex items-center gap-2 text-amber-900/60"
                >
                  {icon}
                  <Typography className="!text-[0.7rem] !text-stone-500">
                    {text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <Footer />

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast((t) => ({ ...t, open: false }))}
          sx={{ borderRadius: "12px", fontSize: "0.82rem" }}
        >
          {toast.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
