import {
  DEFAULT_LOCALE,
  SITE_URL,
  type AppLocale,
  type PrefixedLocale,
} from "@/lib/i18n/config";

interface ResolvedPagePath {
  readonly locale: AppLocale;
  readonly pagePath: string;
}

function normalizePrefixedPath(pathname: string): string {
  if (!pathname.startsWith("/")) {
    throw new Error(`Localized path must start with "/": ${pathname}`);
  }

  if (pathname === "/") {
    return pathname;
  }

  return pathname.replace(/\/+$/, "") + (pathname.endsWith(".md") ? "" : "/");
}

function normalizePagePath(pagePath: string): string {
  if (pagePath === "") {
    return "";
  }

  return pagePath.replace(/^\/+/, "").replace(/\/+$/, "");
}

export function getLocalePrefix(locale: AppLocale): string {
  if (locale === DEFAULT_LOCALE) {
    return "";
  }

  return `/${locale}`;
}

export function getLocalizedPath(locale: AppLocale, pathname: string): string {
  const normalizedPath = normalizePrefixedPath(pathname);
  const localePrefix = getLocalePrefix(locale);

  if (normalizedPath === "/") {
    return localePrefix === "" ? "/" : `${localePrefix}/`;
  }

  return localePrefix === "" ? normalizedPath : `${localePrefix}${normalizedPath}`;
}

export function buildAbsoluteUrl(baseUrl: string, pathname: string): string {
  return new URL(pathname, baseUrl).toString();
}

export function getAbsoluteUrl(pathname: string): string {
  return buildAbsoluteUrl(SITE_URL, pathname);
}

export function getResolvedPagePath(pagePath: string): ResolvedPagePath | null {
  const normalizedPagePath = normalizePagePath(pagePath);

  if (normalizedPagePath === "") {
    return {
      locale: DEFAULT_LOCALE,
      pagePath: "",
    };
  }

  const [firstSegment, ...remainingSegments] = normalizedPagePath.split("/");

  if (firstSegment === DEFAULT_LOCALE) {
    return null;
  }

  if (firstSegment === "es") {
    return {
      locale: firstSegment satisfies PrefixedLocale,
      pagePath: remainingSegments.join("/"),
    };
  }

  return {
    locale: DEFAULT_LOCALE,
    pagePath: normalizedPagePath,
  };
}
