import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import StatCard from "./StatCard";

export default function Overview() {
  return (
    <Box>
      <Typography variant="h5" className="font-semibold text-stone-800 mb-1">
        Overview
      </Typography>
      <Typography variant="body2" className="text-stone-400 mb-6">
        Welcome back to your jewellery store admin panel.
      </Typography>

      <Grid container spacing={2} className="mb-6">
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Products"
            value="248"
            icon={<DiamondOutlinedIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Orders"
            value="64"
            icon={<ShoppingBagOutlinedIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Revenue"
            value="Rs. 1.2L"
            icon={<AttachMoneyIcon fontSize="small" />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Customers"
            value="312"
            icon={<PeopleIcon fontSize="small" />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} className="mb-6">
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            className="border border-stone-100 rounded-xl h-56"
          >
            <CardContent className="p-5 h-full flex flex-col">
              <Typography
                variant="subtitle2"
                className="text-stone-700 font-semibold mb-3"
              >
                Sales Chart
              </Typography>
              <Box className="flex-1 rounded-lg bg-stone-50 flex items-center justify-center">
                <Typography variant="body2" className="text-stone-300">
                  Chart coming soon
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            elevation={0}
            className="border border-stone-100 rounded-xl h-56"
          >
            <CardContent className="p-5 h-full flex flex-col">
              <Typography
                variant="subtitle2"
                className="text-stone-700 font-semibold mb-3"
              >
                Recent Orders
              </Typography>
              <Box className="flex-1 rounded-lg bg-stone-50 flex items-center justify-center">
                <Typography variant="body2" className="text-stone-300">
                  No orders yet
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
