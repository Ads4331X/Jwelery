import { Box, Chip, Divider, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { useNavigate } from "react-router-dom";

type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

type OrderItem = {
  id: string;
  name: string;
  qty: number;
  price?: number | null;
  imageUrl?: string | null;
};

type Order = {
  id: string;
  placedAt: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-NP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

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

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; color: string }
> = {
  Pending: { label: "Pending", bg: "rgba(245,158,11,0.12)", color: "#b45309" },
  Confirmed: {
    label: "Confirmed",
    bg: "rgba(59,130,246,0.12)",
    color: "#2563eb",
  },
  Shipped: { label: "Shipped", bg: "rgba(168,85,247,0.12)", color: "#7c3aed" },
  Delivered: {
    label: "Delivered",
    bg: "rgba(34,197,94,0.12)",
    color: "#16a34a",
  },
  Cancelled: {
    label: "Cancelled",
    bg: "rgba(239,68,68,0.12)",
    color: "#dc2626",
  },
};

export default function Orders() {
  const navigate = useNavigate();

  // Replace with real API fetch later
  const orders: Order[] = [];
  const hasOrders = orders.length > 0;

  return (
    <Box className="min-h-screen bg-[#fafaf7]">
      <Box className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
        {/* Back */}
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
          <Typography
            component="h1"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: 26, md: 32 },
              fontWeight: 600,
              color: "#1c1917",
              mt: 0.5,
            }}
          >
            My Orders
          </Typography>
          <Box
            className="h-[2px] w-12 rounded-sm mt-3"
            style={{ background: "linear-gradient(90deg, #b45309, #f59e0b)" }}
          />
        </Box>

        {/* Empty state */}
        {!hasOrders ? (
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
            <ReceiptLongOutlinedIcon
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
              No orders yet
            </Typography>
            <Typography sx={{ color: "#78716c", fontSize: "0.85rem", mb: 4 }}>
              Once you place an order, it will appear here.
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[...orders]
              .sort((a, b) => b.placedAt.localeCompare(a.placedAt))
              .map((o) => {
                const cfg = STATUS_CONFIG[o.status];
                return (
                  <Box
                    key={o.id}
                    className="bg-white rounded-[20px] border border-amber-900/[0.08] p-5 transition-shadow duration-200 hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
                  >
                    {/* Order header */}
                    <Box className="flex items-start justify-between gap-3 mb-4">
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 600,
                            fontSize: "0.95rem",
                            color: "#1c1917",
                          }}
                        >
                          Order #{o.id.slice(0, 8).toUpperCase()}
                        </Typography>
                        <Typography
                          sx={{
                            color: "#78716c",
                            fontSize: "0.72rem",
                            mt: 0.3,
                          }}
                        >
                          {formatDate(o.placedAt)}
                        </Typography>
                      </Box>
                      <Chip
                        label={cfg.label}
                        size="small"
                        sx={{
                          bgcolor: cfg.bg,
                          color: cfg.color,
                          fontWeight: 700,
                          fontSize: "0.65rem",
                          letterSpacing: "0.08em",
                          borderRadius: "999px",
                          height: "auto",
                          py: "3px",
                        }}
                      />
                    </Box>

                    <Divider
                      sx={{ borderColor: "rgba(180,83,9,0.07)", mb: 3 }}
                    />

                    {/* Items */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mb: 3,
                      }}
                    >
                      {o.items.map((it) => (
                        <Box key={it.id} className="flex items-center gap-3">
                          <Box className="w-12 h-12 rounded-[10px] overflow-hidden bg-stone-100 shrink-0">
                            {it.imageUrl ? (
                              <img
                                src={it.imageUrl}
                                alt={it.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Box className="w-full h-full flex items-center justify-center">
                                <Typography className="!text-stone-300 !text-[0.45rem] !uppercase !tracking-widest">
                                  No img
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          <Box className="flex-1 min-w-0">
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                color: "#1c1917",
                              }}
                            >
                              {it.name}
                            </Typography>
                            <Typography
                              sx={{ color: "#78716c", fontSize: "0.7rem" }}
                            >
                              Qty: {it.qty}
                            </Typography>
                          </Box>
                          {it.price != null && (
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.82rem",
                                color: "#b45309",
                                shrink: 0,
                              }}
                            >
                              {formatMoney(it.price * it.qty)}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>

                    <Divider
                      sx={{ borderColor: "rgba(180,83,9,0.07)", mb: 2 }}
                    />

                    {/* Total */}
                    <Box className="flex justify-between items-baseline">
                      <Typography
                        sx={{ color: "#78716c", fontSize: "0.82rem" }}
                      >
                        Order Total
                      </Typography>
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: "1rem",
                          color: "#b45309",
                        }}
                      >
                        {formatMoney(o.total)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
