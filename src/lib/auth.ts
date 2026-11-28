import type { AppLocale } from "@/lib/i18n/config";

const HOSTED_APP_ORIGIN = "https://app.expense-budget-tracker.com";
const HOSTED_AUTH_ORIGIN = "https://auth.expense-budget-tracker.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? HOSTED_APP_ORIGIN;
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? HOSTED_AUTH_ORIGIN;
const APP_ORIGIN = new URL(APP_URL).origin;
const AUTH_ORIGIN = new URL(AUTH_URL).origin;
const AUTH_LOGIN_URL = `${AUTH_URL.replace(/\/$/, "")}/login`;
const AUTH_LOGIN_PATH = new URL(AUTH_LOGIN_URL).pathname;

// Keep existing tracking and redirect query values encoded as authored.
function withLocaleQuery(href: string, name: "locale" | "lang", locale: AppLocale): string {
  const fragmentStart = href.indexOf("#");
  const fragment = fragmentStart === -1 ? "" : href.slice(fragmentStart);
  const address = href.slice(0, href.length - fragment.length);
  const queryStart = address.indexOf("?");
  const path = queryStart === -1 ? address : address.slice(0, queryStart);
  const query = queryStart === -1 ? "" : address.slice(queryStart + 1);
  const fields = query === "" ? [] : query.split("&").filter(
    (field) => !new URLSearchParams(`?${field}`).has(name)
  );

  return `${path}?${[...fields, `${name}=${encodeURIComponent(locale)}`].join("&")}${fragment}`;
}

function isAppUrl(url: URL): boolean {
  return url.username === "" && url.password === "" &&
    (url.origin === APP_ORIGIN || url.origin === HOSTED_APP_ORIGIN);
}

export function localizeProductEntryUrl(href: string, locale: AppLocale): string {
  const url = URL.canParse(href) ? new URL(href) : null;
  if (url === null || url.username !== "" || url.password !== "") return href;

  if (isAppUrl(url) && !/^\/(?:api|\.well-known|v1|mcp|share)(?:\/|$)/i.test(url.pathname)) {
    return withLocaleQuery(href, "locale", locale);
  }

  const pathname = url.pathname.replace(/\/$/, "");
  if (
    (url.origin === AUTH_ORIGIN && pathname === AUTH_LOGIN_PATH) ||
    (url.origin === HOSTED_AUTH_ORIGIN && pathname === "/login")
  ) {
    const [returnHref, duplicateReturnHref] = url.searchParams.getAll("redirect_uri");
    if (duplicateReturnHref === undefined && returnHref && URL.canParse(returnHref) &&
      isAppUrl(new URL(returnHref))) {
      return withLocaleQuery(href, "lang", locale);
    }
  }

  return href;
}

function getAuthLoginUrl(redirectUri: string, locale: AppLocale): string {
  return `${AUTH_LOGIN_URL}?redirect_uri=${encodeURIComponent(redirectUri)}&lang=${encodeURIComponent(locale)}`;
}

export function getLoginUrl(redirectPath: string, locale: AppLocale): string {
  if (!/^\/(?![/\\])/.test(redirectPath) || new URL(redirectPath, APP_URL).origin !== APP_ORIGIN) {
    throw new Error(`Login redirect must be a relative path on ${APP_ORIGIN}: ${redirectPath}`);
  }

  return getAuthLoginUrl(`${APP_URL.replace(/\/$/, "")}${redirectPath}`, locale);
}

export const getSignupUrl = (locale: AppLocale): string => getAuthLoginUrl(APP_URL, locale);

export const getAppUrl = (locale: AppLocale): string => withLocaleQuery(APP_URL, "locale", locale);

export const LOGGED_IN_COOKIE_NAME = "logged_in";
