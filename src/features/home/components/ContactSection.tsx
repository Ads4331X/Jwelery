import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
} from "@mui/material";
import { submitContact } from "../../../services/contacts";
import type { ContactFormData } from "../../../services/contacts";

const MAPS_URL =
  "https://www.google.com/maps/place/Pashupati+sunchandi+pasal/@27.7413548,85.3464413,15z/data=!4m10!1m2!2m1!1sJewelry+manufacturer!3m6!1s0x87bae54d1de46cbb:0x50398dc4114eec49!8m2!3d27.7413552!4d85.3542036!15sChRKZXdlbHJ5IG1hbnVmYWN0dXJlcpIBFGpld2VscnlfbWFudWZhY3R1cmVy4AEA!16s%2Fg%2F11yct2pnl8?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D";
const EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.1!2d85.3542036!3d27.7413552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87bae54d1de46cbb%3A0x50398dc4114eec49!2sPashupati%20sunchandi%20pasal!5e0!3m2!1sen!2snp!4v1234567890";

const INQUIRY_TYPES = [
  "General Inquiry",
  "Product Query",
  "Custom Order",
  "Wholesale",
];

const EMPTY: ContactFormData = {
  name: "",
  phone: "",
  email: "",
  inquiry: "",
  message: "",
};

type Errors = Partial<ContactFormData>;

const validate = (f: ContactFormData): Errors => {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Name is required";
  if (!f.phone.trim()) e.phone = "Phone number is required";
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
    e.email = "Invalid email";
  if (!f.inquiry) e.inquiry = "Please select an inquiry type";
  return e;
};

const inputSx = {
  "& .MuiInput-root": { fontSize: "0.9rem", color: "#1a1207" },
  "& .MuiInput-underline:before": { borderBottomColor: "rgba(180,83,9,0.2)" },
  "& .MuiInput-underline:hover:before": {
    borderBottomColor: "#b45309 !important",
  },
  "& .MuiInput-underline:after": { borderBottomColor: "#b45309" },
  "& .MuiInputLabel-root": {
    fontSize: "0.7rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "rgba(0,0,0,0.4)",
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#b45309" },
  "& .MuiFormHelperText-root": { fontSize: "0.65rem" },
};

export function ContactSection() {
  const [form, setForm] = useState<ContactFormData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set =
    (key: keyof ContactFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev: ContactFormData) => ({
        ...prev,
        [key]: e.target.value,
      }));

      if (errors[key])
        setErrors((prev: Errors) => ({
          ...prev,
          [key]: undefined,
        }));
    };

  const handleSubmit = async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    const { error } = await submitContact(form);
    setSubmitting(false);
    if (error) {
      setSubmitError("Failed to send. Please try again.");
      return;
    }
    setSubmitted(true);
    setForm(EMPTY);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <Box className="bg-[#fafaf7] px-6 py-16 sm:px-10 lg:px-20 lg:py-24">
      <Box className="mx-auto max-w-6xl">
        <Box className="mb-12">
          <Box className="flex items-center gap-3 mb-4">
            <Box className="w-8 h-px bg-amber-600" />
            <Typography className="text-[0.65rem] uppercase tracking-[0.4em] text-amber-700">
              Get In Touch
            </Typography>
          </Box>
          <Typography
            component="h2"
            className="text-3xl sm:text-5xl font-semibold text-stone-900 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Visit the Shop
          </Typography>
        </Box>

        <Box className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          {/* LEFT */}
          <Box className="flex flex-col gap-8">
            <Box className="flex flex-col gap-5">
              {[
                {
                  label: "Location",
                  value: "Jyotinagar Road, Pashupatisunchadi Pasal",
                  href: MAPS_URL,
                },
                {
                  label: "Email",
                  value: "pashupatisunchadipasal@gmail.com",
                  href: "mailto:pashupatisunchadipasal@gmail.com",
                },
                {
                  label: "Phone",
                  value: "+977 9862765445",
                  href: "tel:+9779862765445",
                },
              ].map(({ label, value, href }) => (
                <Box key={label}>
                  <Typography
                    className="text-[0.6rem] uppercase tracking-[0.35em] mb-1"
                    style={{ color: "rgba(0,0,0,0.35)" }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    component="a"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-stone-700 no-underline border-b border-amber-600/30 pb-0.5"
                    style={{ cursor: "pointer" }}
                  >
                    {value}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Box
              className="relative rounded-2xl overflow-hidden"
              style={{ height: 260, border: "1px solid rgba(180,83,9,0.1)" }}
            >
              <Box
                component="iframe"
                src={EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <Box
                className="absolute bottom-3 right-3"
                sx={{ pointerEvents: "none" }}
              >
                <Typography className="text-[0.65rem] uppercase tracking-[0.25em] text-white bg-black/40 px-3 py-1.5 rounded-full">
                  Move & Zoom Map
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* RIGHT - FORM */}
          <Box
            className="rounded-2xl p-7 sm:p-8 flex flex-col gap-6"
            style={{
              background: "white",
              border: "1px solid rgba(180,83,9,0.08)",
              boxShadow: "0 4px 32px rgba(0,0,0,0.04)",
            }}
          >
            {submitted && (
              <Alert
                severity="success"
                sx={{
                  bgcolor: "#fef3c7",
                  color: "#92400e",
                  border: "1px solid rgba(180,83,9,0.2)",
                  borderRadius: 2,
                  fontSize: "0.8rem",
                  "& .MuiAlert-icon": { color: "#b45309" },
                }}
              >
                Message sent. We will get back to you shortly.
              </Alert>
            )}
            {submitError && (
              <Alert
                severity="error"
                sx={{ borderRadius: 2, fontSize: "0.8rem" }}
              >
                {submitError}
              </Alert>
            )}

            <TextField
              required
              label="Full Name"
              variant="standard"
              fullWidth
              value={form.name}
              onChange={set("name")}
              error={!!errors.name}
              helperText={errors.name}
              sx={inputSx}
            />

            <TextField
              required
              label="Phone Number"
              variant="standard"
              fullWidth
              value={form.phone}
              onChange={set("phone")}
              error={!!errors.phone}
              helperText={errors.phone}
              sx={inputSx}
            />

            <TextField
              label="Email Address (optional)"
              variant="standard"
              fullWidth
              value={form.email}
              onChange={set("email")}
              error={!!errors.email}
              helperText={errors.email}
              sx={inputSx}
            />

            <TextField
              required
              label="Inquiry Type"
              variant="standard"
              fullWidth
              select
              value={form.inquiry}
              onChange={set("inquiry")}
              error={!!errors.inquiry}
              helperText={errors.inquiry}
              sx={inputSx}
            >
              {INQUIRY_TYPES.map((type) => (
                <MenuItem key={type} value={type} sx={{ fontSize: "0.88rem" }}>
                  {type}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Message (optional)"
              variant="standard"
              fullWidth
              multiline
              minRows={3}
              value={form.message}
              onChange={set("message")}
              sx={inputSx}
            />

            <Button
              onClick={handleSubmit}
              disabled={submitting}
              fullWidth
              className="rounded-full! py-3.5! text-[0.72rem]! font-semibold! uppercase! tracking-widest! text-white!"
              style={{
                background: "linear-gradient(135deg, #92400e 0%, #b45309 100%)",
              }}
            >
              {submitting ? "Sending…" : "Send Inquiry"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default ContactSection;
