import { remark } from "remark";
import gfm from "remark-gfm";
import html from "remark-html";
import { resolveMarkdownMedia } from "./resolveMarkdownMedia";

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(gfm).use(html).process(resolveMarkdownMedia(markdown));
  return result.toString();
}
