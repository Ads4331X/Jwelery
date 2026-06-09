import { Box, Card, CardContent, Typography } from "@mui/material";

export default function AdminProducts() {
  return (
    <Box>
      <Typography variant="h5" className="font-semibold text-stone-800 mb-1">
        Products Management
      </Typography>
      <Typography variant="body2" className="text-stone-400 mb-6">
        Create, edit, and manage your inventory.
      </Typography>
      <Card elevation={0} className="border border-stone-100 rounded-xl">
        <CardContent className="p-6 text-center text-stone-400">
          Products manager feature coming soon.
        </CardContent>
      </Card>
    </Box>
  );
}
