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
        default:
          throw new Error(`Unsupported content locale: ${locale}`);
      }
    default:
      throw new Error(`Unsupported structured marketing page slug: ${slug}`);
  }
}
