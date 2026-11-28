import { DEFAULT_LOCALE, getLanguageTag, type AppLocale } from "@/lib/i18n/config";

const HOSTED_APP_ORIGIN = "https://app.expense-budget-tracker.com";
const HOSTED_AUTH_ORIGIN = "https://auth.expense-budget-tracker.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? HOSTED_APP_ORIGIN;
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? HOSTED_AUTH_ORIGIN;
const APP_ORIGIN = new URL(APP_URL).origin;
const AUTH_ORIGIN = new URL(AUTH_URL).origin;
const AUTH_LOGIN_URL = `${AUTH_URL.replace(/\/$/, "")}/login`;
const AUTH_LOGIN_PATH = new URL(AUTH_LOGIN_URL).pathname;

// Append without re-encoding authored tracking and redirect values.
function appendEntryQuery(href: string, name: "locale" | "lang" | "carry_locale", value: string): string {
  const fragmentStart = href.indexOf("#");
  const fragment = fragmentStart === -1 ? "" : href.slice(fragmentStart);
  const address = href.slice(0, href.length - fragment.length);
  const queryStart = address.indexOf("?");
  const separator = queryStart === -1 ? "?" : queryStart === address.length - 1 ? "" : "&";

  return `${address}${separator}${name}=${encodeURIComponent(value)}${fragment}`;
}

function isAppEntryUrl(url: URL): boolean {
  return url.username === "" && url.password === "" &&
    (url.origin === APP_ORIGIN || url.origin === HOSTED_APP_ORIGIN) &&
    !/^\/(?:api|\.well-known|v1|mcp|share)(?:\/|$)/i.test(url.pathname);
}

function getEntryLocaleHint(locale: AppLocale): string {
  // The existing zh hint selects Simplified Chinese in the app.
  return locale === "zh" ? locale : getLanguageTag(locale);
}

export function localizeProductEntryUrl(href: string, locale: AppLocale): string {
  const url = URL.canParse(href) ? new URL(href) : null;
  if (url === null || url.username !== "" || url.password !== "") return href;

  if (isAppEntryUrl(url)) {
    return locale === DEFAULT_LOCALE || url.searchParams.has("locale")
      ? href
      : appendEntryQuery(href, "locale", getEntryLocaleHint(locale));
  }

  const pathname = url.pathname.replace(/\/$/, "");
  if (
    (url.origin === AUTH_ORIGIN && pathname === AUTH_LOGIN_PATH) ||
    (url.origin === HOSTED_AUTH_ORIGIN && pathname === "/login")
  ) {
    const [returnHref, duplicateReturnHref] = url.searchParams.getAll("redirect_uri");
    const returnUrl = returnHref && URL.canParse(returnHref) ? new URL(returnHref) : null;
    if (duplicateReturnHref !== undefined || returnUrl === null || !isAppEntryUrl(returnUrl) ||
      url.searchParams.has("lang") || returnUrl.searchParams.has("locale")) {
      return href;
    }

    if (locale !== DEFAULT_LOCALE) {
      return appendEntryQuery(href, "lang", getEntryLocaleHint(locale));
    }

    if (!url.searchParams.has("carry_locale")) {
      return appendEntryQuery(href, "carry_locale", "1");
    }
  }

  return href;
}

function getAuthLoginUrl(redirectUri: string, locale: AppLocale): string {
  return localizeProductEntryUrl(
    `${AUTH_LOGIN_URL}?redirect_uri=${encodeURIComponent(redirectUri)}`,
    locale
  );
}

export function getLoginUrl(redirectPath: string, locale: AppLocale): string {
  if (!/^\/(?![/\\])/.test(redirectPath) || new URL(redirectPath, APP_URL).origin !== APP_ORIGIN) {
    throw new Error(`Login redirect must be a relative path on ${APP_ORIGIN}: ${redirectPath}`);
  }

  return getAuthLoginUrl(`${APP_URL.replace(/\/$/, "")}${redirectPath}`, locale);
}

export const getSignupUrl = (locale: AppLocale): string => getAuthLoginUrl(APP_URL, locale);

export const getAppUrl = (locale: AppLocale): string => localizeProductEntryUrl(APP_URL, locale);

export const LOGGED_IN_COOKIE_NAME = "logged_in";
