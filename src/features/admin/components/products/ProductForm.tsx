import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Divider,
  Typography,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { uploadProductImage } from "../../../../services/productsApi";
import type { AdminProduct, ProductFormData } from "./types";
import { CATEGORIES } from "./types";

const STATUSES = ["Available", "Sold Out"] as const;

const EMPTY: ProductFormData = {
  name: "",
  category: "Necklace",
  description: "",
  price: 0,
  image_url: "",
  is_featured: false,
  status: "Available",
};

interface Props {
  open: boolean;
  editing: AdminProduct | null;
  saving: boolean;
  onSave: (data: ProductFormData) => void;
  onClose: () => void;
}

export default function ProductForm({
  open,
  editing,
  saving,
  onSave,
  onClose,
}: Props) {
  const [form, setForm] = useState<ProductFormData>(EMPTY);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const next = editing
      ? {
          name: editing.name,
          category: editing.category,
          description: editing.description,
          price: editing.price,
          image_url: editing.image_url,
          is_featured: editing.is_featured,
          status: editing.status,
        }
      : EMPTY;

    setTimeout(() => {
      setForm(next);
      setImageError(null);
    }, 0);
  }, [editing, open]);

  const set = <K extends keyof ProductFormData>(k: K, v: ProductFormData[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);
    setUploading(true);
    const { url, error } = await uploadProductImage(file);
    setUploading(false);
    if (error || !url) {
      setImageError(error ?? "Upload failed.");
    } else {
      set("image_url", url);
    }
    // reset so the same file can be re-picked after an error
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (form.price <= 0) return;
    onSave(form);
  };

  const isValid = form.name.trim() !== "" && form.price > 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      slotProps={{ paper: { className: "rounded-2xl", sx: { maxWidth: 520 } } }}
    >
      <DialogTitle className="pb-2">
        <Typography className="font-semibold text-stone-800 text-base">
          {editing ? "Edit product" : "Add product"}
        </Typography>
      </DialogTitle>
      <Divider />

      <DialogContent className="flex flex-col gap-4 pt-4">
        {/* Image */}
        <Box>
          <Typography
            variant="caption"
            className="text-stone-500 mb-1.5 block font-medium uppercase tracking-wide text-xs"
          >
            Image
          </Typography>
          <Box className="flex items-center gap-3">
            <Box className="w-20 h-20 rounded-xl border border-stone-200 overflow-hidden flex items-center justify-center bg-stone-50 shrink-0">
              {form.image_url ? (
                <img
                  src={form.image_url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <AddPhotoAlternateIcon className="text-stone-300" />
              )}
            </Box>
            <Box className="flex flex-col gap-1.5">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImagePick}
              />
              <Button
                size="small"
                variant="outlined"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="normal-case rounded-lg border-stone-200 text-stone-600 text-xs"
              >
                {uploading ? <CircularProgress size={14} /> : "Upload image"}
              </Button>
              {form.image_url && (
                <Button
                  size="small"
                  onClick={() => set("image_url", "")}
                  className="normal-case text-stone-400 text-xs p-0 min-w-0"
                >
                  Remove
                </Button>
              )}
            </Box>
          </Box>
          {imageError && (
            <Alert severity="error" className="mt-2 text-xs py-1">
              {imageError}
            </Alert>
          )}
        </Box>

        {/* Name */}
        <TextField
          label="Name"
          size="small"
          fullWidth
          required
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
        />

        {/* Category + Status row */}
        <Box className="grid grid-cols-2 gap-3">
          <TextField
            select
            label="Category"
            size="small"
            fullWidth
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          >
            {CATEGORIES.filter((c) => c !== "All").map((c: string) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Status"
            size="small"
            fullWidth
            value={form.status}
            onChange={(e) =>
              set("status", e.target.value as ProductFormData["status"])
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          >
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Price */}
        <TextField
          label="Price (Rs)"
          size="small"
          fullWidth
          required
          type="number"
          value={form.price === 0 ? "" : form.price}
          onChange={(e) => set("price", Number(e.target.value))}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
        />

        {/* Description */}
        <TextField
          label="Description"
          size="small"
          fullWidth
          multiline
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
        />

        {/* Featured */}
        <FormControlLabel
          control={
            <Switch
              checked={form.is_featured}
              onChange={(e) => set("is_featured", e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#b45309" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#b45309",
                },
              }}
            />
          }
          label={
            <Typography variant="body2" className="text-stone-700">
              Featured product
            </Typography>
          }
        />
      </DialogContent>

      <Divider />
      <DialogActions className="px-6 py-3 gap-2">
        <Button
          onClick={onClose}
          disabled={saving}
          variant="outlined"
          size="small"
          className="normal-case rounded-lg border-stone-200 text-stone-600"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={saving || !isValid || uploading}
          variant="contained"
          disableElevation
          size="small"
          className="normal-case rounded-lg bg-stone-800 hover:bg-stone-700"
          sx={{
            backgroundColor: "#1c1917",
            "&:hover": { backgroundColor: "#292524" },
          }}
        >
          {saving ? (
            <Box className="flex items-center gap-2">
              <CircularProgress size={16} className="text-white" />
              <span className="text-white text-xs font-medium">Saving</span>
            </Box>
          ) : editing ? (
            "Save changes"
          ) : (
            "Add product"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
