import { Box, Card, CardContent, Typography } from "@mui/material";

export default function AdminAnalytics() {
  return (
    <Box>
      <Typography variant="h5" className="font-semibold text-stone-800 mb-1">
        Analytics
      </Typography>
      <Typography variant="body2" className="text-stone-400 mb-6">
        Monitor store metrics and revenue growth.
      </Typography>
      <Card elevation={0} className="border border-stone-100 rounded-xl">
        <CardContent className="p-6 text-center text-stone-400">
          Analytics dashboard feature coming soon.
        </CardContent>
      </Card>
    </Box>
  );
}
