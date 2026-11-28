import { remark } from "remark";
import html from "remark-html";
import type { AppLocale } from "@/lib/i18n/config";
import { parseMarkdownWithProductLinks } from "./resolveMarkdownProductLinks";
import { resolveMarkdownMedia } from "./resolveMarkdownMedia";

const processor = remark().use(html);

export async function renderMarkdownToHtml(markdown: string, locale: AppLocale): Promise<string> {
  const { tree } = parseMarkdownWithProductLinks(resolveMarkdownMedia(markdown), locale);
  return processor.stringify(tree);
}
