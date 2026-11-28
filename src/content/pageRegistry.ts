import type { AppLocale } from "@/lib/i18n/config";
import type { StructuredMarketingPageSlug } from "@/lib/content/contentPaths";
import type { PageContent } from "@/lib/content/types";
import { FEATURES_PAGE_CONTENT_AR } from "@/content/ar/pages/features";
import { HOME_PAGE_CONTENT_AR } from "@/content/ar/pages/home";
import { PRICING_PAGE_CONTENT_AR } from "@/content/ar/pages/pricing";
import { FEATURES_PAGE_CONTENT_DE } from "@/content/de/pages/features";
import { HOME_PAGE_CONTENT_DE } from "@/content/de/pages/home";
import { PRICING_PAGE_CONTENT_DE } from "@/content/de/pages/pricing";
import { FEATURES_PAGE_CONTENT_EN } from "@/content/en/pages/features";
import { HOME_PAGE_CONTENT_EN } from "@/content/en/pages/home";
import { PRICING_PAGE_CONTENT_EN } from "@/content/en/pages/pricing";
import { FEATURES_PAGE_CONTENT_ES } from "@/content/es/pages/features";
import { HOME_PAGE_CONTENT_ES } from "@/content/es/pages/home";
import { PRICING_PAGE_CONTENT_ES } from "@/content/es/pages/pricing";
import { FEATURES_PAGE_CONTENT_FA } from "@/content/fa/pages/features";
import { HOME_PAGE_CONTENT_FA } from "@/content/fa/pages/home";
import { PRICING_PAGE_CONTENT_FA } from "@/content/fa/pages/pricing";
import { FEATURES_PAGE_CONTENT_FR } from "@/content/fr/pages/features";
import { HOME_PAGE_CONTENT_FR } from "@/content/fr/pages/home";
import { PRICING_PAGE_CONTENT_FR } from "@/content/fr/pages/pricing";
import { FEATURES_PAGE_CONTENT_HE } from "@/content/he/pages/features";
import { HOME_PAGE_CONTENT_HE } from "@/content/he/pages/home";
import { PRICING_PAGE_CONTENT_HE } from "@/content/he/pages/pricing";
import { FEATURES_PAGE_CONTENT_ID } from "@/content/id/pages/features";
import { HOME_PAGE_CONTENT_ID } from "@/content/id/pages/home";
import { PRICING_PAGE_CONTENT_ID } from "@/content/id/pages/pricing";
import { FEATURES_PAGE_CONTENT_IT } from "@/content/it/pages/features";
import { HOME_PAGE_CONTENT_IT } from "@/content/it/pages/home";
import { PRICING_PAGE_CONTENT_IT } from "@/content/it/pages/pricing";
import { FEATURES_PAGE_CONTENT_JA } from "@/content/ja/pages/features";
import { HOME_PAGE_CONTENT_JA } from "@/content/ja/pages/home";
import { PRICING_PAGE_CONTENT_JA } from "@/content/ja/pages/pricing";
import { FEATURES_PAGE_CONTENT_KO } from "@/content/ko/pages/features";
import { HOME_PAGE_CONTENT_KO } from "@/content/ko/pages/home";
import { PRICING_PAGE_CONTENT_KO } from "@/content/ko/pages/pricing";
import { FEATURES_PAGE_CONTENT_PL } from "@/content/pl/pages/features";
import { HOME_PAGE_CONTENT_PL } from "@/content/pl/pages/home";
import { PRICING_PAGE_CONTENT_PL } from "@/content/pl/pages/pricing";
import { FEATURES_PAGE_CONTENT_PT_BR } from "@/content/pt-br/pages/features";
import { HOME_PAGE_CONTENT_PT_BR } from "@/content/pt-br/pages/home";
import { PRICING_PAGE_CONTENT_PT_BR } from "@/content/pt-br/pages/pricing";
import { FEATURES_PAGE_CONTENT_RU } from "@/content/ru/pages/features";
import { HOME_PAGE_CONTENT_RU } from "@/content/ru/pages/home";
import { PRICING_PAGE_CONTENT_RU } from "@/content/ru/pages/pricing";
import { FEATURES_PAGE_CONTENT_TR } from "@/content/tr/pages/features";
import { HOME_PAGE_CONTENT_TR } from "@/content/tr/pages/home";
import { PRICING_PAGE_CONTENT_TR } from "@/content/tr/pages/pricing";
import { FEATURES_PAGE_CONTENT_UK } from "@/content/uk/pages/features";
import { HOME_PAGE_CONTENT_UK } from "@/content/uk/pages/home";
import { PRICING_PAGE_CONTENT_UK } from "@/content/uk/pages/pricing";
import { FEATURES_PAGE_CONTENT_VI } from "@/content/vi/pages/features";
import { HOME_PAGE_CONTENT_VI } from "@/content/vi/pages/home";
import { PRICING_PAGE_CONTENT_VI } from "@/content/vi/pages/pricing";
import { FEATURES_PAGE_CONTENT_ZH_HANT } from "@/content/zh-hant/pages/features";
import { HOME_PAGE_CONTENT_ZH_HANT } from "@/content/zh-hant/pages/home";
import { PRICING_PAGE_CONTENT_ZH_HANT } from "@/content/zh-hant/pages/pricing";
import { FEATURES_PAGE_CONTENT_ZH } from "@/content/zh/pages/features";
import { HOME_PAGE_CONTENT_ZH } from "@/content/zh/pages/home";
import { PRICING_PAGE_CONTENT_ZH } from "@/content/zh/pages/pricing";

