export type SavedAddress = {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string | null;
  postalCode: string | null;
  isDefault: boolean;
};
