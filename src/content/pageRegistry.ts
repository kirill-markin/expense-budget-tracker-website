import type { AppLocale } from "@/lib/i18n/config";
import type { StructuredMarketingPageSlug } from "@/lib/content/contentPaths";
import type { PageContent } from "@/lib/content/types";
import { FEATURES_PAGE_CONTENT_AR } from "@/content/ar/pages/features";
import { HOME_PAGE_CONTENT_AR } from "@/content/ar/pages/home";
import { PRICING_PAGE_CONTENT_AR } from "@/content/ar/pages/pricing";
import { FEATURES_PAGE_CONTENT_EN } from "@/content/en/pages/features";
import { HOME_PAGE_CONTENT_EN } from "@/content/en/pages/home";
import { PRICING_PAGE_CONTENT_EN } from "@/content/en/pages/pricing";
import { FEATURES_PAGE_CONTENT_ES } from "@/content/es/pages/features";
import { HOME_PAGE_CONTENT_ES } from "@/content/es/pages/home";
import { PRICING_PAGE_CONTENT_ES } from "@/content/es/pages/pricing";
import { FEATURES_PAGE_CONTENT_FA } from "@/content/fa/pages/features";
import { HOME_PAGE_CONTENT_FA } from "@/content/fa/pages/home";
import { PRICING_PAGE_CONTENT_FA } from "@/content/fa/pages/pricing";
import { FEATURES_PAGE_CONTENT_HE } from "@/content/he/pages/features";
import { HOME_PAGE_CONTENT_HE } from "@/content/he/pages/home";
import { PRICING_PAGE_CONTENT_HE } from "@/content/he/pages/pricing";
import { FEATURES_PAGE_CONTENT_RU } from "@/content/ru/pages/features";
import { HOME_PAGE_CONTENT_RU } from "@/content/ru/pages/home";
import { PRICING_PAGE_CONTENT_RU } from "@/content/ru/pages/pricing";
import { FEATURES_PAGE_CONTENT_UK } from "@/content/uk/pages/features";
import { HOME_PAGE_CONTENT_UK } from "@/content/uk/pages/home";
import { PRICING_PAGE_CONTENT_UK } from "@/content/uk/pages/pricing";
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
  }),
};
