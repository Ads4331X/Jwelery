import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Snackbar,
} from "@mui/material";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

import {
  fetchContacts,
  markRead,
  deleteContact,
} from "../../../../services/contacts";
import type { Contact } from "../../../../services/contacts";

type TabValue = "all" | "unread" | "read";

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabValue>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setContacts(await fetchContacts());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Run after first paint to avoid synchronous setState warnings.
    const t = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(t);
  }, [load]);

  const filtered = contacts.filter((c) =>
    tab === "all" ? true : tab === "unread" ? !c.is_read : c.is_read,
  );

  const unreadCount = contacts.filter((c) => !c.is_read).length;

  const handleMarkRead = async (c: Contact) => {
    const next = !c.is_read;
    setContacts((prev) =>
      prev.map((x) => (x.id === c.id ? { ...x, is_read: next } : x)),
    );

    const { error } = await markRead(c.id, next);
    if (error) {
      setContacts((prev) =>
        prev.map((x) => (x.id === c.id ? { ...x, is_read: c.is_read } : x)),
      );
      setToast("Failed to update.");
    }
  };

  const handleDelete = async (id: string) => {
    setContacts((prev) => prev.filter((x) => x.id !== id));
    const { error } = await deleteContact(id);
    if (error) {
      setToast("Failed to delete.");
      void load();
    }
  };

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h5" className="font-semibold text-stone-800 mb-1">
          Enquiries
        </Typography>
        <Typography variant="body2" className="text-stone-400">
          Customer contact form submissions.
        </Typography>
      </Box>

      <Card elevation={0} className="border border-stone-100 rounded-xl">
        <CardContent className="p-6">
          <Box className="flex items-center gap-2 mb-4">
            <MarkEmailReadIcon className="text-amber-700" />
            <Typography
              variant="subtitle1"
              className="font-semibold text-stone-800"
            >
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
            <Tab value="all" label={`All (${contacts.length})`} />
            <Tab value="unread" label={`Unread (${unreadCount})`} />
            <Tab
              value="read"
              label={`Read (${contacts.length - unreadCount})`}
            />
          </Tabs>

          {loading && (
            <Box className="flex justify-center py-12">
              <CircularProgress size={24} className="text-stone-400" />
            </Box>
          )}

          {!loading && error && <Alert severity="error">{error}</Alert>}

          {!loading && !error && filtered.length === 0 && (
            <Box className="py-12 text-center">
              <Typography className="text-stone-400 text-sm">
                No enquiries yet.
              </Typography>
            </Box>
          )}

          {!loading &&
            !error &&
            filtered.map((c) => (
              <Box
                key={c.id}
                className="border border-stone-100 rounded-xl mb-2 overflow-hidden"
                sx={{ backgroundColor: c.is_read ? "white" : "#fffbeb" }}
              >
                <Box
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                  onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                >
                  <Box className="text-stone-400 shrink-0">
                    {c.is_read ? (
                      <DraftsOutlinedIcon fontSize="small" />
                    ) : (
                      <ContactMailOutlinedIcon
                        fontSize="small"
                        sx={{ color: "#b45309" }}
                      />
                    )}
                  </Box>
                  <Box className="flex-1 min-w-0">
                    <Box className="flex items-center gap-2">
                      <Typography
                        className={`text-sm ${
                          c.is_read
                            ? "text-stone-600"
                            : "font-semibold text-stone-800"
                        }`}
                      >
                        {c.name}
                      </Typography>
                      <Chip
                        label={c.inquiry}
                        size="small"
                        sx={{
                          fontSize: "0.6rem",
                          height: 18,
                          backgroundColor: "#f5f5f4",
                          color: "#78716c",
                        }}
                      />
                    </Box>
                    <Typography className="text-xs text-stone-400 truncate">
                      {c.email}
                    </Typography>
                  </Box>
                  <Typography className="text-[0.65rem] text-stone-400 shrink-0">
                    {new Date(c.created_at).toLocaleDateString("en-NP", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Typography>
                  <Box
                    className="flex items-center shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Tooltip title={c.is_read ? "Mark unread" : "Mark read"}>
                      <IconButton
                        size="small"
                        onClick={() => handleMarkRead(c)}
                      >
                        {c.is_read ? (
                          <ContactMailOutlinedIcon
                            sx={{ fontSize: 15, color: "#a8a29e" }}
                          />
                        ) : (
                          <DraftsOutlinedIcon
                            sx={{ fontSize: 15, color: "#a8a29e" }}
                          />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(c.id)}
                      >
                        <DeleteOutlinedIcon
                          sx={{ fontSize: 15, color: "#a8a29e" }}
                        />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                {expanded === c.id && (
                  <Box className="px-4 pb-4 pt-1 border-t border-stone-100">
                    <Typography className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
                      {c.message}
                    </Typography>
                    <Typography className="text-xs text-stone-400 mt-2">
                      {new Date(c.created_at).toLocaleString("en-NP")}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
        </CardContent>
      </Card>

      <Snackbar
        open={toast !== null}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled" className="rounded-xl">
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}
