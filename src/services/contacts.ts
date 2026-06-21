const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const TOKEN_KEY = "admin_token";

//TYPES

export interface Contact {
  id: string;
  fullName?: string;
  name?: string;
  phone?: string;
  email: string;
  message: string;
  status: "UNREAD" | "READ" | "REPLIED";
  createdAt?: string;
  created_at?: string;
  is_read?: boolean;
  inquiry?: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  inquiry: string;
  message: string;
}

//CREATE INQUIRY

export const submitContact = async (
  data: ContactFormData,
): Promise<{ error: string | null }> => {
  try {
    const payload = {
      fullName: data.name,
      phone: data.phone,
      email: data.email,
      message: data.inquiry
        ? `[${data.inquiry}]${data.message ? `\n\n${data.message}` : ""}`
        : data.message,
    };

    const res = await fetch(`${API_URL}/api/inquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      return {
        error:
          json.message || json.errors?.[0]?.msg || "Failed to submit inquiry",
      };
    }

    return { error: null };
  } catch {
    return { error: "Network error. Please try again." };
  }
};

//  GET ALL INQUIRIES (ADMIN)

export const fetchContacts = async (): Promise<Contact[]> => {
  const token = localStorage.getItem(TOKEN_KEY);

  const res = await fetch(`${API_URL}/api/inquiry`, {
    method: "GET",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || "Failed to fetch inquiries");
  }

  const data: Record<string, unknown>[] = json.data ?? [];

  return data.map((raw) => {
    const status: Contact["status"] =
      raw.status === "READ" || raw.status === "REPLIED" ? raw.status : "UNREAD";

    const is_read = status !== "UNREAD";

    // Parse inquiry type back out of "[General Inquiry]\n\nActual message"
    const rawMessage = (raw.message as string) ?? "";
    const inquiryMatch = rawMessage.match(/^\[([^\]]+)\]/);
    const inquiry = inquiryMatch ? inquiryMatch[1] : "";
    const message = inquiryMatch
      ? rawMessage.replace(/^\[[^\]]+\]\n*/, "").trim()
      : rawMessage;

    const createdAt = (raw.createdAt ?? raw.created_at) as string | undefined;

    return {
      id: raw.id as string,
      name: ((raw.fullName ?? raw.name) as string) ?? "",
      fullName: (raw.fullName as string) ?? "",
      phone: (raw.phone as string) ?? "",
      email: (raw.email as string) ?? "",
      message,
      inquiry,
      status,
      is_read,
      createdAt: createdAt ?? undefined,
      created_at: createdAt ?? undefined,
    } as Contact;
  });
};

// UPDATE STATUS (READ / UNREAD / REPLIED)

export const updateInquiryStatus = async (
  id: string,
  status: "UNREAD" | "READ" | "REPLIED",
): Promise<{ error: string | null }> => {
  try {
    const res = await fetch(`${API_URL}/api/inquiry/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem(TOKEN_KEY)
          ? `Bearer ${localStorage.getItem(TOKEN_KEY)}`
          : "",
      },
      body: JSON.stringify({ status }),
    });

    const json = await res.json();

    if (!res.ok) return { error: json.message || "Failed to update status" };
    return { error: null };
  } catch {
    return { error: "Network error" };
  }
};

//  DELETE INQUIRY

export const deleteContact = async (
  id: string,
): Promise<{ error: string | null }> => {
  try {
    const res = await fetch(`${API_URL}/api/inquiry/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem(TOKEN_KEY)
          ? `Bearer ${localStorage.getItem(TOKEN_KEY)}`
          : "",
      },
    });

    const json = await res.json();

    if (!res.ok) return { error: json.message || "Failed to delete inquiry" };
    return { error: null };
  } catch {
    return { error: "Network error" };
  }
};
