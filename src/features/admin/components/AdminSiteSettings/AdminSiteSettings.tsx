import { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import MapIcon from "@mui/icons-material/Map";
import {
  getSiteSettings,
  saveSiteSettings,
} from "../../../../services/siteSettings";
import { SETTINGS_DEFAULTS } from "./useSiteSettings";

type Message = { type: "success" | "error"; text: string };

type Fields = {
  address: string;
  maps_url: string;
  email: string;
  phone: string;
  facebook_url: string;
  instagram_url: string;
};

const FIELD_CONFIG: {
  key: keyof Fields;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  helperText?: string;
}[] = [
  {
    key: "address",
    label: "Address",
    icon: (
      <LocationOnOutlinedIcon fontSize="small" className="text-amber-700" />
    ),
    placeholder: "e.g. Sukra Path, Kathmandu",
  },
  {
    key: "maps_url",
    label: "Google Maps URL",
    icon: <MapIcon fontSize="small" className="text-amber-700" />,
    placeholder: "https://www.google.com/maps?...",
    helperText: "Used for the map link in the footer and contact page.",
  },
  {
    key: "email",
    label: "Email Address",
    icon: <EmailOutlinedIcon fontSize="small" className="text-amber-700" />,
    placeholder: "e.g. anand.jewellers.np@gmail.com",
  },
  {
    key: "phone",
    label: "Phone Number",
    icon: <PhoneOutlinedIcon fontSize="small" className="text-amber-700" />,
    placeholder: "e.g. 01-5347461",
  },
  {
    key: "facebook_url",
    label: "Facebook Page URL",
    icon: <FacebookIcon fontSize="small" className="text-amber-700" />,
    placeholder: "https://www.facebook.com/...",
  },
  {
    key: "instagram_url",
    label: "Instagram Profile URL",
    icon: <InstagramIcon fontSize="small" className="text-amber-700" />,
    placeholder: "https://www.instagram.com/...",
  },
];

export default function AdminSiteSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  const [fields, setFields] = useState<Fields>({
    address: "",
    maps_url: "",
    email: "",
    phone: "",
    facebook_url: "",
    instagram_url: "",
  });

  useEffect(() => {
    void (async () => {
      const row = await getSiteSettings();
      if (row) {
        setFields({
          address: row.address || SETTINGS_DEFAULTS.address,
          maps_url: row.maps_url || SETTINGS_DEFAULTS.maps_url,
          email: row.email || SETTINGS_DEFAULTS.email,
          phone: row.phone || SETTINGS_DEFAULTS.phone,
          facebook_url: row.facebook_url || SETTINGS_DEFAULTS.facebook_url,
          instagram_url: row.instagram_url || SETTINGS_DEFAULTS.instagram_url,
        });
        setUpdatedAt(row.updated_at);
      }
      setLoading(false);
    })();
  }, []);

  const handleChange = (key: keyof Fields, value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setMessage(null);

    // Basic validation
    if (!fields.email.trim() || !fields.email.includes("@")) {
      setMessage({
        type: "error",
        text: "Please enter a valid email address.",
      });
      return;
    }
    if (!fields.address.trim()) {
      setMessage({ type: "error", text: "Address cannot be empty." });
      return;
    }

    setSaving(true);
    const { error } = await saveSiteSettings(fields);
    setSaving(false);

    if (error) {
      setMessage({ type: "error", text: error });
    } else {
      setUpdatedAt(new Date().toISOString());
      setMessage({
        type: "success",
        text: "Site settings saved successfully.",
      });
    }
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
          Update your contact details and social links. Changes appear live on
          the site.
          {updatedAt && (
            <Box component="span" className="ml-2 text-stone-300">
              Last updated: {new Date(updatedAt).toLocaleString()}
            </Box>
          )}
        </Typography>
      </Box>

      <Card elevation={0} className="border border-stone-100 rounded-xl">
        <CardContent className="p-6">
          <Box className="flex items-center gap-2 mb-4">
            <SettingsIcon className="text-amber-700" />
            <Typography
              variant="subtitle1"
              className="font-semibold text-stone-800"
            >
              Contact & Social Info
            </Typography>
          </Box>
          <Divider className="mb-6" />

          {message && (
            <Alert severity={message.type} className="mb-6 text-sm">
              {message.text}
            </Alert>
          )}

          <Box className="flex flex-col gap-5">
            {FIELD_CONFIG.map(
              ({ key, label, icon, placeholder, helperText }) => (
                <Box key={key}>
                  <Box className="flex items-center gap-2 mb-1.5">
                    {icon}
                    <Typography
                      variant="caption"
                      className="text-stone-600 font-medium uppercase tracking-wide text-xs"
                    >
                      {label}
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    size="small"
                    value={fields[key]}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                    helperText={helperText}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                    }}
                  />
                </Box>
              ),
            )}
          </Box>

          <Box className="mt-8">
            <Button
              variant="contained"
              disableElevation
              onClick={handleSave}
              disabled={saving}
              className="normal-case rounded-lg h-9"
              sx={{
                backgroundColor: "#b45309",
                "&:hover": { backgroundColor: "#92400e" },
              }}
            >
              {saving ? (
                <CircularProgress size={18} className="text-white" />
              ) : (
                "Save Settings"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
