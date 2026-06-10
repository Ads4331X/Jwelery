import { Box, Chip, IconButton, Tooltip, Typography } from "@mui/material";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import DraftsOutlinedIcon from "@mui/icons-material/DraftsOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import type { Contact } from "../../../../services/contacts";

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

  return (
    <Box
      key={contact.id}
      className="border border-stone-100 rounded-xl mb-2 overflow-hidden"
      sx={{ backgroundColor: contact.is_read ? "white" : "#fffbeb" }}
    >
      <Box
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => onToggleExpanded(contact.id)}
      >
        <Box className="text-stone-400 shrink-0">
          {contact.is_read ? (
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
                contact.is_read
                  ? "text-stone-600"
                  : "font-semibold text-stone-800"
              }`}
            >
              {contact.name}
            </Typography>
            <Chip
              label={contact.inquiry}
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
            {contact.email}
          </Typography>
        </Box>

        <Typography className="text-[0.65rem] text-stone-400 shrink-0">
          {new Date(contact.created_at).toLocaleDateString("en-NP", {
            day: "numeric",
            month: "short",
          })}
        </Typography>

        <Box
          className="flex items-center shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title={contact.is_read ? "Mark unread" : "Mark read"}>
            <IconButton size="small" onClick={() => onMarkRead(contact)}>
              {contact.is_read ? (
                <ContactMailOutlinedIcon
                  sx={{ fontSize: 15, color: "#a8a29e" }}
                />
              ) : (
                <DraftsOutlinedIcon sx={{ fontSize: 15, color: "#a8a29e" }} />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => onDelete(contact.id)}>
              <DeleteOutlinedIcon sx={{ fontSize: 15, color: "#a8a29e" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {isExpanded && (
        <Box className="px-4 pb-4 pt-1 border-t border-stone-100">
          <Typography className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
            {contact.message}
          </Typography>
          <Typography className="text-xs text-stone-400 mt-2">
            {new Date(contact.created_at).toLocaleString("en-NP")}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
