import { Box, Button, TextField, Typography } from "@mui/material";

type Props = {
  newAdminEmail: string;
  setNewAdminEmail: (v: string) => void;
  newAdminDisplayName: string;
  setNewAdminDisplayName: (v: string) => void;
  newAdminPwd: string;
  setNewAdminPwd: (v: string) => void;
  onAddAdmin: () => void;
};

export default function AdminCreatePanel({
  newAdminEmail,
  setNewAdminEmail,
  newAdminDisplayName,
  setNewAdminDisplayName,
  newAdminPwd,
  setNewAdminPwd,
  onAddAdmin,
}: Props) {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        className="text-stone-700 font-semibold mb-3"
      >
        Create New Admin
      </Typography>

      <Box className="flex flex-col gap-4">
        <TextField
          fullWidth
          label="Display Name"
          size="small"
          value={newAdminDisplayName}
          onChange={(e) => setNewAdminDisplayName(e.target.value)}
          placeholder="e.g. Ram"
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          size="small"
          value={newAdminEmail}
          onChange={(e) => setNewAdminEmail(e.target.value)}
          placeholder="e.g. ram@internal.admin"
          helperText="Use name@internal.admin to avoid sending verification emails."
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          size="small"
          value={newAdminPwd}
          onChange={(e) => setNewAdminPwd(e.target.value)}
        />
        <Button
          variant="contained"
          disableElevation
          onClick={onAddAdmin}
          className="normal-case rounded-lg h-9 w-fit"
          sx={{
            backgroundColor: "#b45309",
            "&:hover": { backgroundColor: "#92400e" },
          }}
        >
          Create Admin Account
        </Button>
      </Box>
    </Box>
  );
}
