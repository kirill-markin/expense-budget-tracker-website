export const SITE_URL = "https://expense-budget-tracker.com";
export const SITE_NAME = "Expense Budget Tracker";

export const DEFAULT_LOCALE = "en";
export const SUPPORTED_LOCALES = ["en", "es"] as const;
export const PREFIXED_LOCALES = ["es"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export type PrefixedLocale = (typeof PREFIXED_LOCALES)[number];

interface LocaleMetadata {
  readonly htmlLang: string;
  readonly openGraphLocale: string;
  readonly label: string;
}

const LOCALE_METADATA: Readonly<Record<AppLocale, LocaleMetadata>> = {
  en: {
    htmlLang: "en",
    openGraphLocale: "en_US",
    label: "English",
  },
  es: {
    htmlLang: "es",
    openGraphLocale: "es_ES",
    label: "Español",
  },
};

export function isAppLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

export function isPrefixedLocale(value: string): value is PrefixedLocale {
  return PREFIXED_LOCALES.includes(value as PrefixedLocale);
}

export function getHtmlLang(locale: AppLocale): string {
  return LOCALE_METADATA[locale].htmlLang;
}

export function getOpenGraphLocale(locale: AppLocale): string {
  return LOCALE_METADATA[locale].openGraphLocale;
}

export function getLocaleLabel(locale: AppLocale): string {
  return LOCALE_METADATA[locale].label;
}
