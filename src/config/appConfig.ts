// src/config/appConfig.ts
const DEFAULT_LOCAL_BACKEND_URL = "http://localhost:5000";

const getCurrentOrigin = () => {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return DEFAULT_LOCAL_BACKEND_URL;
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
  // Safety net: if a localhost URL ever leaks into a production build,
  // fall back instead of sending real users to someone's laptop.
  if (import.meta.env.PROD && isLocalhostUrl(trimmedValue)) {
    return fallback;
  }

  return trimmedValue;
};

/**
 * Base URL of your backend API.
 * - Dev: defaults to http://localhost:5000
 * - Prod: defaults to same-origin (works out of the box if your API is
 *   proxied behind the same domain, e.g. via vercel.json rewrites or an
 *   .htaccess proxy on cPanel). Override with VITE_API_URL if your API
 *   lives on a different domain.
 */
export const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_API_URL,
  import.meta.env.DEV ? DEFAULT_LOCAL_BACKEND_URL : getCurrentOrigin(),
);

export const getCookieDomain = () => {
  if (import.meta.env.VITE_COOKIE_DOMAIN) {
    return import.meta.env.VITE_COOKIE_DOMAIN;
  }

  if (typeof window !== "undefined" && window.location?.hostname) {
    return import.meta.env.PROD ? window.location.hostname : "localhost";
  }

  return "localhost";
};
