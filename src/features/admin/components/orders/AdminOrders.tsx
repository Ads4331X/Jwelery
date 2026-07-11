import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import {
  getAdminOrders,
  type AdminOrderListItem,
  type AdminOrderStatus,
  patchAdminOrderStatus,
} from "../../../../services/adminOrdersApi";

const STATUS_OPTIONS: AdminOrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "READY_FOR_DELIVERY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

const STATUS_CONFIG: Record<
  AdminOrderStatus,
  { label: string; bg: string; color: string }
> = {
  PENDING: { label: "Pending", bg: "rgba(245,158,11,0.12)", color: "#b45309" },
  CONFIRMED: {
    label: "Confirmed",
    bg: "rgba(59,130,246,0.12)",
    color: "#2563eb",
  },
  PROCESSING: {
    label: "Processing",
    bg: "rgba(59,130,246,0.12)",
    color: "#2563eb",
  },
  READY_FOR_DELIVERY: {
    label: "Ready for delivery",
    bg: "rgba(124,58,237,0.12)",
    color: "#7c3aed",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for delivery",
    bg: "rgba(124,58,237,0.12)",
    color: "#7c3aed",
  },
  DELIVERED: {
    label: "Delivered",
    bg: "rgba(34,197,94,0.12)",
    color: "#16a34a",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "rgba(239,68,68,0.12)",
    color: "#dc2626",
  },
  REFUNDED: {
    label: "Refunded",
    bg: "rgba(239,68,68,0.07)",
    color: "rgba(220,38,38,0.8)",
  },
};

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

function getCustomerDisplay(o: AdminOrderListItem) {
  const name = o.customer?.name;
  const email = o.customer?.email;
  if (name && email) return `${name} (${email})`;
  if (name) return name;
  if (email) return email;
  return "—";
}

