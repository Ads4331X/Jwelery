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

export const submitContact = async (
  data: ContactFormData,
): Promise<{ error: string | null }> => {
  const { error } = await supabase.from("contacts").insert(data);
  if (error) return { error: error.message };
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
