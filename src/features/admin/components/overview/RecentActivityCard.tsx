import { Box, Card, CardContent, Divider, Typography } from "@mui/material";
import type { ReactNode } from "react";

export type RecentActivityItem = {
  id: string;
  title: string;
  meta: string;
  badge?: ReactNode;
};

export default function RecentActivityCard({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: RecentActivityItem[];
}) {
  return (
    <Card elevation={0} className="border border-stone-100 rounded-xl">
      <CardContent className="p-5">
        <Box className="flex items-start justify-between gap-4 mb-3">
          <Box>
            <Typography
              variant="subtitle2"
              className="text-stone-700 font-semibold"
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" className="text-stone-400 text-xs">
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>

        <Divider className="mb-3" />

        {items.length === 0 ? (
          <Box className="py-10 text-center">
            <Typography className="text-stone-400 text-sm">
              No recent activity.
            </Typography>
          </Box>
        ) : (
          <Box className="flex flex-col gap-3">
            {items.map((item) => (
              <Box
                key={item.id}
                className="flex items-start justify-between gap-3"
              >
                <Box className="min-w-0">
                  <Typography className="text-sm text-stone-800 font-medium truncate">
                    {item.title}
                  </Typography>
                  <Typography className="text-xs text-stone-400 truncate">
                    {item.meta}
                  </Typography>
                </Box>
                {item.badge}
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