export default function AdminOrders() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<"ALL" | AdminOrderStatus>(
    "ALL",
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const selectedOrder = useMemo(
    () =>
      orders.find((o) =>
        selectedOrderId ? o.id === selectedOrderId : false,
      ) ?? null,
    [orders, selectedOrderId],
  );

  const [newStatus, setNewStatus] = useState<AdminOrderStatus>("PENDING");
  const [note, setNote] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const [updateErr, setUpdateErr] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    setErr(null);
    const res = await getAdminOrders();
    if (res.error) {
      setErr(res.error);
      setOrders([]);
    } else {
      setOrders(res.data);
    }
    setLoading(false);
  }

  useEffect(() => {
    // Kick off async fetch after mount.
    queueMicrotask(() => {
      void refresh();
    });
  }, []);

  useEffect(() => {
    if (!selectedOrder) return;
    queueMicrotask(() => {
      setNewStatus(selectedOrder.status);
      setNote("");
      setUpdateErr(null);
    });
  }, [selectedOrder]);

  const filteredOrders = useMemo(() => {
    const list = [...orders].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    if (statusFilter === "ALL") return list;
    return list.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const handleUpdate = async () => {
    if (!selectedOrder?.id) {
      setUpdateErr("Order id missing; cannot update status.");
      return;
    }
    setUpdating(true);
    setUpdateErr(null);
    const res = await patchAdminOrderStatus(selectedOrder.id, newStatus, note);
    if (res.error) {
      setUpdateErr(res.error);
      setUpdating(false);
      return;
    }
    setUpdating(false);
    setNote("");
    await refresh();
  };

  return (
    <Box className="flex flex-col gap-4">
      <Box>
        <Typography variant="h5" className="font-semibold text-stone-800 mb-1">
          Orders
        </Typography>
        <Typography variant="body2" className="text-stone-400">
          Manage customer orders and update delivery status.
        </Typography>
      </Box>

      <Box className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Status</InputLabel>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "ALL" | AdminOrderStatus)
            }
          >
            <MenuItem value="ALL">All statuses</MenuItem>
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box />
      </Box>

      {loading ? (
        <Box className="flex justify-center py-16">
          <CircularProgress sx={{ color: "#b45309" }} />
        </Box>
      ) : err ? (
        <Alert severity="error">{err}</Alert>
      ) : filteredOrders.length === 0 ? (
        <Box className="py-16 text-center">
          <Typography className="text-stone-700 font-semibold" sx={{ mb: 0.5 }}>
            No orders yet
          </Typography>
          <Typography className="text-stone-400 text-sm">
            Try changing the status filter.
          </Typography>
        </Box>
      ) : (
        <Box className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TableContainer
            component={Paper}
            className="shadow-none border border-stone-100 rounded-xl"
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Order</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((o) => {
                  const cfg = STATUS_CONFIG[o.status];
                  return (
                    <TableRow
                      key={o.id ?? o.orderNumber}
                      hover
                      selected={o.id === selectedOrderId}
                      onClick={() => setSelectedOrderId(o.id ?? null)}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell>
                        <Typography className="text-stone-800 font-semibold">
                          #{o.orderNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          className="text-stone-700"
                          sx={{ maxWidth: 240 }}
                        >
                          {getCustomerDisplay(o)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={cfg.label}
                          size="small"
                          sx={{
                            bgcolor: cfg.bg,
                            color: cfg.color,
                            fontWeight: 800,
                            fontSize: "0.7rem",
                            height: "auto",
                            py: "3px",
                            borderRadius: "999px",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          className="text-stone-500"
                          sx={{ fontSize: 12 }}
                        >
                          {formatDate(o.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography className="text-stone-800 font-bold">
                          {formatMoney(o.totalAmount)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <Box className="border border-stone-100 rounded-xl p-4 bg-white">
            {!selectedOrder ? (
              <Box className="py-10 text-center">
                <Typography className="text-stone-700 font-semibold">
                  Select an order
                </Typography>
                <Typography className="text-stone-400 text-sm">
                  Click a row to view details and update status.
                </Typography>
              </Box>
            ) : (
              <Box className="flex flex-col gap-3">
                <Box className="flex items-start justify-between gap-3">
                  <Box>
                    <Typography className="text-stone-800 font-semibold">
                      Order #{selectedOrder.orderNumber}
                    </Typography>
                    <Typography className="text-stone-500 text-sm">
                      {formatDate(selectedOrder.createdAt)}
                    </Typography>
                  </Box>
                  <Chip
                    label={STATUS_CONFIG[selectedOrder.status].label}
                    size="small"
                    sx={{
                      bgcolor: STATUS_CONFIG[selectedOrder.status].bg,
                      color: STATUS_CONFIG[selectedOrder.status].color,
                      fontWeight: 900,
                      borderRadius: "999px",
                      height: "auto",
                      py: "3px",
                    }}
                  />
                </Box>

                <Divider />

                <Box>
                  <Typography className="text-stone-800 font-semibold mb-2">
                    Customer
                  </Typography>
                  <Typography className="text-stone-600">
                    {getCustomerDisplay(selectedOrder)}
                  </Typography>
                </Box>

                <Divider />

                <Box>
                  <Typography className="text-stone-800 font-semibold mb-2">
                    Items
                  </Typography>
                  <Box className="flex flex-col gap-2">
                    {selectedOrder.items.map((it, idx) => (
                      <Box
                        key={`${it.productId ?? it.name}-${idx}`}
                        className="flex items-center justify-between gap-3"
                      >
                        <Typography
                          className="text-stone-700"
                          sx={{ maxWidth: 240 }}
                        >
                          {it.name} × {it.qty}
                        </Typography>
                        {it.price != null && (
                          <Typography className="text-stone-800 font-semibold">
                            {formatMoney(it.price * it.qty)}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>

                <Divider />

                <Box className="flex flex-col gap-2">
                  <Typography className="text-stone-800 font-semibold">
                    Update status
                  </Typography>

                  <Box className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormControl size="small" sx={{ minWidth: 240 }}>
                      <InputLabel>New status</InputLabel>
                      <Select
                        label="New status"
                        value={newStatus}
                        onChange={(e) =>
                          setNewStatus(e.target.value as AdminOrderStatus)
                        }
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <MenuItem key={s} value={s}>
                            {STATUS_CONFIG[s].label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Note (optional)"
                      size="small"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </Box>

                  {updateErr && <Alert severity="error">{updateErr}</Alert>}

                  <Box className="flex gap-2 justify-end">
                    <Button
                      variant="contained"
                      disableElevation
                      onClick={handleUpdate}
                      disabled={updating || !selectedOrder.id}
                      sx={{
                        backgroundColor: "#1c1917",
                        "&:hover": { backgroundColor: "#292524" },
                      }}
                    >
                      {updating ? "Updating..." : "Update status"}
                    </Button>
                  </Box>
                </Box>

                <Divider />

                <Box className="flex items-center justify-between">
                  <Typography className="text-stone-600">
                    Order total
                  </Typography>
                  <Typography className="text-stone-900 font-bold">
                    {formatMoney(selectedOrder.totalAmount)}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
