import { useEffect, useMemo, useState } from "react";
import { Box, Chip, Grid, Typography } from "@mui/material";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import HourglassEmptyOutlinedIcon from "@mui/icons-material/HourglassEmptyOutlined";

import StatCard from "./StatCard";
import RecentActivityCard, {
  type RecentActivityItem,
} from "./RecentActivityCard";
import { fetchAdminProducts } from "../../../../services/productsApi";
import { fetchContacts, type Contact } from "../../../../services/contacts";
import { fetchAdminOrderStats } from "../../../../services/adminOrdersApi";
import type { AdminOrderStatus } from "../../../../services/adminOrdersApi";

function statusBadge(status: AdminOrderStatus) {
  const norm = status ?? "PENDING";

  if (norm === "PENDING") {
    return (
      <Chip
        size="small"
        label="PENDING"
        sx={{
          fontSize: "0.65rem",
          height: 22,
          backgroundColor: "#fffbeb",
          color: "#92400e",
          fontWeight: 700,
        }}
      />
    );
  }

  if (norm === "PROCESSING") {
    return (
      <Chip
        size="small"
        label="PROCESSING"
        sx={{
          fontSize: "0.65rem",
          height: 22,
          backgroundColor: "#eff6ff",
          color: "#1d4ed8",
          fontWeight: 700,
        }}
      />
    );
  }

  return (
    <Chip
      size="small"
      label={norm}
      sx={{
        fontSize: "0.65rem",
        height: 22,
        backgroundColor: "#f5f5f4",
        color: "#78716c",
        fontWeight: 700,
      }}
    />
  );
}

export default function Overview() {
  const [productCount, setProductCount] = useState<string>("—");
  const [unreadCount, setUnreadCount] = useState<string>("—");

  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);

  const [stats, setStats] =
    useState<Awaited<ReturnType<typeof fetchAdminOrderStats>>["data"]>(null);

  useEffect(() => {
    fetchAdminProducts()
      .then((p) => setProductCount(String(p.length)))
      .catch(() => setProductCount("—"));

    fetchContacts()
      .then((c) => {
        setUnreadCount(String(c.filter((x) => !x.is_read).length));
        setRecentContacts(c.slice(0, 5));
      })
      .catch(() => setUnreadCount("—"));

    fetchAdminOrderStats()
      .then((r) => setStats(r.data))
      .catch(() => setStats(null));
  }, []);

  const recentOrderItems: RecentActivityItem[] = useMemo(() => {
    if (!stats?.recentOrders?.length) return [];

    return stats.recentOrders.map((o) => ({
      id: o.orderNumber,
      title: o.orderNumber,
      meta: `${o.customerName} • ${new Date(o.createdAt).toLocaleDateString(
        "en-NP",
        { day: "numeric", month: "short" },
      )} • Total ${Math.round(o.totalAmount).toLocaleString("en-NP")}`,
      badge: statusBadge(o.status),
    }));
  }, [stats]);

  const activityItems: RecentActivityItem[] = useMemo(() => {
    return recentContacts.map((c) => {
      const title = c.name ?? "";
      const inquiry = c.inquiry ?? "";
      const createdAt = c.created_at ?? c.createdAt ?? "";

      return {
        id: c.id,
        title,
        meta: `${inquiry} • ${new Date(createdAt).toLocaleDateString("en-NP", {
          day: "numeric",
          month: "short",
        })}`,
        badge: (
          <Chip
            size="small"
            label={c.is_read ? "READ" : "NEW"}
            sx={{
              fontSize: "0.65rem",
              height: 22,
              backgroundColor: c.is_read ? "#f5f5f4" : "#fffbeb",
              color: c.is_read ? "#78716c" : "#92400e",
              fontWeight: 700,
            }}
          />
        ),
      };
    });
  }, [recentContacts]);

  const totalOrders =
    stats?.totalOrders != null ? String(stats.totalOrders) : "—";
  const revenueThisMonth =
    stats?.revenueThisMonth != null
      ? `Rs. ${Math.round(stats.revenueThisMonth).toLocaleString("en-NP")}`
      : "—";
  const pendingOrders =
    stats?.pendingOrders != null ? String(stats.pendingOrders) : "—";

  return (
    <Box>
      <Typography variant="h5" className="font-semibold text-stone-800 mb-1">
        Overview
      </Typography>
      <Typography variant="body2" className="text-stone-400 mb-5">
        Quick admin snapshot.
      </Typography>

      <Grid container spacing={2} className="mb-4">
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={<ReceiptLongOutlinedIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Revenue (This Month)"
            value={revenueThisMonth}
            icon={<PaidOutlinedIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Pending Orders"
            value={pendingOrders}
            icon={<HourglassEmptyOutlinedIcon fontSize="small" />}
          />
        </Grid>

        {/* Keep existing cards to avoid breaking layout/users */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Products"
            value={productCount}
            icon={<DiamondOutlinedIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Unread"
            value={unreadCount}
            icon={<MailOutlinedIcon fontSize="small" />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <RecentActivityCard
            title="Recent orders"
            subtitle="Latest customer purchases"
            items={recentOrderItems}
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <RecentActivityCard
            title="Recent enquiries"
            subtitle="Latest customer messages"
            items={activityItems}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
