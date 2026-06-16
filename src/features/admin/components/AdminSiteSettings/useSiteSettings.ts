import { useEffect, useState } from "react";
import {
  getSiteSettings,
  type SiteSettings,
} from "../../../../services/siteSettings";

// Fallback defaults matching what's currently hardcoded in the app
export const SETTINGS_DEFAULTS: Omit<SiteSettings, "id" | "updated_at"> = {
  address: "Sukra Path, Kathmandu",
  maps_url:
    "https://www.google.com/maps?ll=27.705353,85.309351&z=15&t=m&hl=en&gl=NP&mapclient=embed&cid=14685289598650988311",
  email: "anand.jewellers.np@gmail.com",
  phone: "01-5347461",
  facebook_url: "https://www.facebook.com/Anand.Jewellers.np",
  instagram_url: "https://www.instagram.com/anand.jewellers.np/?hl=en",
};

export function useSiteSettings() {
  const [settings, setSettings] =
    useState<Omit<SiteSettings, "id" | "updated_at">>(SETTINGS_DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const row = await getSiteSettings();
      if (row) {
        setSettings({
          address: row.address || SETTINGS_DEFAULTS.address,
          maps_url: row.maps_url || SETTINGS_DEFAULTS.maps_url,
          email: row.email || SETTINGS_DEFAULTS.email,
          phone: row.phone || SETTINGS_DEFAULTS.phone,
          facebook_url: row.facebook_url || SETTINGS_DEFAULTS.facebook_url,
          instagram_url: row.instagram_url || SETTINGS_DEFAULTS.instagram_url,
        });
      }
      setLoading(false);
    })();
  }, []);

  return { settings, loading };
}
