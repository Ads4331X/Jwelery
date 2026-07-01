import { Box, Divider, Typography, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { useContext } from "react";
import { AuthContext } from "../auth/context/context";

const SHIPPING_FLAT = 0;

function formatMoney(n: number) {
  try {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `Rs. ${Math.round(n)}`;
  }
}

function getPrimaryImage(
  images?: Array<{ url?: string; isPrimary?: boolean }>,
) {
  if (!images?.length) return null;
  return images.find((i) => i.isPrimary)?.url ?? images[0]?.url ?? null;
}

export default function Cart() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    items,
    totalPrice,
    updateQty,
    removeFromCart,
    clearCart,
    totalItems,
  } = useCart();

  const subtotal = totalPrice;
  const shipping = SHIPPING_FLAT;
  const total = subtotal + shipping;
  const isEmpty = items.length === 0;

  return (
    <Box className="min-h-screen bg-[#fafaf7]">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
        {/* Back button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-amber-900/60 hover:text-amber-700 text-sm font-medium tracking-wide mb-8 transition-colors duration-200 cursor-pointer"
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Back
        </button>

        {/* Page title */}
        <Box className="mb-8">
          <Typography
            variant="overline"
            sx={{
              color: "#b45309",
              letterSpacing: "0.3em",
              fontSize: "0.65rem",
            }}
          >
            Anand Jewellers
          </Typography>
          <Box className="flex items-baseline gap-3 mt-1">
            <Typography
              component="h1"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: 26, md: 32 },
                fontWeight: 600,
                color: "#1c1917",
              }}
            >
              Your Cart
            </Typography>
            {!isEmpty && (
              <Typography sx={{ color: "#78716c", fontSize: "0.85rem" }}>
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </Typography>
            )}
          </Box>
          <Box
            className="h-[2px] w-12 rounded-sm mt-3"
            style={{ background: "linear-gradient(90deg, #b45309, #f59e0b)" }}
          />
        </Box>

        {/* Empty state */}
        {isEmpty ? (
          <Box className="text-center py-24 px-6 rounded-[24px] border border-amber-900/[0.08] bg-white">
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
            <ShoppingBagOutlinedIcon
              sx={{ fontSize: 40, color: "#d4b896", mb: 2 }}
            />
            <Typography
              component="h3"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.4rem",
                fontWeight: 600,
                color: "#1c1917",
                mb: 1,
              }}
            >
              Your cart is empty
            </Typography>
            <Typography sx={{ color: "#78716c", fontSize: "0.85rem", mb: 4 }}>
              Discover our handcrafted jewellery collection.
            </Typography>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white tracking-wide transition-all duration-200 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #92400e, #b45309)",
              }}
            >
              Browse Collection
            </button>
          </Box>
        ) : (
          <Box
            sx={{
              display: { xs: "block", lg: "grid" },
              gridTemplateColumns: "1fr 360px",
              gap: 4,
              alignItems: "start",
            }}
          >
            {/* Cart items */}
            <Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {items.map((it) => {
                  const p = it.product;
                  const imageUrl = getPrimaryImage(
                    (p.images ?? []) as Array<{
                      url?: string;
                      isPrimary?: boolean;
                    }>,
                  );

                  return (
                    <Box
                      key={p.id}
                      className="bg-white rounded-[20px] border border-amber-900/[0.08] p-4 flex gap-4 items-center transition-shadow duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
                    >
                      {/* Image */}
                      <Box className="shrink-0 w-20 h-20 rounded-[14px] overflow-hidden bg-stone-100">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Box className="w-full h-full flex items-center justify-center">
                            <Typography className="!text-stone-300 !text-[0.5rem] !uppercase !tracking-widest">
                              No image
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Info */}
                      <Box className="flex-1 min-w-0">
                        <Typography
                          sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            color: "#1c1917",
                            lineHeight: 1.3,
                          }}
                        >
                          {p.name}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#78716c",
                            fontSize: "0.72rem",
                            mt: 0.3,
                            textTransform: "uppercase",
                            letterSpacing: "0.12em",
                          }}
                        >
                          {p.metalType ?? "Metal"} · {p.weightGrams ?? ""}g
                        </Typography>

                        {/* Qty controls */}
                        <Box className="flex items-center gap-2 mt-2.5">
                          <Box className="flex items-center gap-1 border border-amber-900/15 rounded-full px-1.5 py-0.5">
                            <IconButton
                              size="small"
                              onClick={() => updateQty(p.id, it.qty - 1)}
                              disabled={it.qty <= 1}
                              sx={{ width: 24, height: 24, color: "#78350f" }}
                            >
                              <RemoveIcon sx={{ fontSize: 13 }} />
                            </IconButton>
                            <Typography
                              sx={{
                                minWidth: 20,
                                textAlign: "center",
                                fontSize: "0.82rem",
                                fontWeight: 700,
                                color: "#1c1917",
                              }}
                            >
                              {it.qty}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => updateQty(p.id, it.qty + 1)}
                              disabled={it.qty >= (p.stock ?? 10)}
                              sx={{ width: 24, height: 24, color: "#78350f" }}
                            >
                              <AddIcon sx={{ fontSize: 13 }} />
                            </IconButton>
                          </Box>

                          <Tooltip title="Remove item">
                            <IconButton
                              size="small"
                              onClick={() => removeFromCart(p.id)}
                              sx={{
                                color: "#dc2626",
                                opacity: 0.7,
                                "&:hover": { opacity: 1 },
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 17 }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>

                      {/* Price */}
                      <Box className="text-right shrink-0">
                        {p.computedPrice != null ? (
                          <>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: "#b45309",
                                fontSize: "0.95rem",
                              }}
                            >
                              {formatMoney(p.computedPrice * it.qty)}
                            </Typography>
                            {it.qty > 1 && (
                              <Typography
                                sx={{ color: "#78716c", fontSize: "0.68rem" }}
                              >
                                {formatMoney(p.computedPrice)} each
                              </Typography>
                            )}
                          </>
                        ) : (
                          <Typography
                            sx={{
                              color: "#78716c",
                              fontSize: "0.75rem",
                              fontStyle: "italic",
                            }}
                          >
                            Price on request
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              {/* Clear cart */}
              <Box className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[0.7rem] uppercase tracking-widest text-stone-400 hover:text-red-500 underline transition-colors duration-200 cursor-pointer"
                >
                  Clear cart
                </button>
              </Box>
            </Box>

            {/* Order summary */}
            <Box className="bg-white rounded-[20px] border border-amber-900/[0.08] p-6 sticky top-24 mt-6 lg:mt-0">
              <Typography
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  color: "#1c1917",
                  mb: 3,
                }}
              >
                Order Summary
              </Typography>

              <Box className="flex justify-between mb-2">
                <Typography sx={{ color: "#78716c", fontSize: "0.85rem" }}>
                  Subtotal ({totalItems} items)
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#1c1917",
                  }}
                >
                  {formatMoney(subtotal)}
                </Typography>
              </Box>

              <Box className="flex justify-between mb-2">
                <Typography sx={{ color: "#78716c", fontSize: "0.85rem" }}>
                  Shipping
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    color: "#16a34a",
                  }}
                >
                  Free
                </Typography>
              </Box>

              <Divider sx={{ my: 2.5, borderColor: "rgba(180,83,9,0.08)" }} />

              <Box className="flex justify-between items-baseline mb-5">
                <Typography sx={{ fontWeight: 700, color: "#1c1917" }}>
                  Total
                </Typography>
                <Typography
                  sx={{ fontWeight: 800, fontSize: "1.2rem", color: "#b45309" }}
                >
                  {formatMoney(total)}
                </Typography>
              </Box>

              <button
                type="button"
                onClick={() => {
                  if (!auth?.user) {
                    navigate("/login", { state: { from: { pathname: "/cart" } } });
                  } else {
                    navigate("/checkout");
                  }
                }}
                className="w-full py-3.5 rounded-full text-sm font-bold uppercase tracking-widest text-white transition-all duration-200 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #92400e, #b45309)",
                }}
              >
                {auth?.user ? "Proceed to Checkout" : "Sign in to Checkout"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="w-full mt-3 py-2.5 rounded-full text-[0.72rem] font-semibold uppercase tracking-widest text-amber-900 border border-amber-900/15 hover:border-amber-700 hover:bg-amber-50 transition-all duration-200 cursor-pointer"
              >
                Continue Shopping
              </button>

              <Typography
                sx={{
                  mt: 3,
                  color: "#78716c",
                  fontSize: "0.68rem",
                  textAlign: "center",
                }}
              >
                Free delivery within Kathmandu Valley
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
