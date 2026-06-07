import { Box, Card, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";

export default function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <Card elevation={0} className="border border-stone-100 rounded-xl">
      <CardContent className="flex items-center gap-4 p-5">
        <Box className="flex items-center justify-center w-10 h-10 rounded-lg bg-stone-100 text-stone-600">
          {icon}
        </Box>

        <Box>
          <Typography
            variant="caption"
            className="text-stone-400 uppercase tracking-wide"
          >
            {title}
          </Typography>
          <Typography
            variant="h6"
            className="font-semibold text-stone-800 leading-tight"
          >
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
