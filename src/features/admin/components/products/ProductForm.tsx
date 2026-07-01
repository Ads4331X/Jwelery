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
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
  Tooltip,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";

import {
  uploadProductImage,
  fetchCategories,
} from "../../../../services/productsApi";
import type { CategoryOption } from "../../../../services/productsApi";
import type { AdminProduct, ProductFormData } from "./types";
import { METALS, METAL_LABELS } from "./types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const EMPTY: ProductFormData = {
  name: "",
  slug: "",
  description: "",
  categoryId: "",
  metalType: "GOLD",
  weightGrams: "",
  purity: "",
  makingCharge: "",
  makingChargeType: "FIXED",
  wastagePercent: "",
  vatPercent: 13,
  stock: "",
  isFeatured: false,
  isDealOfDay: false,
  isActive: true,
  imageUrls: [],
};

// ─── Component ────────────────────────────────────────────────────────────────

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
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Load categories from backend ──────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setCatLoading(true);
      try {
        const cats = await fetchCategories();
        setCategories(cats);
      } catch {
        // categories stay empty — user will see empty dropdown
      } finally {
        setCatLoading(false);
      }
    };
    load();
  }, []);

  // ── Populate form when editing ────────────────────────────────────────────
  useEffect(() => {
    const next: ProductFormData = editing
      ? {
          name: editing.name,
          slug: editing.slug,
          description: editing.description ?? "",
          categoryId: editing.category.id,
          metalType: editing.metalType,
          weightGrams: editing.weightGrams,
          purity: editing.purity ?? "",
          makingCharge: editing.makingCharge,
          makingChargeType: editing.makingChargeType,
          wastagePercent: editing.wastagePercent,
          vatPercent: editing.vatPercent,
          stock: editing.stock,
          isFeatured: editing.isFeatured,
          isDealOfDay: editing.isDealOfDay,
          isActive: editing.isActive,
          imageUrls: editing.images
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((img) => img.url),
        }
      : EMPTY;

    setTimeout(() => {
      setForm(next);
      setImageError(null);
      setSlugEdited(!!editing);
    }, 0);
  }, [editing, open]);

  const set = <K extends keyof ProductFormData>(k: K, v: ProductFormData[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleNameChange = (v: string) => {
    set("name", v);
    if (!slugEdited) set("slug", toSlug(v));
  };

  // ── Image upload ──────────────────────────────────────────────────────────
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
      set("imageUrls", [...form.imageUrls, url]);
    }
    e.target.value = "";
  };

  const removeImage = (idx: number) =>
    set(
      "imageUrls",
      form.imageUrls.filter((_, i) => i !== idx),
    );

  const setPrimary = (idx: number) => {
    const reordered = [...form.imageUrls];
    const [picked] = reordered.splice(idx, 1);
    reordered.unshift(picked);
    set("imageUrls", reordered);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!form.name.trim()) return;
    onSave(form);
  };

  const isValid =
    form.name.trim() !== "" &&
    form.slug.trim() !== "" &&
    form.categoryId !== "" &&
    form.weightGrams !== "" &&
    Number(form.weightGrams) > 0;

  // ── Price preview ─────────────────────────────────────────────────────────
  const makingChargeNum = Number(form.makingCharge || 0);
  const wastageNum = Number(form.wastagePercent || 0);
  const vatNum = Number(form.vatPercent || 0);
  const weightNum = Number(form.weightGrams || 0);

  const priceNote =
    weightNum > 0
      ? form.makingChargeType === "FIXED"
        ? `Making: Rs ${makingChargeNum.toFixed(0)} flat · Wastage: ${wastageNum}% · VAT: ${vatNum}%`
        : `Making: ${makingChargeNum}% of metal · Wastage: ${wastageNum}% · VAT: ${vatNum}%`
      : null;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      slotProps={{
        paper: {
          className: "rounded-2xl",
          sx: { maxWidth: 580 },
        },
      }}
    >
      <DialogTitle className="pb-2">
        <Typography className="font-semibold text-stone-800 text-base">
          {editing ? "Edit product" : "Add product"}
        </Typography>
      </DialogTitle>
      <Divider />

      <DialogContent
        className="flex flex-col gap-5 pt-5"
        sx={{ maxHeight: "70vh", overflowY: "auto" }}
      >
        {/* ── Images ───────────────────────────────────────────────────────── */}
        <Section label="Images">
          <Box className="flex flex-wrap gap-2">
            {form.imageUrls.map((url, idx) => (
              <Box
                key={url}
                className="relative w-20 h-20 rounded-xl border border-stone-200 overflow-hidden group"
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
                {idx === 0 && (
                  <Box className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-amber-700/90 text-white text-[0.55rem] font-bold uppercase tracking-wide">
                    Primary
                  </Box>
                )}
                <Box className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  {idx !== 0 && (
                    <Tooltip title="Set as primary">
                      <IconButton
                        size="small"
                        onClick={() => setPrimary(idx)}
                        sx={{ color: "white", p: 0.5 }}
                      >
                        <StarIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Remove">
                    <IconButton
                      size="small"
                      onClick={() => removeImage(idx)}
                      sx={{ color: "white", p: 0.5 }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            ))}

            <Box
              onClick={() => fileRef.current?.click()}
              className="w-20 h-20 rounded-xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center cursor-pointer hover:border-stone-400 hover:bg-stone-50 transition-colors shrink-0"
            >
              {uploading ? (
                <CircularProgress size={18} className="text-stone-400" />
              ) : (
                <>
                  <AddPhotoAlternateIcon className="text-stone-300 text-lg" />
                  <Typography className="text-stone-400 text-[0.6rem] mt-0.5">
                    Add
                  </Typography>
                </>
              )}
            </Box>
          </Box>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImagePick}
          />
          {imageError && (
            <Alert severity="error" className="mt-2 text-xs py-1">
              {imageError}
            </Alert>
          )}
          <Typography className="text-stone-400 text-[0.68rem] mt-1">
            First image is the primary display image. Use ★ to set primary.
          </Typography>
        </Section>

        {/* ── Basic info ───────────────────────────────────────────────────── */}
        <Section label="Basic Info">
          <TextField
            label="Name"
            size="small"
            fullWidth
            required
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            sx={inputSx}
          />
          <TextField
            label="Slug"
            size="small"
            fullWidth
            required
            value={form.slug}
            onChange={(e) => {
              setSlugEdited(true);
              set("slug", toSlug(e.target.value));
            }}
            helperText="Auto-generated · used in URLs"
            sx={inputSx}
          />
          <TextField
            label="Description"
            size="small"
            fullWidth
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            sx={inputSx}
          />
        </Section>

        {/* ── Classification ───────────────────────────────────────────────── */}
        <Section label="Classification">
          <Box className="grid grid-cols-2 gap-3">
            <TextField
              select
              label="Category"
              size="small"
              fullWidth
              required
              value={form.categoryId}
              onChange={(e) => set("categoryId", e.target.value)}
              disabled={catLoading}
              helperText={catLoading ? "Loading…" : ""}
              sx={inputSx}
            >
              {categories.length === 0 && !catLoading && (
                <MenuItem disabled value="">
                  No categories found
                </MenuItem>
              )}
              {categories.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Purity"
              size="small"
              fullWidth
              placeholder="e.g. 24K, 22K, 92.5%"
              value={form.purity}
              onChange={(e) => set("purity", e.target.value)}
              sx={inputSx}
            />
          </Box>

          <Box>
            <Typography className="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1.5">
              Metal Type
            </Typography>
            <ToggleButtonGroup
              value={form.metalType}
              exclusive
              onChange={(_, v) => {
                if (v) set("metalType", v);
              }}
              size="small"
              sx={{ flexWrap: "wrap", gap: 0.5 }}
            >
              {METALS.map((m) => (
                <ToggleButton
                  key={m}
                  value={m}
                  sx={{
                    borderRadius: "20px !important",
                    border: "1px solid #e7e5e4 !important",
                    px: 2,
                    py: 0.5,
                    fontSize: "0.72rem",
                    textTransform: "none",
                    fontWeight: 500,
                    color: "#78716c",
                    "&.Mui-selected": {
                      backgroundColor: "#1c1917 !important",
                      color: "white !important",
                      borderColor: "#1c1917 !important",
                    },
                  }}
                >
                  {METAL_LABELS[m]}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Section>

        {/* ── Pricing ──────────────────────────────────────────────────────── */}
        <Section label="Pricing">
          <Box className="grid grid-cols-2 gap-3">
            <TextField
              label="Weight (grams)"
              size="small"
              fullWidth
              type="number"
              required
              value={form.weightGrams}
              onChange={(e) =>
                set(
                  "weightGrams",
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              slotProps={{ input: { inputProps: { min: 0, step: 0.001 } } }}
              sx={inputSx}
            />
            <TextField
              label="Wastage %"
              size="small"
              fullWidth
              type="number"
              value={form.wastagePercent}
              onChange={(e) =>
                set(
                  "wastagePercent",
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              slotProps={{ input: { inputProps: { min: 0, step: 0.01 } } }}
              sx={inputSx}
            />
          </Box>

          <Box className="grid grid-cols-3 gap-3">
            <TextField
              label={
                form.makingChargeType === "FIXED"
                  ? "Making Charge (Rs)"
                  : "Making Charge (%)"
              }
              size="small"
              fullWidth
              type="number"
              value={form.makingCharge}
              onChange={(e) =>
                set(
                  "makingCharge",
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              slotProps={{ input: { inputProps: { min: 0, step: 0.01 } } }}
              sx={inputSx}
            />
            <TextField
              select
              label="Charge Type"
              size="small"
              fullWidth
              value={form.makingChargeType}
              onChange={(e) =>
                set(
                  "makingChargeType",
                  e.target.value as ProductFormData["makingChargeType"],
                )
              }
              sx={inputSx}
            >
              <MenuItem value="FIXED">Fixed (Rs)</MenuItem>
              <MenuItem value="PERCENTAGE">% of metal</MenuItem>
            </TextField>
            <TextField
              label="VAT %"
              size="small"
              fullWidth
              type="number"
              value={form.vatPercent}
              onChange={(e) =>
                set(
                  "vatPercent",
                  e.target.value === "" ? "" : Number(e.target.value),
                )
              }
              slotProps={{ input: { inputProps: { min: 0, step: 0.01 } } }}
              sx={inputSx}
            />
          </Box>

          {priceNote && (
            <Box className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2">
              <Typography className="text-amber-800 text-[0.7rem]">
                <strong>Price formula:</strong> (Metal rate × {weightNum}g) +
                wastage + making + VAT
              </Typography>
              <Typography className="text-amber-700 text-[0.68rem] mt-0.5">
                {priceNote}
              </Typography>
              <Typography className="text-amber-600 text-[0.65rem] mt-0.5 italic">
                Final price is computed at checkout using the current metal
                rate.
              </Typography>
            </Box>
          )}
        </Section>

        {/* ── Inventory ────────────────────────────────────────────────────── */}
        <Section label="Inventory">
          <TextField
            label="Stock (units)"
            size="small"
            type="number"
            value={form.stock}
            onChange={(e) =>
              set("stock", e.target.value === "" ? "" : Number(e.target.value))
            }
            slotProps={{ input: { inputProps: { min: 0, step: 1 } } }}
            sx={{ ...inputSx, maxWidth: 180 }}
          />
        </Section>

        {/* ── Visibility ───────────────────────────────────────────────────── */}
        <Section label="Visibility">
          <Box className="flex flex-col gap-1">
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) => set("isActive", e.target.checked)}
                  sx={switchSx}
                />
              }
              label={
                <Typography variant="body2" className="text-stone-700">
                  Active (visible on storefront)
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.isFeatured}
                  onChange={(e) => set("isFeatured", e.target.checked)}
                  sx={switchSx}
                />
              }
              label={
                <Typography variant="body2" className="text-stone-700">
                  Featured product
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.isDealOfDay}
                  onChange={(e) => set("isDealOfDay", e.target.checked)}
                  sx={switchSx}
                />
              }
              label={
                <Typography variant="body2" className="text-stone-700">
                  Deal of the day
                </Typography>
              }
            />
          </Box>
        </Section>
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
          sx={{
            backgroundColor: "#1c1917",
            "&:hover": { backgroundColor: "#292524" },
            borderRadius: "8px",
            textTransform: "none",
          }}
        >
          {saving ? (
            <Box className="flex items-center gap-2">
              <CircularProgress size={16} className="text-white" />
              <span className="text-white text-xs font-medium">Saving…</span>
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

// ─── Small helpers ────────────────────────────────────────────────────────────

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Box className="flex flex-col gap-3">
      <Box className="flex items-center gap-2">
        <Typography className="text-[0.6rem] uppercase tracking-[0.2em] text-stone-400 font-semibold">
          {label}
        </Typography>
        <Box className="flex-1 h-px bg-stone-100" />
      </Box>
      {children}
    </Box>
  );
}

const inputSx = { "& .MuiOutlinedInput-root": { borderRadius: "10px" } };

const switchSx = {
  "& .MuiSwitch-switchBase.Mui-checked": { color: "#b45309" },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#b45309",
  },
};
