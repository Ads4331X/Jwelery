import { useEffect, useMemo, useState } from "react";
import { Box, Chip, Grid, Typography } from "@mui/material";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";

import StatCard from "./StatCard";
import RecentActivityCard, {
  type RecentActivityItem,
} from "./RecentActivityCard";
import { fetchAdminProducts } from "../../../../services/productsApi";
import { fetchContacts, type Contact } from "../../../../services/contacts";

export default function Overview() {
  const [productCount, setProductCount] = useState<string>("—");
  const [unreadCount, setUnreadCount] = useState<string>("—");
  const [recentContacts, setRecentContacts] = useState<Contact[]>([]);

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
  }, []);

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

      <RecentActivityCard
        title="Recent enquiries"
        subtitle="Latest customer messages"
        items={activityItems}
      />
    </Box>
  );
}
