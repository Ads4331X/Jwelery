import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteContact,
  fetchContacts,
  updateInquiryStatus,
} from "../../../../services/contacts";
import type { Contact } from "../../../../services/contacts";

type TabValue = "all" | "unread" | "read";

export function useAdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabValue>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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
    const t = window.setTimeout(() => void load(), 0);
    return () => window.clearTimeout(t);
  }, [load]);

  const unreadCount = useMemo(
    () => contacts.filter((c) => c.status === "UNREAD").length,
    [contacts],
  );

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      if (tab === "all") return true;
      if (tab === "unread") return c.status === "UNREAD";
      return c.status === "READ" || c.status === "REPLIED";
    });
  }, [contacts, tab]);

  const handleMarkRead = useCallback(async (c: Contact) => {
    const nextStatus = c.status === "READ" ? "UNREAD" : "READ";

    //  update both status and is_read optimistically
    setContacts((prev) =>
      prev.map((x) =>
        x.id === c.id
          ? { ...x, status: nextStatus, is_read: nextStatus !== "UNREAD" }
          : x,
      ),
    );

    const { error } = await updateInquiryStatus(c.id, nextStatus);
    if (error) {
      // Rollback
      setContacts((prev) =>
        prev.map((x) =>
          x.id === c.id
            ? { ...x, status: c.status, is_read: c.status !== "UNREAD" }
            : x,
        ),
      );
      setToast("Failed to update.");
    }
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget || deleting) return;

    const id = deleteTarget;
    const exists = contacts.some((c) => c.id === id);

    if (!exists) {
      setToast("Enquiry not found.");
      setDeleteTarget(null);
      return;
    }

    setDeleting(true);
    setContacts((prev) => prev.filter((x) => x.id !== id));

    const { error } = await deleteContact(id);
    setDeleteTarget(null);
    setDeleting(false);

    if (error) {
      setToast("Failed to delete.");
      void load();
    }
  }, [contacts, deleteTarget, deleting, load]);

  return {
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
    load,
  };
}
