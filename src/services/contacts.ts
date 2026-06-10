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
  "name" | "phone" | "email" | "inquiry" | "message"
>;

const FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSep7iTfNY_VKeIIJAzIFXIggicXDz5664wFHpi3KX9hD5z_RQ/formResponse";

const submitToGoogleForms = (data: ContactFormData) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = FORM_ACTION;
  form.target = "hidden-google-iframe";
  form.style.display = "none";

  const fields: Record<string, string> = {
    "entry.854124261": data.name,
    "entry.1234484138": data.phone,
    "entry.194044286": data.email,
    "entry.1371665099": data.inquiry,
    "entry.768698657": data.message,
  };

  Object.entries(fields).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  setTimeout(() => document.body.removeChild(form), 1000);
};

export const submitContact = async (
  data: ContactFormData,
): Promise<{ error: string | null }> => {
  const { error } = await supabase.from("contacts").insert(data);
  if (error) return { error: error.message };
  submitToGoogleForms(data);
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
