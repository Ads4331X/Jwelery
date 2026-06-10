import { Box, Card, CardContent, Alert, Typography } from "@mui/material";

import { useAdminContacts } from "./AdminContacts.hook";
import {
  AdminContactsEmptyState,
  AdminContactsHeader,
  AdminContactsLoading,
  AdminContactsToolbar,
} from "./AdminContacts.ui";
import { ContactListItem } from "./ContactListItem";
import { DeleteEnquiryDialog } from "./DeleteEnquiryDialog";
import { ToastSnackbar } from "./ToastSnackbar";

export default function AdminContacts() {
  const {
    contacts,
    loading,
    error,
    tab,
    setTab,
    expanded,
    setExpanded,
    toast,
    setToast,
    unreadCount,
    filtered,
    handleMarkRead,
    deleteTarget,
    setDeleteTarget,
    handleDelete,
    deleting,
  } = useAdminContacts();

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
          <AdminContactsHeader unreadCount={unreadCount} />
          <AdminContactsToolbar
            tab={tab}
            setTab={setTab}
            unreadCount={unreadCount}
            totalCount={contacts.length}
          />

          {loading && <AdminContactsLoading />}
          {!loading && error && <Alert severity="error">{error}</Alert>}
          {!loading && !error && filtered.length === 0 && (
            <AdminContactsEmptyState />
          )}

          {!loading &&
            !error &&
            filtered.map((c) => (
              <ContactListItem
                key={c.id}
                contact={c}
                expanded={expanded}
                onToggleExpanded={(id) =>
                  setExpanded(expanded === id ? null : id)
                }
                onMarkRead={handleMarkRead}
                onDelete={(id) => setDeleteTarget(id)}
              />
            ))}
        </CardContent>
      </Card>

      <DeleteEnquiryDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />

      <ToastSnackbar toast={toast} onClose={() => setToast(null)} />
    </Box>
  );
}
