import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import {
  getMetalRates,
  saveMetalRates,
  saveVisibility,
} from "../utils/metalRates";
import RatesForm from "./metal-rates/RatesForm";
import VisibilityToggle from "./metal-rates/VisibilityToggle";

type Message = { type: "success" | "error"; text: string };

const FIELDS = [
  "goldTola",
  "goldTenGram",
  "silverTola",
  "silverTenGram",
] as const;
type RateField = (typeof FIELDS)[number];

const FIELD_LABELS: Record<RateField, string> = {
  goldTola: "Gold / tola",
  goldTenGram: "Gold / 10g",
  silverTola: "Silver / tola",
  silverTenGram: "Silver / 10g",
};

export default function AdminMetalRates() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ratesMsg, setRatesMsg] = useState<Message | null>(null);
  const [visibilityMsg, setVisibilityMsg] = useState<Message | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  const [rates, setRates] = useState<Record<RateField, string>>({
    goldTola: "",
    goldTenGram: "",
    silverTola: "",
    silverTenGram: "",
  });

  useEffect(() => {
    void (async () => {
      const row = await getMetalRates();
      if (row) {
        setRates({
          goldTola: row.gold_tola > 0 ? String(row.gold_tola) : "",
          goldTenGram: row.gold_ten_gram > 0 ? String(row.gold_ten_gram) : "",
          silverTola: row.silver_tola > 0 ? String(row.silver_tola) : "",
          silverTenGram:
            row.silver_ten_gram > 0 ? String(row.silver_ten_gram) : "",
        });
        setVisible(row.visible);
        setUpdatedAt(row.updated_at);
      }
      setLoading(false);
    })();
  }, []);

  const handleRateChange = (field: string, value: string) =>
    setRates((prev) => ({ ...prev, [field]: value }));

  const handleSaveRates = async () => {
    setRatesMsg(null);
    for (const key of FIELDS) {
      const val = rates[key];
      if (val === "" || isNaN(Number(val)) || Number(val) < 0) {
        setRatesMsg({
          type: "error",
          text: `${FIELD_LABELS[key]} must be a valid number.`,
        });
        return;
      }
    }
    setSaving(true);
    const { error } = await saveMetalRates({
      gold_tola: Number(rates.goldTola),
      gold_ten_gram: Number(rates.goldTenGram),
      silver_tola: Number(rates.silverTola),
      silver_ten_gram: Number(rates.silverTenGram),
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
      setVisible(!checked);
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
            <Box component="span" className="ml-2 text-stone-300">
              Last updated: {new Date(updatedAt).toLocaleString()}
            </Box>
          )}
        </Typography>
      </Box>

      <RatesForm
        {...rates}
        saving={saving}
        message={ratesMsg}
        onChange={handleRateChange}
        onSave={handleSaveRates}
      />

      <VisibilityToggle
        visible={visible}
        message={visibilityMsg}
        onToggle={handleToggleVisibility}
      />
    </Box>
  );
}
