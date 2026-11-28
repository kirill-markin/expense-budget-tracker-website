export const SITE_URL = "https://expense-budget-tracker.com";
export const SITE_NAME = "Expense Budget Tracker";

// Locale keys are stable route and content directory slugs.
export const DEFAULT_LOCALE = "en";
export const PREFIXED_LOCALES = [
  "es",
  "ru",
  "uk",
  "fa",
  "zh",
  "ar",
  "he",
  "de",
  "fr",
  "id",
  "it",
  "ja",
  "ko",
  "pl",
  "pt-br",
  "tr",
  "vi",
  "zh-hant",
] as const;
export const SUPPORTED_LOCALES = [DEFAULT_LOCALE, ...PREFIXED_LOCALES] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export type PrefixedLocale = (typeof PREFIXED_LOCALES)[number];
export type TextDirection = "ltr" | "rtl";

interface LocaleMetadata {
  readonly languageTag: string;
  // Set when Google Search needs a different supported language or region tag.
  readonly hreflang?: string;
  readonly openGraphLocale: string;
  readonly label: string;
  readonly englishLabel: string;
  readonly shortLabel: string;
  readonly direction: TextDirection;
}

const LOCALE_METADATA: Readonly<Record<AppLocale, LocaleMetadata>> = {
  en: {
    languageTag: "en",
    openGraphLocale: "en_US",
    label: "English",
    englishLabel: "English",
    shortLabel: "EN",
    direction: "ltr",
  },
  es: {
    languageTag: "es",
    openGraphLocale: "es_ES",
    label: "Español",
    englishLabel: "Spanish",
    shortLabel: "ES",
    direction: "ltr",
  },
  ru: {
    languageTag: "ru",
    openGraphLocale: "ru_RU",
    label: "Русский",
    englishLabel: "Russian",
    shortLabel: "RU",
    direction: "ltr",
  },
  uk: {
    languageTag: "uk",
    openGraphLocale: "uk_UA",
    label: "Українська",
    englishLabel: "Ukrainian",
    shortLabel: "UK",
    direction: "ltr",
  },
  fa: {
    languageTag: "fa",
    openGraphLocale: "fa_IR",
    label: "فارسی",
    englishLabel: "Persian",
    shortLabel: "FA",
    direction: "rtl",
  },
  zh: {
    languageTag: "zh-Hans",
    openGraphLocale: "zh_CN",
    label: "简体中文",
    englishLabel: "Simplified Chinese",
    shortLabel: "ZH",
    direction: "ltr",
  },
  ar: {
    languageTag: "ar",
    openGraphLocale: "ar_SA",
    label: "العربية",
    englishLabel: "Arabic",
    shortLabel: "AR",
    direction: "rtl",
  },
  he: {
    languageTag: "he",
    openGraphLocale: "he_IL",
    label: "עברית",
    englishLabel: "Hebrew",
    shortLabel: "HE",
    direction: "rtl",
  },
  de: {
    languageTag: "de",
    openGraphLocale: "de_DE",
    label: "Deutsch",
    englishLabel: "German",
    shortLabel: "DE",
    direction: "ltr",
  },
  fr: {
    languageTag: "fr",
    openGraphLocale: "fr_FR",
    label: "Français",
    englishLabel: "French",
    shortLabel: "FR",
    direction: "ltr",
  },
  id: {
    languageTag: "id",
    openGraphLocale: "id_ID",
    label: "Bahasa Indonesia",
    englishLabel: "Indonesian",
    shortLabel: "ID",
    direction: "ltr",
  },
  it: {
    languageTag: "it",
    openGraphLocale: "it_IT",
    label: "Italiano",
    englishLabel: "Italian",
    shortLabel: "IT",
    direction: "ltr",
  },
  ja: {
    languageTag: "ja",
    openGraphLocale: "ja_JP",
    label: "日本語",
    englishLabel: "Japanese",
    shortLabel: "JA",
    direction: "ltr",
  },
  ko: {
    languageTag: "ko",
    openGraphLocale: "ko_KR",
    label: "한국어",
    englishLabel: "Korean",
    shortLabel: "KO",
    direction: "ltr",
  },
  pl: {
    languageTag: "pl",
    openGraphLocale: "pl_PL",
    label: "Polski",
    englishLabel: "Polish",
    shortLabel: "PL",
    direction: "ltr",
  },
  "pt-br": {
    languageTag: "pt-BR",
    openGraphLocale: "pt_BR",
    label: "Português (Brasil)",
    englishLabel: "Brazilian Portuguese",
    shortLabel: "PT-BR",
    direction: "ltr",
  },
  tr: {
    languageTag: "tr",
    openGraphLocale: "tr_TR",
    label: "Türkçe",
    englishLabel: "Turkish",
    shortLabel: "TR",
    direction: "ltr",
  },
  vi: {
    languageTag: "vi",
    openGraphLocale: "vi_VN",
    label: "Tiếng Việt",
    englishLabel: "Vietnamese",
    shortLabel: "VI",
    direction: "ltr",
  },
  "zh-hant": {
    languageTag: "zh-Hant",
    openGraphLocale: "zh_TW",
    label: "繁體中文",
    englishLabel: "Traditional Chinese",
    shortLabel: "ZH-HANT",
    direction: "ltr",
  },
};

export function isAppLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

export function isPrefixedLocale(value: string): value is PrefixedLocale {
  return PREFIXED_LOCALES.includes(value as PrefixedLocale);
}

export function getLanguageTag(locale: AppLocale): string {
  return LOCALE_METADATA[locale].languageTag;
}

export function getHreflang(locale: AppLocale): string {
  return LOCALE_METADATA[locale].hreflang ?? getLanguageTag(locale);
}

export function getOpenGraphLocale(locale: AppLocale): string {
  return LOCALE_METADATA[locale].openGraphLocale;
}

export function getLocaleLabel(locale: AppLocale): string {
  return LOCALE_METADATA[locale].label;
}

export function getLocaleEnglishLabel(locale: AppLocale): string {
  return LOCALE_METADATA[locale].englishLabel;
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