function createStructuredPageLocaleMap(
  contentByLocale: Readonly<Record<AppLocale, PageContent>>
): Readonly<Record<AppLocale, PageContent>> {
  return contentByLocale;
}

export const STRUCTURED_PAGE_CONTENT: Readonly<
  Record<StructuredMarketingPageSlug, Readonly<Record<AppLocale, PageContent>>>
> = {
  home: createStructuredPageLocaleMap({
    en: HOME_PAGE_CONTENT_EN,
    es: HOME_PAGE_CONTENT_ES,
    ru: HOME_PAGE_CONTENT_RU,
    uk: HOME_PAGE_CONTENT_UK,
    fa: HOME_PAGE_CONTENT_FA,
    zh: HOME_PAGE_CONTENT_ZH,
    ar: HOME_PAGE_CONTENT_AR,
    he: HOME_PAGE_CONTENT_HE,
    de: HOME_PAGE_CONTENT_DE,
    fr: HOME_PAGE_CONTENT_FR,
    id: HOME_PAGE_CONTENT_ID,
    it: HOME_PAGE_CONTENT_IT,
    ja: HOME_PAGE_CONTENT_JA,
    ko: HOME_PAGE_CONTENT_KO,
    pl: HOME_PAGE_CONTENT_PL,
    "pt-br": HOME_PAGE_CONTENT_PT_BR,
    tr: HOME_PAGE_CONTENT_TR,
    vi: HOME_PAGE_CONTENT_VI,
    "zh-hant": HOME_PAGE_CONTENT_ZH_HANT,
  }),
  features: createStructuredPageLocaleMap({
    en: FEATURES_PAGE_CONTENT_EN,
    es: FEATURES_PAGE_CONTENT_ES,
    ru: FEATURES_PAGE_CONTENT_RU,
    uk: FEATURES_PAGE_CONTENT_UK,
    fa: FEATURES_PAGE_CONTENT_FA,
    zh: FEATURES_PAGE_CONTENT_ZH,
    ar: FEATURES_PAGE_CONTENT_AR,
    he: FEATURES_PAGE_CONTENT_HE,
    de: FEATURES_PAGE_CONTENT_DE,
    fr: FEATURES_PAGE_CONTENT_FR,
    id: FEATURES_PAGE_CONTENT_ID,
    it: FEATURES_PAGE_CONTENT_IT,
    ja: FEATURES_PAGE_CONTENT_JA,
    ko: FEATURES_PAGE_CONTENT_KO,
    pl: FEATURES_PAGE_CONTENT_PL,
    "pt-br": FEATURES_PAGE_CONTENT_PT_BR,
    tr: FEATURES_PAGE_CONTENT_TR,
    vi: FEATURES_PAGE_CONTENT_VI,
    "zh-hant": FEATURES_PAGE_CONTENT_ZH_HANT,
  }),
  pricing: createStructuredPageLocaleMap({
    en: PRICING_PAGE_CONTENT_EN,
    es: PRICING_PAGE_CONTENT_ES,
    ru: PRICING_PAGE_CONTENT_RU,
    uk: PRICING_PAGE_CONTENT_UK,
    fa: PRICING_PAGE_CONTENT_FA,
    zh: PRICING_PAGE_CONTENT_ZH,
    ar: PRICING_PAGE_CONTENT_AR,
    he: PRICING_PAGE_CONTENT_HE,
    de: PRICING_PAGE_CONTENT_DE,
    fr: PRICING_PAGE_CONTENT_FR,
    id: PRICING_PAGE_CONTENT_ID,
    it: PRICING_PAGE_CONTENT_IT,
    ja: PRICING_PAGE_CONTENT_JA,
    ko: PRICING_PAGE_CONTENT_KO,
    pl: PRICING_PAGE_CONTENT_PL,
    "pt-br": PRICING_PAGE_CONTENT_PT_BR,
    tr: PRICING_PAGE_CONTENT_TR,
    vi: PRICING_PAGE_CONTENT_VI,
    "zh-hant": PRICING_PAGE_CONTENT_ZH_HANT,
  }),
};
