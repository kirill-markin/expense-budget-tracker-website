import { join } from "path";
import type { DocSlug } from "@/data/docs";
import {
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/lib/i18n/config";
import type { MarketingPageSlug } from "./types";

export type ContentSection = "blog" | "docs" | "pages";
export type StructuredMarketingPageSlug = Extract<
  MarketingPageSlug,
  "home" | "features" | "pricing"
>;
export type MarkdownBackedPageSlug = Extract<
  MarketingPageSlug,
  "privacy" | "support" | "terms"
>;

const CONTENT_ROOT_DIR = join(process.cwd(), "src", "content");

export function getContentSectionDirectory(
  locale: AppLocale,
  section: ContentSection
): string {
  switch (section) {
    case "blog":
      switch (locale) {
        case "en": return join(CONTENT_ROOT_DIR, "en", "blog");
        case "es": return join(CONTENT_ROOT_DIR, "es", "blog");
        case "ru": return join(CONTENT_ROOT_DIR, "ru", "blog");
        case "uk": return join(CONTENT_ROOT_DIR, "uk", "blog");
        case "fa": return join(CONTENT_ROOT_DIR, "fa", "blog");
        case "zh": return join(CONTENT_ROOT_DIR, "zh", "blog");
        case "ar": return join(CONTENT_ROOT_DIR, "ar", "blog");
        case "he": return join(CONTENT_ROOT_DIR, "he", "blog");
        case "de": return join(CONTENT_ROOT_DIR, "de", "blog");
        case "fr": return join(CONTENT_ROOT_DIR, "fr", "blog");
        case "id": return join(CONTENT_ROOT_DIR, "id", "blog");
        case "it": return join(CONTENT_ROOT_DIR, "it", "blog");
        case "ja": return join(CONTENT_ROOT_DIR, "ja", "blog");
        case "ko": return join(CONTENT_ROOT_DIR, "ko", "blog");
        case "pl": return join(CONTENT_ROOT_DIR, "pl", "blog");
        case "pt-br": return join(CONTENT_ROOT_DIR, "pt-br", "blog");
        case "tr": return join(CONTENT_ROOT_DIR, "tr", "blog");
        case "vi": return join(CONTENT_ROOT_DIR, "vi", "blog");
        case "zh-hant": return join(CONTENT_ROOT_DIR, "zh-hant", "blog");
        default:
          throw new Error(`Unsupported content locale: ${locale}`);
      }
    case "docs":
      switch (locale) {
        case "en": return join(CONTENT_ROOT_DIR, "en", "docs");
        case "es": return join(CONTENT_ROOT_DIR, "es", "docs");
        case "ru": return join(CONTENT_ROOT_DIR, "ru", "docs");
        case "uk": return join(CONTENT_ROOT_DIR, "uk", "docs");
        case "fa": return join(CONTENT_ROOT_DIR, "fa", "docs");
        case "zh": return join(CONTENT_ROOT_DIR, "zh", "docs");
        case "ar": return join(CONTENT_ROOT_DIR, "ar", "docs");
        case "he": return join(CONTENT_ROOT_DIR, "he", "docs");
        case "de": return join(CONTENT_ROOT_DIR, "de", "docs");
        case "fr": return join(CONTENT_ROOT_DIR, "fr", "docs");
        case "id": return join(CONTENT_ROOT_DIR, "id", "docs");
        case "it": return join(CONTENT_ROOT_DIR, "it", "docs");
        case "ja": return join(CONTENT_ROOT_DIR, "ja", "docs");
        case "ko": return join(CONTENT_ROOT_DIR, "ko", "docs");
        case "pl": return join(CONTENT_ROOT_DIR, "pl", "docs");
        case "pt-br": return join(CONTENT_ROOT_DIR, "pt-br", "docs");
        case "tr": return join(CONTENT_ROOT_DIR, "tr", "docs");
        case "vi": return join(CONTENT_ROOT_DIR, "vi", "docs");
        case "zh-hant": return join(CONTENT_ROOT_DIR, "zh-hant", "docs");
        default:
          throw new Error(`Unsupported content locale: ${locale}`);
      }
    case "pages":
      switch (locale) {
        case "en": return join(CONTENT_ROOT_DIR, "en", "pages");
        case "es": return join(CONTENT_ROOT_DIR, "es", "pages");
        case "ru": return join(CONTENT_ROOT_DIR, "ru", "pages");
        case "uk": return join(CONTENT_ROOT_DIR, "uk", "pages");
        case "fa": return join(CONTENT_ROOT_DIR, "fa", "pages");
        case "zh": return join(CONTENT_ROOT_DIR, "zh", "pages");
        case "ar": return join(CONTENT_ROOT_DIR, "ar", "pages");
        case "he": return join(CONTENT_ROOT_DIR, "he", "pages");
        case "de": return join(CONTENT_ROOT_DIR, "de", "pages");
        case "fr": return join(CONTENT_ROOT_DIR, "fr", "pages");
        case "id": return join(CONTENT_ROOT_DIR, "id", "pages");
        case "it": return join(CONTENT_ROOT_DIR, "it", "pages");
        case "ja": return join(CONTENT_ROOT_DIR, "ja", "pages");
        case "ko": return join(CONTENT_ROOT_DIR, "ko", "pages");
        case "pl": return join(CONTENT_ROOT_DIR, "pl", "pages");
        case "pt-br": return join(CONTENT_ROOT_DIR, "pt-br", "pages");
        case "tr": return join(CONTENT_ROOT_DIR, "tr", "pages");
        case "vi": return join(CONTENT_ROOT_DIR, "vi", "pages");
        case "zh-hant": return join(CONTENT_ROOT_DIR, "zh-hant", "pages");
        default:
          throw new Error(`Unsupported content locale: ${locale}`);
      }
    default:
      throw new Error(`Unsupported content section: ${section}`);
  }
}

export function getContentSectionDirectories(
  section: ContentSection
): ReadonlyArray<string> {
  return SUPPORTED_LOCALES.map((locale) =>
    getContentSectionDirectory(locale, section)
  );
}

export function getDocFilePath(slug: DocSlug, locale: AppLocale): string {
  return join(getContentSectionDirectory(locale, "docs"), `${slug}.md`);
}

export function getBlogFilePath(slug: string, locale: AppLocale): string {
  return join(getContentSectionDirectory(locale, "blog"), `${slug}.md`);
}

export function getMarkdownPageFilePath(
  slug: MarkdownBackedPageSlug,
  locale: AppLocale
): string {
  return join(getContentSectionDirectory(locale, "pages"), slug, "index.md");
}

export function getStructuredMarketingPageSourcePath(
  slug: StructuredMarketingPageSlug,
  locale: AppLocale
): string {
  switch (slug) {
    case "home":
      switch (locale) {
        case "en": return join(CONTENT_ROOT_DIR, "en", "pages", "home.ts");
        case "es": return join(CONTENT_ROOT_DIR, "es", "pages", "home.ts");
        case "ru": return join(CONTENT_ROOT_DIR, "ru", "pages", "home.ts");
        case "uk": return join(CONTENT_ROOT_DIR, "uk", "pages", "home.ts");
        case "fa": return join(CONTENT_ROOT_DIR, "fa", "pages", "home.ts");
        case "zh": return join(CONTENT_ROOT_DIR, "zh", "pages", "home.ts");
        case "ar": return join(CONTENT_ROOT_DIR, "ar", "pages", "home.ts");
        case "he": return join(CONTENT_ROOT_DIR, "he", "pages", "home.ts");
        case "de": return join(CONTENT_ROOT_DIR, "de", "pages", "home.ts");
        case "fr": return join(CONTENT_ROOT_DIR, "fr", "pages", "home.ts");
        case "id": return join(CONTENT_ROOT_DIR, "id", "pages", "home.ts");
        case "it": return join(CONTENT_ROOT_DIR, "it", "pages", "home.ts");
        case "ja": return join(CONTENT_ROOT_DIR, "ja", "pages", "home.ts");
        case "ko": return join(CONTENT_ROOT_DIR, "ko", "pages", "home.ts");
        case "pl": return join(CONTENT_ROOT_DIR, "pl", "pages", "home.ts");
        case "pt-br": return join(CONTENT_ROOT_DIR, "pt-br", "pages", "home.ts");
        case "tr": return join(CONTENT_ROOT_DIR, "tr", "pages", "home.ts");
        case "vi": return join(CONTENT_ROOT_DIR, "vi", "pages", "home.ts");
        case "zh-hant": return join(CONTENT_ROOT_DIR, "zh-hant", "pages", "home.ts");
        default:
          throw new Error(`Unsupported content locale: ${locale}`);
      }
    case "features":
      switch (locale) {
        case "en": return join(CONTENT_ROOT_DIR, "en", "pages", "features.ts");
        case "es": return join(CONTENT_ROOT_DIR, "es", "pages", "features.ts");
        case "ru": return join(CONTENT_ROOT_DIR, "ru", "pages", "features.ts");
        case "uk": return join(CONTENT_ROOT_DIR, "uk", "pages", "features.ts");
        case "fa": return join(CONTENT_ROOT_DIR, "fa", "pages", "features.ts");
        case "zh": return join(CONTENT_ROOT_DIR, "zh", "pages", "features.ts");
        case "ar": return join(CONTENT_ROOT_DIR, "ar", "pages", "features.ts");
        case "he": return join(CONTENT_ROOT_DIR, "he", "pages", "features.ts");
        case "de": return join(CONTENT_ROOT_DIR, "de", "pages", "features.ts");
        case "fr": return join(CONTENT_ROOT_DIR, "fr", "pages", "features.ts");
        case "id": return join(CONTENT_ROOT_DIR, "id", "pages", "features.ts");
        case "it": return join(CONTENT_ROOT_DIR, "it", "pages", "features.ts");
        case "ja": return join(CONTENT_ROOT_DIR, "ja", "pages", "features.ts");
        case "ko": return join(CONTENT_ROOT_DIR, "ko", "pages", "features.ts");
        case "pl": return join(CONTENT_ROOT_DIR, "pl", "pages", "features.ts");
        case "pt-br": return join(CONTENT_ROOT_DIR, "pt-br", "pages", "features.ts");
        case "tr": return join(CONTENT_ROOT_DIR, "tr", "pages", "features.ts");
        case "vi": return join(CONTENT_ROOT_DIR, "vi", "pages", "features.ts");
        case "zh-hant": return join(CONTENT_ROOT_DIR, "zh-hant", "pages", "features.ts");
        default:
          throw new Error(`Unsupported content locale: ${locale}`);
      }
    case "pricing":
      switch (locale) {
        case "en": return join(CONTENT_ROOT_DIR, "en", "pages", "pricing.ts");
        case "es": return join(CONTENT_ROOT_DIR, "es", "pages", "pricing.ts");
        case "ru": return join(CONTENT_ROOT_DIR, "ru", "pages", "pricing.ts");
        case "uk": return join(CONTENT_ROOT_DIR, "uk", "pages", "pricing.ts");
        case "fa": return join(CONTENT_ROOT_DIR, "fa", "pages", "pricing.ts");
        case "zh": return join(CONTENT_ROOT_DIR, "zh", "pages", "pricing.ts");
        case "ar": return join(CONTENT_ROOT_DIR, "ar", "pages", "pricing.ts");
        case "he": return join(CONTENT_ROOT_DIR, "he", "pages", "pricing.ts");
        case "de": return join(CONTENT_ROOT_DIR, "de", "pages", "pricing.ts");
        case "fr": return join(CONTENT_ROOT_DIR, "fr", "pages", "pricing.ts");
        case "id": return join(CONTENT_ROOT_DIR, "id", "pages", "pricing.ts");
        case "it": return join(CONTENT_ROOT_DIR, "it", "pages", "pricing.ts");
        case "ja": return join(CONTENT_ROOT_DIR, "ja", "pages", "pricing.ts");
        case "ko": return join(CONTENT_ROOT_DIR, "ko", "pages", "pricing.ts");
        case "pl": return join(CONTENT_ROOT_DIR, "pl", "pages", "pricing.ts");
        case "pt-br": return join(CONTENT_ROOT_DIR, "pt-br", "pages", "pricing.ts");
        case "tr": return join(CONTENT_ROOT_DIR, "tr", "pages", "pricing.ts");
        case "vi": return join(CONTENT_ROOT_DIR, "vi", "pages", "pricing.ts");
        case "zh-hant": return join(CONTENT_ROOT_DIR, "zh-hant", "pages", "pricing.ts");
        default:
          throw new Error(`Unsupported content locale: ${locale}`);
      }
    default:
      throw new Error(`Unsupported structured marketing page slug: ${slug}`);
  }
}
