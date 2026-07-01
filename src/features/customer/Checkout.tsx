import {
  Box,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";

import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import ConfirmDialog from "../../components/shared/ConfirmDialog";

type PaymentMethod = "esewa" | "khalti" | "cod";

type ShippingAddress = {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  deliveryNote: string;
};

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

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  desc: string;
  color: string;
}[] = [
  {
    value: "esewa",
    label: "eSewa",
    desc: "Pay via eSewa digital wallet",
    color: "#4CAF50",
  },
  {
    value: "khalti",
    label: "Khalti",
    desc: "Pay via Khalti digital wallet",
    color: "#5C2D91",
  },
  {
    value: "cod",
    label: "Cash on Delivery",
    desc: "Pay when your order arrives",
    color: "#78350f",
  },
];

function fieldSx() {
  return {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      fontSize: "0.88rem",
    },
    "& .MuiInputLabel-root": { fontSize: "0.82rem" },
  };
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, totalItems } = useCart();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    streetAddress: "",
    city: "",
    deliveryNote: "",
  });

  const [payment, setPayment] = useState<PaymentMethod>("esewa");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placeErr, setPlaceErr] = useState<string | null>(null);

  const subtotal = totalPrice;
  const shipping = SHIPPING_FLAT;
  const total = subtotal + shipping;

  const canPlace =
    items.length > 0 &&
    address.fullName.trim().length > 0 &&
    address.phone.trim().length > 0 &&
    address.streetAddress.trim().length > 0 &&
    address.city.trim().length > 0;

  const orderItemsSummary = useMemo(
    () =>
      items.map((it) => ({
        id: it.product.id,
        name: it.product.name,
        qty: it.qty,
        price: it.product.computedPrice,
      })),
    [items],
  );

  const validate = (): string | null => {
    if (items.length === 0) return "Your cart is empty.";
    if (!address.fullName.trim()) return "Full name is required.";
    if (!address.phone.trim()) return "Phone number is required.";
    if (!address.streetAddress.trim()) return "Street address is required.";
    if (!address.city.trim()) return "City is required.";
    return null;
  };

  const handlePlaceClick = () => {
    setPlaceErr(null);
    const err = validate();
    if (err) {
      setPlaceErr(err);
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setPlacing(true);
    setPlaceErr(null);
    try {
      await new Promise((r) => setTimeout(r, 500));
      clearCart();
      navigate("/orders");
    } catch {
      setPlaceErr("Could not place order right now. Try again later.");
    } finally {
      setPlacing(false);
      setConfirmOpen(false);
    }
  };

  const set =
    (k: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setAddress((p) => ({ ...p, [k]: e.target.value }));

  return (
    <Box className="min-h-screen bg-[#fafaf7]">
      <Box className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-8 md:py-12">
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-amber-900/60 hover:text-amber-700 text-sm font-medium tracking-wide mb-8 transition-colors duration-200 cursor-pointer"
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Back to Cart
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
            Checkout
          </Typography>
          <Box
            className="h-[2px] w-12 rounded-sm mt-3"
            style={{ background: "linear-gradient(90deg, #b45309, #f59e0b)" }}
          />
        </Box>

        <Box
          sx={{
            display: { xs: "block", lg: "grid" },
            gridTemplateColumns: "1fr 400px",
            gap: 4,
            alignItems: "start",
          }}
        >
          {/* Left — address + payment */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Delivery address */}
            <Box className="bg-white rounded-[20px] border border-amber-900/[0.08] p-6">
              <Typography
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  color: "#1c1917",
                  mb: 3,
                }}
              >
                Delivery Address
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                }}
              >
                <TextField
                  label="Full name"
                  value={address.fullName}
                  onChange={set("fullName")}
                  required
                  size="small"
                  sx={fieldSx()}
                />
                <TextField
                  label="Phone number"
                  value={address.phone}
                  onChange={set("phone")}
                  required
                  size="small"
                  sx={fieldSx()}
                />
              </Box>

              <TextField
                fullWidth
                label="Street address"
                value={address.streetAddress}
                onChange={set("streetAddress")}
                required
                size="small"
                sx={{ ...fieldSx(), mt: 2 }}
              />

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  gap: 2,
                  mt: 2,
                }}
              >
                <TextField
                  label="City"
                  value={address.city}
                  onChange={set("city")}
                  required
                  size="small"
                  sx={fieldSx()}
                />
                <TextField
                  label="Delivery note (optional)"
                  value={address.deliveryNote}
                  onChange={set("deliveryNote")}
                  size="small"
                  sx={fieldSx()}
                />
              </Box>
            </Box>

            {/* Payment method */}
            <Box className="bg-white rounded-[20px] border border-amber-900/[0.08] p-6">
              <Typography
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: "1.05rem",
                  color: "#1c1917",
                  mb: 3,
                }}
              >
                Payment Method
              </Typography>

              <RadioGroup
                value={payment}
                onChange={(e) => setPayment(e.target.value as PaymentMethod)}
              >
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {PAYMENT_OPTIONS.map((opt) => (
                    <Box
                      key={opt.value}
                      onClick={() => setPayment(opt.value)}
                      className={[
                        "flex items-center gap-3 px-4 py-3.5 rounded-[14px] border cursor-pointer transition-all duration-200",
                        payment === opt.value
                          ? "border-amber-600 bg-amber-50/60"
                          : "border-amber-900/10 hover:border-amber-900/25",
                      ].join(" ")}
                    >
                      <FormControlLabel
                        value={opt.value}
                        control={
                          <Radio
                            size="small"
                            sx={{
                              color: "#b45309",
                              "&.Mui-checked": { color: "#b45309" },
                              p: 0,
                            }}
                          />
                        }
                        label=""
                        sx={{ m: 0 }}
                      />
                      <Box
                        className="w-2 h-2 rounded-full shrink-0"
                        sx={{ bgcolor: opt.color }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: "0.85rem",
                            color: "#1c1917",
                          }}
                        >
                          {opt.label}
                        </Typography>
                        <Typography
                          sx={{ fontSize: "0.72rem", color: "#78716c" }}
                        >
                          {opt.desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </RadioGroup>
            </Box>

            {placeErr && (
              <Typography
                sx={{ color: "error.main", fontSize: "0.82rem", px: 1 }}
              >
                {placeErr}
              </Typography>
            )}

            {/* Place order — shown below on mobile */}
            <Box sx={{ display: { xs: "block", lg: "none" } }}>
              <button
                type="button"
                onClick={handlePlaceClick}
                disabled={!canPlace || placing}
                className="w-full py-4 rounded-full text-sm font-bold uppercase tracking-widest text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #92400e, #b45309)",
                }}
              >
                {placing ? "Placing order..." : "Place Order"}
              </button>
            </Box>
          </Box>
          {/* Right — order summary */}
          <Box className="bg-white rounded-[20px] border border-amber-900/[0.08] p-6 sticky top-24 mt-6 lg:mt-0">
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                fontSize: "1.05rem",
                color: "#1c1917",
                mb: 3,
              }}
            >
              Order Summary
            </Typography>

            {/* Items list */}
            <Box sx={{ maxHeight: 220, overflowY: "auto", mb: 2 }}>
              {orderItemsSummary.map((it) => (
                <Box
                  key={it.id}
                  className="flex justify-between items-center py-2 border-b border-amber-900/[0.06] last:border-0"
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        color: "#1c1917",
                      }}
                    >
                      {it.name}
                    </Typography>
                    <Typography sx={{ fontSize: "0.68rem", color: "#78716c" }}>
                      Qty: {it.qty}
                    </Typography>
                  </Box>
                  {it.price != null && (
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "#b45309",
                      }}
                    >
                      {formatMoney(it.price * it.qty)}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>

            <Divider sx={{ borderColor: "rgba(180,83,9,0.08)", mb: 2 }} />

            <Box className="flex justify-between mb-1.5">
              <Typography sx={{ color: "#78716c", fontSize: "0.82rem" }}>
                Subtotal ({totalItems} items)
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: "0.82rem" }}>
                {formatMoney(subtotal)}
              </Typography>
            </Box>

            <Box className="flex justify-between mb-3">
              <Typography sx={{ color: "#78716c", fontSize: "0.82rem" }}>
                Shipping
              </Typography>
              <Typography
                sx={{ fontWeight: 600, fontSize: "0.82rem", color: "#16a34a" }}
              >
                Free
              </Typography>
            </Box>

            <Divider sx={{ borderColor: "rgba(180,83,9,0.08)", mb: 2 }} />

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

            {/* Place order — desktop */}
            <Box sx={{ display: { xs: "none", lg: "block" } }}>
              <button
                type="button"
                onClick={handlePlaceClick}
                disabled={!canPlace || placing}
                className="w-full py-4 rounded-full text-sm font-bold uppercase tracking-widest text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  background: "linear-gradient(135deg, #92400e, #b45309)",
                }}
              >
                {placing ? "Placing order..." : "Place Order"}
              </button>
            </Box>

            {/* Trust */}
            <Box className="mt-4 flex flex-col gap-1.5">
              {[
                "Certified purity guaranteed",
                "Free delivery in Kathmandu",
                "Easy returns within 7 days",
              ].map((t) => (
                <Box key={t} className="flex items-center gap-2">
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 13, color: "#b45309", opacity: 0.7 }}
                  />
                  <Typography sx={{ fontSize: "0.68rem", color: "#78716c" }}>
                    {t}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <ConfirmDialog
        open={confirmOpen}
        title="Confirm your order?"
        description="Please make sure your delivery details and payment method are correct."
        confirmText={placing ? "Placing..." : "Place Order"}
        danger
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
      />
    </Box>
  );
}
