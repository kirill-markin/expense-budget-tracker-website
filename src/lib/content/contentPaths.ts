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
  "privacy" | "terms"
>;

const CONTENT_ROOT_DIR = join(process.cwd(), "src", "content");
const CONTENT_SECTION_DIRECTORIES: Readonly<
  Record<AppLocale, Readonly<Record<ContentSection, string>>>
> = {
  en: {
    blog: join(CONTENT_ROOT_DIR, "en", "blog"),
    docs: join(CONTENT_ROOT_DIR, "en", "docs"),
    pages: join(CONTENT_ROOT_DIR, "en", "pages"),
  },
  es: {
    blog: join(CONTENT_ROOT_DIR, "es", "blog"),
    docs: join(CONTENT_ROOT_DIR, "es", "docs"),
    pages: join(CONTENT_ROOT_DIR, "es", "pages"),
  },
  ru: {
    blog: join(CONTENT_ROOT_DIR, "ru", "blog"),
    docs: join(CONTENT_ROOT_DIR, "ru", "docs"),
    pages: join(CONTENT_ROOT_DIR, "ru", "pages"),
  },
  uk: {
    blog: join(CONTENT_ROOT_DIR, "uk", "blog"),
    docs: join(CONTENT_ROOT_DIR, "uk", "docs"),
    pages: join(CONTENT_ROOT_DIR, "uk", "pages"),
  },
  fa: {
    blog: join(CONTENT_ROOT_DIR, "fa", "blog"),
    docs: join(CONTENT_ROOT_DIR, "fa", "docs"),
    pages: join(CONTENT_ROOT_DIR, "fa", "pages"),
  },
  zh: {
    blog: join(CONTENT_ROOT_DIR, "zh", "blog"),
    docs: join(CONTENT_ROOT_DIR, "zh", "docs"),
    pages: join(CONTENT_ROOT_DIR, "zh", "pages"),
  },
  ar: {
    blog: join(CONTENT_ROOT_DIR, "ar", "blog"),
    docs: join(CONTENT_ROOT_DIR, "ar", "docs"),
    pages: join(CONTENT_ROOT_DIR, "ar", "pages"),
  },
  he: {
    blog: join(CONTENT_ROOT_DIR, "he", "blog"),
    docs: join(CONTENT_ROOT_DIR, "he", "docs"),
    pages: join(CONTENT_ROOT_DIR, "he", "pages"),
  },
};

export function getContentSectionDirectory(
  locale: AppLocale,
  section: ContentSection
): string {
  return CONTENT_SECTION_DIRECTORIES[locale][section];
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
  return join(getContentSectionDirectory(locale, "pages"), `${slug}.ts`);
}
