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
  Switch,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  getMetalRates,
  saveMetalRates,
  saveVisibility,
} from "../utils/metalRates";

type Message = { type: "success" | "error"; text: string };

export default function AdminMetalRates() {
  const [loading, setLoading] = useState(true);
  const [ratesMsg, setRatesMsg] = useState<Message | null>(null);
  const [visibilityMsg, setVisibilityMsg] = useState<Message | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [goldTola, setGoldTola] = useState("");
  const [goldTenGram, setGoldTenGram] = useState("");
  const [silverTola, setSilverTola] = useState("");
  const [silverTenGram, setSilverTenGram] = useState("");
  const [visible, setVisible] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const row = await getMetalRates();
      if (row) {
        setGoldTola(row.gold_tola > 0 ? String(row.gold_tola) : "");
        setGoldTenGram(row.gold_ten_gram > 0 ? String(row.gold_ten_gram) : "");
        setSilverTola(row.silver_tola > 0 ? String(row.silver_tola) : "");
        setSilverTenGram(
          row.silver_ten_gram > 0 ? String(row.silver_ten_gram) : "",
        );
        setVisible(row.visible);
        setUpdatedAt(row.updated_at);
      }
      setLoading(false);
    })();
  }, []);

  const handleSaveRates = async () => {
    setRatesMsg(null);

    const fields = [
      { label: "Gold / tola", val: goldTola },
      { label: "Gold / 10g", val: goldTenGram },
      { label: "Silver / tola", val: silverTola },
      { label: "Silver / 10g", val: silverTenGram },
    ];

    for (const f of fields) {
      if (f.val === "" || isNaN(Number(f.val)) || Number(f.val) < 0) {
        setRatesMsg({
          type: "error",
          text: `${f.label} must be a valid number.`,
        });
        return;
      }
    }

    setSaving(true);
    const { error } = await saveMetalRates({
      gold_tola: Number(goldTola),
      gold_ten_gram: Number(goldTenGram),
      silver_tola: Number(silverTola),
      silver_ten_gram: Number(silverTenGram),
    });
    setSaving(false);

    if (error) {
      setRatesMsg({ type: "error", text: error });
    } else {
      setUpdatedAt(new Date().toISOString());
      setRatesMsg({ type: "success", text: "Rates updated successfully." });
    }
  };

  const handleToggleVisibility = async (checked: boolean) => {
    setVisible(checked);
    setVisibilityMsg(null);
    const { error } = await saveVisibility(checked);
    if (error) {
      setVisible(!checked); // revert
      setVisibilityMsg({ type: "error", text: "Failed to update visibility." });
    } else {
      setVisibilityMsg({
        type: "success",
        text: `Metal rates section is now ${checked ? "visible" : "hidden"} on the site.`,
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
          Metal Rates
        </Typography>
        <Typography variant="body2" className="text-stone-400">
          Set today's gold and silver rates. These values are displayed on the
          public site.
          {updatedAt && (
            <Box component={"span"} className="ml-2 text-stone-300">
              Last updated: {new Date(updatedAt).toLocaleString()}
            </Box>
          )}
        </Typography>
      </Box>

      {/* Rates form */}
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

          {ratesMsg && (
            <Alert severity={ratesMsg.type} className="mb-6 text-sm">
              {ratesMsg.text}
            </Alert>
          )}

          <Box className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Box>
              <Typography
                variant="caption"
                className="text-stone-500 mb-2 block font-medium uppercase tracking-wide text-xs"
              >
                Gold
              </Typography>
              <Box className="flex flex-col gap-3">
                <TextField
                  fullWidth
                  label="Gold / tola (Rs)"
                  size="small"
                  type="number"
                  value={goldTola}
                  onChange={(e) => setGoldTola(e.target.value)}
                  placeholder="e.g. 175000"
                />
                <TextField
                  fullWidth
                  label="Gold / 10g (Rs)"
                  size="small"
                  type="number"
                  value={goldTenGram}
                  onChange={(e) => setGoldTenGram(e.target.value)}
                  placeholder="e.g. 150000"
                />
              </Box>
            </Box>

            <Box>
              <Typography
                variant="caption"
                className="text-stone-500 mb-2 block font-medium uppercase tracking-wide text-xs"
              >
                Silver
              </Typography>
              <Box className="flex flex-col gap-3">
                <TextField
                  fullWidth
                  label="Silver / tola (Rs)"
                  size="small"
                  type="number"
                  value={silverTola}
                  onChange={(e) => setSilverTola(e.target.value)}
                  placeholder="e.g. 2200"
                />
                <TextField
                  fullWidth
                  label="Silver / 10g (Rs)"
                  size="small"
                  type="number"
                  value={silverTenGram}
                  onChange={(e) => setSilverTenGram(e.target.value)}
                  placeholder="e.g. 1900"
                />
              </Box>
            </Box>
          </Box>

          <Button
            variant="contained"
            disableElevation
            onClick={handleSaveRates}
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

      {/* Visibility toggle */}
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

          {visibilityMsg && (
            <Alert severity={visibilityMsg.type} className="mb-4 text-sm">
              {visibilityMsg.text}
            </Alert>
          )}

          <Box className="flex items-center justify-between">
            <Box>
              <Typography
                variant="body2"
                className="text-stone-700 font-medium"
              >
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
                  onChange={(e) => handleToggleVisibility(e.target.checked)}
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
    </Box>
  );
}
