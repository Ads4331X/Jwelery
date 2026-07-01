export type CookieDomainConfig = {
  /** Cookie domain value to share across apps.
   *  - dev: "localhost"
   *  - prod: ".yourdomain.com" (leading dot)
   */
  domain: string;
};

const TOKEN_COOKIE_KEY = "aj_cust_token";
const USER_COOKIE_KEY = "aj_cust_user";

function getCookieDomain(): string {
  // Vite will replace import.meta.env values at build time.
  // We default to localhost to keep dev working out of the box.
  return import.meta.env.VITE_COOKIE_DOMAIN || "localhost";
}

function getSecureFlag(): boolean {
  // Only mark secure in production-like environments.
  // You can adjust if you need secure cookies on localhost.
  return import.meta.env.PROD;
}

function encode(value: string): string {
  return encodeURIComponent(value);
}

function decode(value: string): string {
  return decodeURIComponent(value);
}

export function readCookie(key: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = `${encode(key)}=`;
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.startsWith(nameEQ)) {
      return decode(c.substring(nameEQ.length));
    }
  }
  return null;
}

export function writeCookie(
  key: string,
  value: string,
  options?: {
    /** default: 7 days */
    maxAgeSeconds?: number;
  },
) {
  const domain = getCookieDomain();
  const maxAgeSeconds = options?.maxAgeSeconds ?? 60 * 60 * 24 * 7;

  const secure = getSecureFlag();

  document.cookie = `${encode(key)}=${encode(value)}; Max-Age=${maxAgeSeconds}; Path=/; Domain=${domain}; SameSite=Lax${
    secure ? "; Secure" : ""
  }`;
}

export function deleteCookie(key: string) {
  const domain = getCookieDomain();
  document.cookie = `${encode(key)}=; Max-Age=0; Path=/; Domain=${domain}; SameSite=Lax`;
}

export function setAuthCookies(token: string, userJson: string) {
  writeCookie(TOKEN_COOKIE_KEY, token);
  writeCookie(USER_COOKIE_KEY, userJson);
}

export function getAuthTokenCookie(): string | null {
  return readCookie(TOKEN_COOKIE_KEY);
}

export function getAuthUserCookie(): string | null {
  return readCookie(USER_COOKIE_KEY);
}

export function clearAuthCookies() {
  deleteCookie(TOKEN_COOKIE_KEY);
  deleteCookie(USER_COOKIE_KEY);
}
