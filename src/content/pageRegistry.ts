import type { AppLocale } from "@/lib/i18n/config";
import type { StructuredMarketingPageSlug } from "@/lib/content/contentPaths";
import type { PageContent } from "@/lib/content/types";
import { FEATURES_PAGE_CONTENT_EN } from "@/content/en/pages/features";
import { HOME_PAGE_CONTENT_EN } from "@/content/en/pages/home";
import { PRICING_PAGE_CONTENT_EN } from "@/content/en/pages/pricing";
import { FEATURES_PAGE_CONTENT_ES } from "@/content/es/pages/features";
import { HOME_PAGE_CONTENT_ES } from "@/content/es/pages/home";
import { PRICING_PAGE_CONTENT_ES } from "@/content/es/pages/pricing";

export const STRUCTURED_PAGE_CONTENT: Readonly<
  Record<StructuredMarketingPageSlug, Readonly<Record<AppLocale, PageContent>>>
> = {
  home: {
    en: HOME_PAGE_CONTENT_EN,
    es: HOME_PAGE_CONTENT_ES,
  },
  features: {
    en: FEATURES_PAGE_CONTENT_EN,
    es: FEATURES_PAGE_CONTENT_ES,
  },
  pricing: {
    en: PRICING_PAGE_CONTENT_EN,
    es: PRICING_PAGE_CONTENT_ES,
  },
};
