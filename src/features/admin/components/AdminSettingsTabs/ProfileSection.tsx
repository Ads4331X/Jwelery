import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

type Props = {
  username: string;
  setUsername: (value: string) => void;
  profileMsg: { type: "success" | "error"; text: string } | null;
  onUpdateUsername: () => void;
};

export default function ProfileSection({
  username,
  setUsername,
  profileMsg,
  onUpdateUsername,
}: Props) {
  return (
    <Card elevation={0} className="border border-stone-100 rounded-xl">
      <CardContent className="p-6">
        <Box className="flex items-center gap-2 mb-4">
          <PersonIcon className="text-amber-700" />
          <Typography
            variant="subtitle1"
            className="font-semibold text-stone-800"
          >
            Profile Section
          </Typography>
        </Box>
        <Divider className="mb-4" />

        {profileMsg && (
          <Alert severity={profileMsg.type} className="mb-4 text-sm">
            {profileMsg.text}
          </Alert>
        )}

        <Box className="flex flex-col gap-4">
          <TextField
            fullWidth
            label="Username"
            size="small"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            variant="contained"
            disableElevation
            onClick={onUpdateUsername}
            className="normal-case bg-stone-800 hover:bg-stone-700 rounded-lg h-9 w-fit"
          >
            Update Username
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
