export const SITE_URL = "https://expense-budget-tracker.com";
export const SITE_NAME = "Expense Budget Tracker";

export const DEFAULT_LOCALE = "en";
export const PREFIXED_LOCALES = [
  "es",
  "ru",
  "uk",
  "fa",
  "zh",
  "ar",
  "he",
] as const;
export const SUPPORTED_LOCALES = [DEFAULT_LOCALE, ...PREFIXED_LOCALES] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export type PrefixedLocale = (typeof PREFIXED_LOCALES)[number];
export type TextDirection = "ltr" | "rtl";

interface LocaleMetadata {
  readonly htmlLang: string;
  readonly openGraphLocale: string;
  readonly label: string;
  readonly shortLabel: string;
  readonly direction: TextDirection;
}

const LOCALE_METADATA: Readonly<Record<AppLocale, LocaleMetadata>> = {
  en: {
    htmlLang: "en",
    openGraphLocale: "en_US",
    label: "English",
    shortLabel: "EN",
    direction: "ltr",
  },
  es: {
    htmlLang: "es",
    openGraphLocale: "es_ES",
    label: "Español",
    shortLabel: "ES",
    direction: "ltr",
  },
  ru: {
    htmlLang: "ru",
    openGraphLocale: "ru_RU",
    label: "Русский",
    shortLabel: "RU",
    direction: "ltr",
  },
  uk: {
    htmlLang: "uk",
    openGraphLocale: "uk_UA",
    label: "Українська",
    shortLabel: "UK",
    direction: "ltr",
  },
  fa: {
    htmlLang: "fa",
    openGraphLocale: "fa_IR",
    label: "فارسی",
    shortLabel: "FA",
    direction: "rtl",
  },
  zh: {
    htmlLang: "zh",
    openGraphLocale: "zh_CN",
    label: "中文",
    shortLabel: "ZH",
    direction: "ltr",
  },
  ar: {
    htmlLang: "ar",
    openGraphLocale: "ar_SA",
    label: "العربية",
    shortLabel: "AR",
    direction: "rtl",
  },
  he: {
    htmlLang: "he",
    openGraphLocale: "he_IL",
    label: "עברית",
    shortLabel: "HE",
    direction: "rtl",
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

export function getLocaleShortLabel(locale: AppLocale): string {
  return LOCALE_METADATA[locale].shortLabel;
}

export function getTextDirection(locale: AppLocale): TextDirection {
  return LOCALE_METADATA[locale].direction;
}

export function isRtlLocale(locale: AppLocale): boolean {
  return getTextDirection(locale) === "rtl";
}
