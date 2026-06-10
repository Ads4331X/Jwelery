import { supabase } from "./supabase";

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  inquiry: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export type ContactFormData = Pick<
  Contact,
  "name" | "email" | "inquiry" | "message" | "phone"
>;

// Replace these with your real entry IDs from the form
const FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSep7iTfNY_VKeIIJAzIFXIggicXDz5664wFHpi3KX9hD5z_RQ/formResponse";
const ENTRY = {
  name: "entry.XXXXXXXXX", // ← replace
  email: "entry.XXXXXXXXX", // ← replace
  phone: "entry.XXXXXXXXX", // ← replace
  inquiry: "entry.XXXXXXXXX", // ← replace
  message: "entry.XXXXXXXXX", // ← replace
};

const submitToGoogleForms = (data: ContactFormData) => {
  const body = new URLSearchParams({
    [ENTRY.name]: data.name,
    [ENTRY.email]: data.email,
    // Phone is optional for now (store schema supports it, but UI may not)
    [ENTRY.inquiry]: data.inquiry,
    [ENTRY.message]: data.message,
  });

  // fire-and-forget — CORS will block the response but submission still works
  fetch(FORM_ACTION, { method: "POST", body, mode: "no-cors" }).catch(() => {});
};

export const submitContact = async (
  data: ContactFormData,
): Promise<{ error: string | null }> => {
  // Ensure phone is not required by the form currently
  const payload = {
    ...data,
    phone: (data as Partial<Contact>).phone ?? "",
  };

  const { error } = await supabase.from("contacts").insert(payload);

  if (error) return { error: error.message };
  submitToGoogleForms(data); // backup to Google Forms, non-blocking

  return { error: null };
};

export const fetchContacts = async (): Promise<Contact[]> => {
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Contact[];
};

export const markRead = async (
  id: string,
  is_read: boolean,
): Promise<{ error: string | null }> => {
  const { error } = await supabase
    .from("contacts")
    .update({ is_read })
    .eq("id", id);
  return { error: error?.message ?? null };
};

export const deleteContact = async (
  id: string,
): Promise<{ error: string | null }> => {
  const { error } = await supabase.from("contacts").delete().eq("id", id);
  return { error: error?.message ?? null };
};
