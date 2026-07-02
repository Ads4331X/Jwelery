const DEFAULT_LOCAL_FRONTEND_URL = "http://localhost:5173";
const DEFAULT_LOCAL_BACKEND_URL = "http://localhost:5000";

const getCurrentOrigin = () => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return DEFAULT_LOCAL_FRONTEND_URL;
};

const isLocalhostUrl = (value: string | undefined) => {
  if (!value) return false;

  try {
    const parsed = new URL(value);
    return ["localhost", "127.0.0.1", "0.0.0.0"].includes(parsed.hostname);
  } catch {
    return false;
  }
};

const normalizeBaseUrl = (value: string | undefined, fallback: string) => {
  if (!value) return fallback;

  const trimmedValue = value.trim().replace(/\/+$/, "");

  if (!trimmedValue) return fallback;
  if (import.meta.env.PROD && isLocalhostUrl(trimmedValue)) {
    return fallback;
  }

  return trimmedValue;
};

export const APP_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_APP_URL || import.meta.env.VITE_PUBLIC_URL,
  getCurrentOrigin(),
);

export const STATIC_URL = normalizeBaseUrl(
  import.meta.env.VITE_STATIC_URL,
  APP_BASE_URL,
);

export const CUSTOMER_URL = normalizeBaseUrl(
  import.meta.env.VITE_CUSTOMER_URL,
  APP_BASE_URL,
);

export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL,
  import.meta.env.DEV ? DEFAULT_LOCAL_BACKEND_URL : getCurrentOrigin(),
);

export const APP_MODE = import.meta.env.VITE_APP_MODE || "static";

export const isCustomerApp =
  APP_MODE === "customer" ||
  (import.meta.env.DEV &&
    typeof window !== "undefined" &&
    window.location.port === "5174");

export const getCookieDomain = () => {
  if (import.meta.env.VITE_COOKIE_DOMAIN) {
    return import.meta.env.VITE_COOKIE_DOMAIN;
  }

  if (typeof window !== "undefined" && window.location?.hostname) {
    return import.meta.env.PROD ? window.location.hostname : "localhost";
  }

  return "localhost";
};
