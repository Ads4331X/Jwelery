import { useState, useEffect, useRef } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  fetchSiteSettings,
  updateSiteSettings,
  uploadSiteImage,
} from "../../../../services/siteSettings";
import type { SiteSettings } from "../../../../services/siteSettings";

type Toast = { msg: string; severity: "success" | "error" };
type FormState = Omit<SiteSettings, "id">;

const EMPTY: FormState = {
  hero_image_url: "",
  tagline: "",
  about_text: "",
  address: "",
  maps_url: "",
  email: "",
  phone: "",
  facebook_url: "",
  instagram_url: "",
};

export default function AdminSiteSettings() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void (async () => {
      const data = await fetchSiteSettings();
      if (data) {
        const { id, ...rest } = data;
        setForm(rest);
      }
      setLoading(false);
    })();
  }, []);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageError(null);
    setUploading(true);
    const { url, error } = await uploadSiteImage(file);
    setUploading(false);
    if (error || !url) {
      setImageError(error ?? "Upload failed.");
    } else {
      set("hero_image_url", url);
    }
    e.target.value = "";
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateSiteSettings(form);
    setSaving(false);
    setToast({
      msg: error ?? "Settings saved.",
      severity: error ? "error" : "success",
    });
  };

  if (loading) {
    return (
      <Box className="flex justify-center py-16">
        <CircularProgress size={28} className="text-stone-400" />
      </Box>
    );
  }

  return (
    <Box className="flex flex-col gap-6">
      <Box>
        <Typography variant="h5" className="font-semibold text-stone-800 mb-1">
          Site Settings
        </Typography>
        <Typography variant="body2" className="text-stone-400">
          Edit your homepage banner, story, and contact details.
        </Typography>
      </Box>

      <Card elevation={0} className="border border-stone-100 rounded-xl">
        <CardContent className="p-6 flex flex-col gap-5">
          {/* Hero image */}
          <Box>
            <Typography
              variant="caption"
              className="text-stone-500 mb-1.5 block font-medium uppercase tracking-wide text-xs"
            >
              Hero / Banner Image
            </Typography>
            <Box className="flex items-center gap-3">
              <Box className="w-28 h-20 rounded-xl border border-stone-200 overflow-hidden flex items-center justify-center bg-stone-50 shrink-0">
                {form.hero_image_url ? (
                  <img
                    src={form.hero_image_url}
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
                {form.hero_image_url && (
                  <Button
                    size="small"
                    onClick={() => set("hero_image_url", "")}
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

          {/* Tagline */}
          <TextField
            label="Tagline"
            size="small"
            fullWidth
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            placeholder="e.g. Handcrafted gold & silver jewelry..."
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />

          {/* About text */}
          <TextField
            label="About Us Text"
            size="small"
            fullWidth
            multiline
            rows={4}
            value={form.about_text}
            onChange={(e) => set("about_text", e.target.value)}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
          />

          <Divider />

          <Typography
            variant="caption"
            className="text-stone-500 font-medium uppercase tracking-wide text-xs"
          >
            Contact Info
          </Typography>

          <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextField
              label="Address"
              size="small"
              fullWidth
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              label="Google Maps URL"
              size="small"
              fullWidth
              value={form.maps_url}
              onChange={(e) => set("maps_url", e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              label="Email"
              size="small"
              fullWidth
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              label="Phone (with country code)"
              size="small"
              fullWidth
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              label="Facebook URL"
              size="small"
              fullWidth
              value={form.facebook_url}
              onChange={(e) => set("facebook_url", e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
            <TextField
              label="Instagram URL"
              size="small"
              fullWidth
              value={form.instagram_url}
              onChange={(e) => set("instagram_url", e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
            />
          </Box>

          <Box className="flex justify-end">
            <Button
              variant="contained"
              disableElevation
              onClick={handleSave}
              disabled={saving || uploading}
              className="normal-case rounded-lg h-9"
              sx={{
                backgroundColor: "#1c1917",
                "&:hover": { backgroundColor: "#292524" },
              }}
            >
              {saving ? (
                <CircularProgress size={16} className="text-white" />
              ) : (
                "Save changes"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={toast !== null}
        autoHideDuration={3500}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast(null)}
          severity={toast?.severity}
          variant="filled"
          className="text-sm rounded-xl shadow-lg"
        >
          {toast?.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
