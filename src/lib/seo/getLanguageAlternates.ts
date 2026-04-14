import type { AppLocale } from "@/lib/i18n/config";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getAbsoluteUrl, getLocalizedPath } from "@/lib/i18n/routing";

export function getLanguageAlternates(
  routePath: string,
  availableLocales: ReadonlyArray<AppLocale>
): Readonly<Record<string, string>> | undefined {
  if (availableLocales.length <= 1) {
    return undefined;
  }

  const alternates = Object.fromEntries(
    availableLocales.map((locale) => [
      locale,
      getAbsoluteUrl(getLocalizedPath(locale, routePath)),
    ])
  );

  return {
    ...alternates,
    "x-default": getAbsoluteUrl(getLocalizedPath(DEFAULT_LOCALE, routePath)),
  };
}
