import { DEFAULT_LOCALE, getHreflang, type AppLocale } from "@/lib/i18n/config";
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
      getHreflang(locale),
      getAbsoluteUrl(getLocalizedPath(locale, routePath)),
    ])
  );

  if (availableLocales.includes(DEFAULT_LOCALE)) {
    alternates["x-default"] = alternates[getHreflang(DEFAULT_LOCALE)];
  }

  return alternates;
}
