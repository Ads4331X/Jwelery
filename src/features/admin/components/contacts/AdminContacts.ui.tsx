import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

export type TabValue = "all" | "unread" | "read";

export function AdminContactsHeader({ unreadCount }: { unreadCount: number }) {
  return (
    <Box className="flex items-center gap-2 mb-4">
      <MarkEmailReadIcon className="text-amber-700" />
      <Typography variant="subtitle1" className="font-semibold text-stone-800">
        Inbox
      </Typography>
      {unreadCount > 0 && (
        <Chip
          label={`${unreadCount} unread`}
          size="small"
          className="ml-auto"
          sx={{
            fontSize: "0.68rem",
            height: 22,
            backgroundColor: "#fef3c7",
            color: "#92400e",
          }}
        />
      )}
    </Box>
  );
}

export function AdminContactsToolbar({
  tab,
  setTab,
  unreadCount,
  totalCount,
}: {
  tab: TabValue;
  setTab: (v: TabValue) => void;
  unreadCount: number;
  totalCount: number;
}) {
  return (
    <>
      <Divider className="mb-4" />
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          mb: 3,
          minHeight: 36,
          "& .MuiTab-root": {
            minHeight: 36,
            fontSize: "0.72rem",
            textTransform: "none",
            fontWeight: 500,
          },
          "& .Mui-selected": { color: "#b45309 !important" },
          "& .MuiTabs-indicator": { backgroundColor: "#b45309" },
        }}
      >
        <Tab value="all" label={`All (${totalCount})`} />
        <Tab value="unread" label={`Unread (${unreadCount})`} />
        <Tab value="read" label={`Read (${totalCount - unreadCount})`} />
      </Tabs>
    </>
  );
}

export function AdminContactsEmptyState() {
  return (
    <Box className="py-12 text-center">
      <Typography className="text-stone-400 text-sm">
        No enquiries yet.
      </Typography>
    </Box>
  );
}

export function AdminContactsLoading() {
  return (
    <Box className="flex justify-center py-12">
      <CircularProgress size={24} className="text-stone-400" />
    </Box>
  );
}
