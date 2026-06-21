import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import MarkunreadOutlinedIcon from "@mui/icons-material/MarkunreadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import type { Contact } from "../../../../services/contacts";

function formatDate(raw: string | undefined, long = false) {
  if (!raw) return "—";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return "—";
  return long
    ? d.toLocaleString("en-NP")
    : d.toLocaleDateString("en-NP", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

export function ContactListItem({
  contact,
  expanded,
  onToggleExpanded,
  onMarkRead,
  onDelete,
}: {
  contact: Contact;
  expanded: string | null;
  onToggleExpanded: (id: string) => void;
  onMarkRead: (c: Contact) => void;
  onDelete: (id: string) => void;
}) {
  const isExpanded = expanded === contact.id;
  const isRead = contact.is_read ?? false;
  const date = contact.createdAt ?? contact.created_at;

  return (
    <Box
      className="rounded-xl mb-2 overflow-hidden transition-all"
      sx={{
        border: isRead ? "1px solid #e7e5e4" : "1px solid #fcd34d",
        backgroundColor: isRead ? "#fff" : "#fffbeb",
      }}
    >
      {/* Row */}
      <Box
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => onToggleExpanded(contact.id)}
      >
        {/* Unread dot */}
        <Box className="shrink-0 w-2 flex justify-center">
          {!isRead && (
            <Box
              className="w-2 h-2 rounded-full"
              sx={{ backgroundColor: "#b45309" }}
            />
          )}
        </Box>

        {/* Main content */}
        <Box className="flex-1 min-w-0">
          <Box className="flex items-center gap-2 flex-wrap">
            <Typography
              className="text-sm leading-snug"
              sx={{
                fontWeight: isRead ? 400 : 700,
                color: isRead ? "#57534e" : "#1c1917",
              }}
            >
              {contact.name}
            </Typography>

            {/* UNREAD badge */}
            {!isRead && (
              <Chip
                label="New"
                size="small"
                sx={{
                  fontSize: "0.58rem",
                  height: 16,
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  backgroundColor: "#b45309",
                  color: "#fff",
                  borderRadius: "4px",
                }}
              />
            )}

            {/* Inquiry type chip */}
            {contact.inquiry && (
              <Chip
                label={contact.inquiry}
                size="small"
                sx={{
                  fontSize: "0.6rem",
                  height: 18,
                  backgroundColor: isRead ? "#f5f5f4" : "#fef3c7",
                  color: isRead ? "#78716c" : "#92400e",
                  borderRadius: "4px",
                }}
              />
            )}
          </Box>

          <Typography
            className="text-xs truncate mt-0.5"
            sx={{ color: isRead ? "#a8a29e" : "#78716c" }}
          >
            {contact.email || contact.phone || "—"}
          </Typography>
        </Box>

        {/* Date */}
        <Typography
          className="text-[0.65rem] shrink-0"
          sx={{ color: isRead ? "#a8a29e" : "#92400e" }}
        >
          {formatDate(date)}
        </Typography>

        {/* Actions */}
        <Box
          className="flex items-center gap-0.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title={isRead ? "Mark as unread" : "Mark as read"}>
            <IconButton size="small" onClick={() => onMarkRead(contact)}>
              {isRead ? (
                <MarkunreadOutlinedIcon
                  sx={{ fontSize: 16, color: "#a8a29e" }}
                />
              ) : (
                <MarkEmailReadOutlinedIcon
                  sx={{ fontSize: 16, color: "#b45309" }}
                />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => onDelete(contact.id)}>
              <DeleteOutlinedIcon sx={{ fontSize: 16, color: "#a8a29e" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Expanded body */}
      {isExpanded && (
        <Box
          className="px-5 pb-4 pt-3"
          sx={{
            borderTop: "1px solid",
            borderColor: isRead ? "#e7e5e4" : "#fde68a",
          }}
        >
          {contact.phone && (
            <Typography className="text-xs text-stone-400 mb-2">
              📞 {contact.phone}
            </Typography>
          )}
          <Typography className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
            {contact.message || "—"}
          </Typography>
          <Typography className="text-xs text-stone-400 mt-3">
            {formatDate(date, true)}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
