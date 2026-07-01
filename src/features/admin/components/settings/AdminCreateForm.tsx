import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import type { AdminRole } from "../../utils/adminUser";
import { ROLE_OPTIONS, ROLE_TOGGLE_SX, ROLE_ICONS_MD } from "./RoleConfig";

type Props = {
  onAdd: (
    email: string,
    pwd: string,
    name: string,
    role: AdminRole,
  ) => Promise<{ error?: string | null }>;
};

export default function AdminCreateForm({ onAdd }: Props) {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [pwd, setPwd] = useState("");
  const [role, setRole] = useState<AdminRole>("ADMIN");
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setMsg(null);
    if (!email.trim() || !displayName.trim() || !pwd)
      return setMsg({ type: "error", text: "Please fill in all fields." });
    if (!email.includes("@"))
      return setMsg({
        type: "error",
        text: "Please enter a valid email address.",
      });
    if (pwd.length < 6)
      return setMsg({
        type: "error",
        text: "Password must be at least 6 characters.",
      });

    setLoading(true);
    const result = await onAdd(email.trim(), pwd, displayName.trim(), role);
    setLoading(false);

    if (result.error) setMsg({ type: "error", text: result.error });
    else {
      setMsg({
        type: "success",
        text: `Admin account "${displayName}" created.`,
      });
      setEmail("");
      setDisplayName("");
      setPwd("");
    }
  };

  return (
    <Box>
      <Typography
        variant="subtitle2"
        className="text-stone-700 font-semibold mb-4"
      >
        Create New Admin
      </Typography>
      <Box className="flex flex-col gap-4">
        <TextField
          fullWidth
          label="Display Name"
          size="small"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. Ram"
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. ram@gmail.com"
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          size="small"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <Box>
          <Typography variant="caption" className="text-stone-400 mb-1.5 block">
            Role
          </Typography>
          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={(_, val) => val && setRole(val as AdminRole)}
            size="small"
            fullWidth
            sx={{
              ...ROLE_TOGGLE_SX,
              "& .MuiToggleButton-root.Mui-selected:hover": {
                backgroundColor: "#fef3c7",
              },
            }}
          >
            {ROLE_OPTIONS.map(({ value, label }) => (
              <ToggleButton key={value} value={value}>
                {ROLE_ICONS_MD[value]}
                {label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
        {msg && (
          <Typography
            variant="caption"
            sx={{ color: msg.type === "error" ? "#dc2626" : "#16a34a" }}
          >
            {msg.text}
          </Typography>
        )}
        <Button
          variant="contained"
          disableElevation
          onClick={handleAdd}
          disabled={loading}
          className="normal-case rounded-lg h-9 w-fit"
          sx={{
            backgroundColor: "#b45309",
            "&:hover": { backgroundColor: "#92400e" },
          }}
        >
          {loading ? "Creating..." : "Create Admin Account"}
        </Button>
      </Box>
    </Box>
  );
}
