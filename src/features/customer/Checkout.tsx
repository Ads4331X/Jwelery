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
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import LocalAtmOutlinedIcon from "@mui/icons-material/LocalAtmOutlined";

import { useEffect, useMemo, useState } from "react";

import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import { createOrder, type OrderItemCreate } from "../../services/ordersApi";
import { getAddresses, type SavedAddress } from "../../services/addressesApi";

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
  icon: ReactNode;
}[] = [
  {
    value: "esewa",
    label: "eSewa",
    desc: "Pay via eSewa digital wallet",
    color: "#4CAF50",
    icon: <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    value: "khalti",
    label: "Khalti",
    desc: "Pay via Khalti digital wallet",
    color: "#5C2D91",
    icon: <PaymentsOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    value: "cod",
    label: "Cash on Delivery",
    desc: "Pay when your order arrives",
    color: "#78350f",
    icon: <LocalAtmOutlinedIcon sx={{ fontSize: 18 }} />,
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

  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);
  void savedLoading;

  const [useNewAddress, setUseNewAddress] = useState(true);
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);

  const [manualAddress, setManualAddress] = useState<ShippingAddress>({
    fullName: "",
    phone: "",
    streetAddress: "",
    city: "",
    deliveryNote: "",
  });

  // COD and eSewa are available.
  const [payment, setPayment] = useState<PaymentMethod>("cod");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [placeErr, setPlaceErr] = useState<string | null>(null);

  const subtotal = totalPrice;
  const shipping = SHIPPING_FLAT;
  const total = subtotal + shipping;

  const selectedShippingAddress: ShippingAddress = useNewAddress
    ? manualAddress
    : (() => {
        const addr = savedAddresses.find((a) => a.id === selectedSavedId);
        if (!addr) {
          return manualAddress;
        }
        return {
          fullName: addr.fullName,
          phone: addr.phone,
          streetAddress: addr.street,
          city: addr.city,
          deliveryNote: manualAddress.deliveryNote,
        };
      })();

  const canPlace =
    items.length > 0 &&
    selectedShippingAddress.fullName.trim().length > 0 &&
    selectedShippingAddress.phone.trim().length > 0 &&
    selectedShippingAddress.streetAddress.trim().length > 0 &&
    selectedShippingAddress.city.trim().length > 0;

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
    if (!selectedShippingAddress.fullName.trim())
      return "Full name is required.";
    if (!selectedShippingAddress.phone.trim())
      return "Phone number is required.";
    if (!selectedShippingAddress.streetAddress.trim())
      return "Street address is required.";
    if (!selectedShippingAddress.city.trim()) return "City is required.";
    return null;
  };

  useEffect(() => {
    let mounted = true;

    async function load() {
      setSavedLoading(true);
      try {
        const res = await getAddresses();
        if (!mounted) return;

        const list = res.data ?? [];
        setSavedAddresses(list);

        const defaultAddr = list.find((a) => a.isDefault) ?? list[0];
        if (defaultAddr) {
          setSelectedSavedId(defaultAddr.id);
          setUseNewAddress(false);
          // Keep manualAddress untouched; just switch to saved address mode.
          // (Address fields will be derived from saved address while useNewAddress=false)
        } else {
          setUseNewAddress(true);
          setSelectedSavedId(null);
        }
      } finally {
        if (mounted) setSavedLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

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
      const payloadItems: OrderItemCreate[] = items.map((it) => ({
        productId: it.product.id,
        qty: it.qty,
      }));

      let res;
      if (!useNewAddress && selectedSavedId) {
        // Reuse saved address — send addressId instead of raw address fields
        res = await createOrder(
          payloadItems,
          selectedShippingAddress,
          selectedSavedId,
        );
      } else {
        // Manual address — keep existing behavior
        res = await createOrder(payloadItems, {
          fullName: selectedShippingAddress.fullName,
          phone: selectedShippingAddress.phone,
          streetAddress: selectedShippingAddress.streetAddress,
          city: selectedShippingAddress.city,
          deliveryNote: selectedShippingAddress.deliveryNote,
        });
      }

      if (res.error) {
        setPlaceErr(res.error);
        return;
      }

      // If eSewa is selected, keep user on this page while eSewa form
      // auto-submits and redirects to eSewa.
      if (payment === "esewa") {
        clearCart();
        setConfirmOpen(false);
        // Trigger form submission by mounting EsewaPaymentForm with orderId.
        // We do this by navigating to a lightweight route that renders the form.
        // For now, just pass the order id via location state.
        navigate("/checkout/esewa", {
          state: { orderId: res.data?.id ?? null },
        });
        return;
      }

      clearCart();
      navigate("/orders");
    } catch {
      setPlaceErr("Could not place order right now. Try again later.");
    } finally {
      setPlacing(false);
      setConfirmOpen(false);
    }
  };

  const setManual =
    (k: keyof ShippingAddress) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setManualAddress((p) => ({ ...p, [k]: e.target.value }));

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

              {/* Saved addresses selector */}
              {savedAddresses.length > 0 ? (
                <Box sx={{ mb: 3 }}>
                  <RadioGroup
                    value={useNewAddress ? "new" : (selectedSavedId ?? "")}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "new") {
                        setUseNewAddress(true);
                        return;
                      }

                      setUseNewAddress(false);
                      setSelectedSavedId(v);

                      // Do not mutate manualAddress. We only switch the mode.
                      // Address fields are derived from selected saved address when useNewAddress=false.
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                      }}
                    >
                      {savedAddresses.map((a) => (
                        <Box
                          key={a.id}
                          className={[
                            "flex items-start gap-3 px-3 py-2.5 rounded-[14px] border transition-all duration-200",
                            !useNewAddress && selectedSavedId === a.id
                              ? "border-amber-600 bg-amber-50/60"
                              : "border-amber-900/10 hover:border-amber-900/25",
                          ].join(" ")}
                        >
                          <FormControlLabel
                            value={a.id}
                            control={
                              <Radio
                                size="small"
                                sx={{ color: "#b45309", p: 0 }}
                              />
                            }
                            label=""
                            sx={{ m: 0, alignItems: "flex-start" }}
                          />

                          <Box className="flex-1">
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "0.85rem",
                                color: "#1c1917",
                              }}
                            >
                              {a.fullName}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "0.72rem",
                                color: "#78716c",
                                mt: 0.2,
                              }}
                            >
                              {a.phone}
                            </Typography>
                            <Typography
                              sx={{ fontSize: "0.72rem", color: "#78716c" }}
                            >
                              {a.street}, {a.city}
                            </Typography>
                            {a.isDefault ? (
                              <Box
                                sx={{
                                  mt: 0.6,
                                  display: "inline-flex",
                                  fontSize: "0.62rem",
                                  fontWeight: 800,
                                  letterSpacing: "0.06em",
                                  color: "#b45309",
                                  border: "1px solid rgba(180,83,9,0.18)",
                                  borderRadius: "999px",
                                  px: 1,
                                  py: "2px",
                                  background: "rgba(180,83,9,0.06)",
                                }}
                              >
                                DEFAULT
                              </Box>
                            ) : null}
                          </Box>
                        </Box>
                      ))}

                      <Box
                        className={[
                          "flex items-start gap-3 px-3 py-2.5 rounded-[14px] border transition-all duration-200",
                          useNewAddress
                            ? "border-amber-600 bg-amber-50/60"
                            : "border-amber-900/10 hover:border-amber-900/25",
                        ].join(" ")}
                      >
                        <FormControlLabel
                          value="new"
                          control={
                            <Radio
                              size="small"
                              sx={{ color: "#b45309", p: 0 }}
                            />
                          }
                          label=""
                          sx={{ m: 0, alignItems: "flex-start" }}
                        />
                        <Box className="flex-1">
                          <button
                            type="button"
                            onClick={() => setUseNewAddress(true)}
                            className="font-bold"
                            style={{
                              background: "transparent",
                              border: "none",
                              padding: 0,
                              cursor: "pointer",
                              color: "#b45309",
                            }}
                          >
                            + Use a new address
                          </button>
                        </Box>
                      </Box>
                    </Box>
                  </RadioGroup>
                </Box>
              ) : null}

              {/* Manual form */}
              <Box
                sx={{
                  opacity: !useNewAddress ? 0.65 : 1,
                  pointerEvents: !useNewAddress ? "none" : "auto",
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Full name"
                    value={manualAddress.fullName}
                    onChange={setManual("fullName")}
                    required
                    size="small"
                    sx={fieldSx()}
                  />
                  <TextField
                    label="Phone number"
                    value={manualAddress.phone}
                    onChange={setManual("phone")}
                    required
                    size="small"
                    sx={fieldSx()}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Street address"
                  value={manualAddress.streetAddress}
                  onChange={setManual("streetAddress")}
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
                    value={manualAddress.city}
                    onChange={setManual("city")}
                    required
                    size="small"
                    sx={fieldSx()}
                  />
                  <TextField
                    label="Delivery note (optional)"
                    value={manualAddress.deliveryNote}
                    onChange={setManual("deliveryNote")}
                    size="small"
                    sx={fieldSx()}
                  />
                </Box>
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
                  {PAYMENT_OPTIONS.map((opt) => {
                    return (
                      <Box
                        key={opt.value}
                        onClick={() => {
                          if (opt.value !== "esewa" && opt.value !== "cod")
                            return;
                          setPayment(opt.value);
                        }}
                        className={[
                          "flex items-center gap-3 px-4 py-3.5 rounded-[14px] border transition-all duration-200",
                          opt.value !== "esewa" && opt.value !== "cod"
                            ? "cursor-not-allowed opacity-60 border-amber-900/10 bg-white"
                            : "cursor-pointer",
                          payment === opt.value
                            ? "border-amber-600 bg-amber-50/60"
                            : opt.value !== "esewa" && opt.value !== "cod"
                              ? ""
                              : "border-amber-900/10 hover:border-amber-900/25",
                        ].join(" ")}
                      >
                        <FormControlLabel
                          value={opt.value}
                          disabled={
                            opt.value !== "esewa" && opt.value !== "cod"
                          }
                          control={
                            <Radio
                              size="small"
                              disabled={
                                opt.value !== "esewa" && opt.value !== "cod"
                              }
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
                          className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
                          sx={{ bgcolor: `${opt.color}1a`, color: opt.color }}
                        >
                          {opt.icon}
                        </Box>

                        <Box className="flex flex-col">
                          <Box className="flex items-center gap-2">
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                color: "#1c1917",
                              }}
                            >
                              {opt.label}
                            </Typography>
                            {opt.value === "khalti" ? (
                              <Box
                                sx={{
                                  fontSize: "0.62rem",
                                  fontWeight: 800,
                                  letterSpacing: "0.06em",
                                  color: "#b45309",
                                  border: "1px solid rgba(180,83,9,0.18)",
                                  borderRadius: "999px",
                                  px: 1,
                                  py: "2px",
                                  background: "rgba(180,83,9,0.06)",
                                }}
                              >
                                Coming soon
                              </Box>
                            ) : null}
                          </Box>

                          <Typography
                            sx={{ fontSize: "0.72rem", color: "#78716c" }}
                          >
                            {opt.desc}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </RadioGroup>
            </Box>

            {placeErr ? (
              <Typography
                sx={{ color: "error.main", fontSize: "0.82rem", px: 1 }}
              >
                {placeErr}
              </Typography>
            ) : null}

            {/* Place order — shown below on mobile */}
            <Box sx={{ display: { xs: "block", lg: "none" } }}>
              {payment === "esewa" ? (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!canPlace || placing}
                  className="w-full py-4 rounded-full text-sm font-bold uppercase tracking-widest text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
                  }}
                >
                  {placing ? "Placing order..." : "Pay with eSewa"}
                </button>
              ) : (
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
              )}
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
                  {it.price != null ? (
                    <Typography
                      sx={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: "#b45309",
                      }}
                    >
                      {formatMoney(it.price * it.qty)}
                    </Typography>
                  ) : null}
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
              {payment === "esewa" ? (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!canPlace || placing}
                  className="w-full py-4 rounded-full text-sm font-bold uppercase tracking-widest text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background: "linear-gradient(135deg, #4CAF50, #2E7D32)",
                  }}
                >
                  {placing ? "Placing order..." : "Pay with eSewa"}
                </button>
              ) : (
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
              )}
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
