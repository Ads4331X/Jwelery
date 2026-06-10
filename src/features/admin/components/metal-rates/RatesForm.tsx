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
import ShowChartIcon from "@mui/icons-material/ShowChart";

type Message = { type: "success" | "error"; text: string };

interface Props {
  goldTola: string;
  goldTenGram: string;
  silverTola: string;
  silverTenGram: string;
  saving: boolean;
  message: Message | null;
  onChange: (field: string, value: string) => void;
  onSave: () => void;
}

export default function RatesForm({
  goldTola,
  goldTenGram,
  silverTola,
  silverTenGram,
  saving,
  message,
  onChange,
  onSave,
}: Props) {
  return (
    <Card elevation={0} className="border border-stone-100 rounded-xl">
      <CardContent className="p-6">
        <Box className="flex items-center gap-2 mb-4">
          <ShowChartIcon className="text-amber-700" />
          <Typography
            variant="subtitle1"
            className="font-semibold text-stone-800"
          >
            Today's Rates
          </Typography>
        </Box>
        <Divider className="mb-6" />

        {message && (
          <Alert severity={message.type} className="mb-6 text-sm">
            {message.text}
          </Alert>
        )}

        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <MetalColumn
            label="Gold"
            fields={[
              {
                label: "Gold / tola (Rs)",
                value: goldTola,
                key: "goldTola",
                placeholder: "e.g. 175000",
              },
              {
                label: "Gold / 10g (Rs)",
                value: goldTenGram,
                key: "goldTenGram",
                placeholder: "e.g. 150000",
              },
            ]}
            onChange={onChange}
          />
          <MetalColumn
            label="Silver"
            fields={[
              {
                label: "Silver / tola (Rs)",
                value: silverTola,
                key: "silverTola",
                placeholder: "e.g. 2200",
              },
              {
                label: "Silver / 10g (Rs)",
                value: silverTenGram,
                key: "silverTenGram",
                placeholder: "e.g. 1900",
              },
            ]}
            onChange={onChange}
          />
        </Box>

        <Button
          variant="contained"
          disableElevation
          onClick={onSave}
          disabled={saving}
          className="normal-case bg-stone-800 hover:bg-stone-700 rounded-lg h-9"
        >
          {saving ? (
            <CircularProgress size={18} className="text-white" />
          ) : (
            "Save Rates"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// ── small internal sub-component ──────────────────────────────────────────────

interface FieldConfig {
  label: string;
  value: string;
  key: string;
  placeholder: string;
}

function MetalColumn({
  label,
  fields,
  onChange,
}: {
  label: string;
  fields: FieldConfig[];
  onChange: (key: string, value: string) => void;
}) {
  return (
    <Box>
      <Typography
        variant="caption"
        className="text-stone-500 mb-2 block font-medium uppercase tracking-wide text-xs"
      >
        {label}
      </Typography>
      <Box className="flex flex-col gap-3">
        {fields.map((f) => (
          <TextField
            key={f.key}
            fullWidth
            label={f.label}
            size="small"
            type="number"
            value={f.value}
            onChange={(e) => onChange(f.key, e.target.value)}
            placeholder={f.placeholder}
          />
        ))}
      </Box>
    </Box>
  );
}
