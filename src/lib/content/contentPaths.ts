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

export function getContentSectionDirectory(
  locale: AppLocale,
  section: ContentSection
): string {
  return join(CONTENT_ROOT_DIR, locale, section);
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
