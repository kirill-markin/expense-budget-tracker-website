import { remark } from "remark";
import html from "remark-html";

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
