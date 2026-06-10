import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

type Message = { type: "success" | "error"; text: string };

interface Props {
  visible: boolean;
  message: Message | null;
  onToggle: (checked: boolean) => void;
}

export default function VisibilityToggle({
  visible,
  message,
  onToggle,
}: Props) {
  return (
    <Card elevation={0} className="border border-stone-100 rounded-xl">
      <CardContent className="p-6">
        <Box className="flex items-center gap-2 mb-4">
          <VisibilityIcon className="text-amber-700" />
          <Typography
            variant="subtitle1"
            className="font-semibold text-stone-800"
          >
            Section Visibility
          </Typography>
        </Box>
        <Divider className="mb-6" />

        {message && (
          <Alert severity={message.type} className="mb-4 text-sm">
            {message.text}
          </Alert>
        )}

        <Box className="flex items-center justify-between">
          <Box>
            <Typography variant="body2" className="text-stone-700 font-medium">
              Show Metal Rates on site
            </Typography>
            <Typography variant="caption" className="text-stone-400">
              Toggle off to hide the rates section from public visitors.
            </Typography>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={visible}
                onChange={(e) => onToggle(e.target.checked)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#b45309" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#b45309",
                  },
                }}
              />
            }
            label=""
            className="m-0"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
