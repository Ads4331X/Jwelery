import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import ConfirmDialog from "../../components/shared/ConfirmDialog";
import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
  type SavedAddress,
} from "../../services/addressesApi";

type AddressForm = {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
};

function emptyForm(): AddressForm {
  return {
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
  };
}

function fieldSx() {
  return {
    "& .MuiOutlinedInput-root": { borderRadius: "10px", fontSize: "0.88rem" },
    "& .MuiInputLabel-root": { fontSize: "0.82rem" },
  };
}

export default function MyAddresses() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);

  const [saving, setSaving] = useState(false);

  const [formMode, setFormMode] = useState<
    "create" | { editId: string } | null
  >(null);

  const [form, setForm] = useState<AddressForm>(emptyForm());

  const [formErr, setFormErr] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const defaultId = useMemo(
    () => addresses.find((a) => a.isDefault)?.id ?? null,
    [addresses],
  );

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAddresses();
      if (res.error) {
        setError(res.error);
        return;
      }
      setAddresses(res.data ?? []);
    } catch {
      setError("Cannot reach server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const run = async () => {
      await refresh();
    };
    run();
  }, []);

  const startCreate = () => {
    setFormErr(null);
    setFormSuccess(false);
    setForm(emptyForm());
    setFormMode("create");
  };

  const startEdit = (a: SavedAddress) => {
    setFormErr(null);
    setFormSuccess(false);
    setForm({
      fullName: a.fullName ?? "",
      phone: a.phone ?? "",
      street: a.street ?? "",
      city: a.city ?? "",
      state: a.state ?? "",
      postalCode: a.postalCode ?? "",
    });
    setFormMode({ editId: a.id });
  };

  const cancelForm = () => {
    setFormMode(null);
    setForm(emptyForm());
    setFormErr(null);
    setFormSuccess(false);
  };

  const validate = (): string | null => {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!form.street.trim()) return "Street is required.";
    if (!form.city.trim()) return "City is required.";
    return null;
  };

  const handleSubmit = async () => {
    setFormErr(null);
    setFormSuccess(false);

    const err = validate();
    if (err) {
      setFormErr(err);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        street: form.street.trim(),
        city: form.city.trim(),
        state: form.state.trim() ? form.state.trim() : null,
        postalCode: form.postalCode.trim() ? form.postalCode.trim() : null,
        isDefault: false,
      };

      if (formMode === "create") {
        const res = await createAddress(payload);
        if (res.error) {
          setFormErr(res.error);
          return;
        }
      } else if (formMode && typeof formMode === "object") {
        const res = await updateAddress(formMode.editId, payload);
        if (res.error) {
          setFormErr(res.error);
          return;
        }
      }

      setFormSuccess(true);
      await refresh();
      cancelForm();
    } catch {
      setFormErr("Could not save address. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = (id: string) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;

    setSaving(true);
    try {
      const res = await deleteAddress(deleteTargetId);
      if (res.error) {
        setFormErr(res.error);
        return;
      }
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
      await refresh();
    } catch {
      setFormErr("Could not delete address. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    setSaving(true);
    try {
      const res = await setDefaultAddress(id);
      if (res.error) {
        setFormErr(res.error);
        return;
      }
      await refresh();
    } catch {
      setFormErr("Could not set default address. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const showingForm = formMode !== null;

  return (
    <Box>
      <Box className="flex items-center justify-between gap-3 mb-4">
        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600,
            fontSize: "1.05rem",
            color: "#1c1917",
          }}
        >
          My Addresses
        </Typography>

        {!showingForm ? (
          <Button
            onClick={startCreate}
            variant="outlined"
            sx={{
              borderColor: "rgba(180,83,9,0.22)",
              color: "#b45309",
              borderRadius: "999px",
              fontWeight: 800,
              textTransform: "uppercase",
            }}
          >
            + Add New Address
          </Button>
        ) : null}
      </Box>

      <Divider sx={{ my: 3, borderColor: "rgba(180,83,9,0.08)" }} />

      {error ? (
        <Alert severity="error" sx={{ mt: 2, fontSize: "0.78rem" }}>
          {error}
        </Alert>
      ) : null}

      {loading ? (
        <Box sx={{ py: 2, display: "flex", alignItems: "center" }}>
          <CircularProgress size={18} />
          <Typography sx={{ ml: 1, color: "#78716c", fontSize: "0.8rem" }}>
            Loading addresses...
          </Typography>
        </Box>
      ) : addresses.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No saved addresses yet.
        </Alert>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <RadioGroup value={defaultId ?? ""}>
            {addresses.map((a) => (
              <Box
                key={a.id}
                sx={{
                  border: "1px solid rgba(180,83,9,0.08)",
                  borderRadius: "16px",
                  p: 2,
                  background: a.isDefault ? "rgba(180,83,9,0.05)" : "#fff",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
                >
                  <Radio
                    checked={a.id === defaultId}
                    onChange={() => handleSetDefault(a.id)}
                    value={a.id}
                    sx={{
                      color: "#b45309",
                      "&.Mui-checked": { color: "#b45309" },
                    }}
                    disabled={saving}
                  />

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 800, color: "#1c1917" }}>
                      {a.fullName}
                      {a.isDefault ? (
                        <Typography
                          component="span"
                          sx={{ ml: 1, color: "#b45309" }}
                        >
                          (Default)
                        </Typography>
                      ) : null}
                    </Typography>
                    <Typography sx={{ fontSize: "0.82rem", color: "#78716c" }}>
                      {a.phone}
                    </Typography>
                    <Typography sx={{ fontSize: "0.82rem", color: "#1c1917" }}>
                      {a.street}, {a.city}
                      {a.state ? `, ${a.state}` : ""}
                      {a.postalCode ? ` - ${a.postalCode}` : ""}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Button
                      variant="text"
                      onClick={() => startEdit(a)}
                      disabled={saving}
                      sx={{
                        color: "#b45309",
                        textTransform: "uppercase",
                        fontWeight: 900,
                        fontSize: "0.75rem",
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="text"
                      onClick={() => confirmDelete(a.id)}
                      disabled={saving}
                      sx={{
                        color: "#dc2626",
                        textTransform: "uppercase",
                        fontWeight: 900,
                        fontSize: "0.75rem",
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </RadioGroup>
        </Box>
      )}

      {showingForm ? (
        <Box
          sx={{
            mt: 3,
            border: "1px solid rgba(180,83,9,0.10)",
            borderRadius: "20px",
            p: 3,
            background: "#fff",
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              fontSize: "1.05rem",
              color: "#1c1917",
              mb: 2,
            }}
          >
            {formMode === "create" ? "Add Address" : "Edit Address"}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Full name"
              size="small"
              value={form.fullName}
              onChange={(e) =>
                setForm((p) => ({ ...p, fullName: e.target.value }))
              }
              sx={fieldSx()}
            />
            <TextField
              label="Phone number"
              size="small"
              value={form.phone}
              onChange={(e) =>
                setForm((p) => ({ ...p, phone: e.target.value }))
              }
              sx={fieldSx()}
            />

            <TextField
              label="Street"
              size="small"
              value={form.street}
              onChange={(e) =>
                setForm((p) => ({ ...p, street: e.target.value }))
              }
              sx={fieldSx()}
            />

            <TextField
              label="City"
              size="small"
              value={form.city}
              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
              sx={fieldSx()}
            />

            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
            >
              <TextField
                label="State (optional)"
                size="small"
                value={form.state}
                onChange={(e) =>
                  setForm((p) => ({ ...p, state: e.target.value }))
                }
                sx={fieldSx()}
              />
              <TextField
                label="Postal code (optional)"
                size="small"
                value={form.postalCode}
                onChange={(e) =>
                  setForm((p) => ({ ...p, postalCode: e.target.value }))
                }
                sx={fieldSx()}
              />
            </Box>

            {formErr ? (
              <Alert severity="error" sx={{ fontSize: "0.78rem" }}>
                {formErr}
              </Alert>
            ) : null}
            {formSuccess ? (
              <Alert severity="success" sx={{ fontSize: "0.78rem" }}>
                Saved successfully.
              </Alert>
            ) : null}

            <Box sx={{ display: "flex", gap: 1.5 }}>
              <Button
                onClick={handleSubmit}
                disabled={saving}
                sx={{
                  flex: 1,
                  bgcolor: "linear-gradient(135deg, #92400e, #b45309)",
                }}
                variant="contained"
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                onClick={cancelForm}
                disabled={saving}
                variant="outlined"
                sx={{
                  flex: 1,
                  borderColor: "rgba(180,83,9,0.25)",
                  color: "#b45309",
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      ) : null}

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete address?"
        description="This address will be permanently removed from your saved addresses."
        confirmText={saving ? "Deleting..." : "Delete"}
        danger
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
