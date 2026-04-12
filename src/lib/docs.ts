import { existsSync, readFileSync } from "fs";
import matter from "gray-matter";
import { DOC_SLUGS, type DocSlug } from "@/data/docs";
import { getDocFilePath } from "@/lib/content/contentPaths";
import { renderMarkdownToHtml } from "@/lib/content/renderMarkdownToHtml";
import {
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/lib/i18n/config";

interface DocFrontmatterInput {
  readonly title?: unknown;
  readonly description?: unknown;
}

export interface DocRecord {
  readonly slug: DocSlug;
  readonly locale: AppLocale;
  readonly title: string;
  readonly description: string;
  readonly bodyMarkdown: string;
}

export interface DocContent extends DocRecord {
  readonly contentHtml: string;
}

const cachedDocsByLocale = new Map<AppLocale, ReadonlyArray<DocRecord>>();
const renderedHtmlByLocaleAndSlug = new Map<string, Promise<string>>();

function assertNonEmptyString(
  value: unknown,
  fieldName: string,
  filePath: string
): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid doc ${fieldName} in ${filePath}`);
  }

  return value.trim();
}

function toDocSlug(slug: string): DocSlug | null {
  if (!DOC_SLUGS.includes(slug as DocSlug)) {
    return null;
  }

  return slug as DocSlug;
}

function hasDocFile(slug: DocSlug, locale: AppLocale): boolean {
  return existsSync(getDocFilePath(slug, locale));
}

function parseDoc(slug: DocSlug, locale: AppLocale): DocRecord {
  const filePath = getDocFilePath(slug, locale);

  if (!existsSync(filePath)) {
    throw new Error(
      `Missing doc content for slug ${slug} locale ${locale}: ${filePath}`
    );
  }

  const raw = readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as DocFrontmatterInput;

  return {
    slug,
    locale,
    title: assertNonEmptyString(frontmatter.title, "title", filePath),
    description: assertNonEmptyString(
      frontmatter.description,
      "description",
      filePath
    ),
    bodyMarkdown: content.trim(),
  };
}

export function getAvailableDocLocales(slug: string): ReadonlyArray<AppLocale> {
  const docSlug = toDocSlug(slug);

  if (docSlug === null) {
    return [];
  }

  return SUPPORTED_LOCALES.filter((locale) => hasDocFile(docSlug, locale));
}

export function getAvailableDocIndexLocales(): ReadonlyArray<AppLocale> {
  return SUPPORTED_LOCALES.filter((locale) => listDocs(locale).length > 0);
}

export function listDocs(locale: AppLocale): ReadonlyArray<DocRecord> {
  const cachedDocs = cachedDocsByLocale.get(locale);

  if (cachedDocs !== undefined) {
    return cachedDocs;
  }

  const docs = DOC_SLUGS.filter((slug) => hasDocFile(slug, locale)).map(
    (slug) => parseDoc(slug, locale)
  );
  cachedDocsByLocale.set(locale, docs);

  return docs;
}

export function readDoc(slug: string, locale: AppLocale): DocRecord | null {
  const docSlug = toDocSlug(slug);

  if (docSlug === null) {
    return null;
  }

  return listDocs(locale).find((doc) => doc.slug === docSlug) ?? null;
}

export async function readDocContent(
  slug: string,
  locale: AppLocale
): Promise<DocContent | null> {
  const doc = readDoc(slug, locale);

  if (doc === null) {
    return null;
  }

  const cacheKey = `${locale}:${slug}`;
  const cachedHtml = renderedHtmlByLocaleAndSlug.get(cacheKey);
  const contentHtmlPromise =
    cachedHtml ?? renderMarkdownToHtml(doc.bodyMarkdown);

  if (cachedHtml === undefined) {
    renderedHtmlByLocaleAndSlug.set(cacheKey, contentHtmlPromise);
  }

  return {
    ...doc,
    contentHtml: await contentHtmlPromise,
  };
}
