import { remark } from "remark";
import type { Nodes } from "mdast";
import { resolveMarketingMediaUrl } from "../marketingMedia";

interface MediaReplacement {
  readonly start: number;
  readonly end: number;
  readonly url: string;
}

export function resolveMarkdownMedia(markdown: string): string {
  const replacements: MediaReplacement[] = [];

  function visit(node: Nodes): void {
    if (node.type === "image" || node.type === "link" || node.type === "definition") {
      const url = resolveMarketingMediaUrl(node.url);
      if (url !== node.url) {
        const start = node.position?.start.offset;
        const end = node.position?.end.offset;
        if (start === undefined || end === undefined) {
          throw new Error(`Missing Markdown source position for media: ${node.url}`);
        }
        const source = markdown.slice(start, end);
        const delimiter = node.type === "definition" ? "]:" : "](";
        const destinationStart = source.lastIndexOf(delimiter) + delimiter.length;
        const offset = source.indexOf(node.url, destinationStart);
        if (offset === -1) {
          throw new Error(`Cannot locate Markdown media destination: ${node.url}`);
        }
        replacements.push({ start: start + offset, end: start + offset + node.url.length, url });
      }
    }
    if ("children" in node) node.children.forEach(visit);
  }

  visit(remark().parse(markdown));
  return replacements.sort((left, right) => right.start - left.start)
    .reduce((result, replacement) => `${result.slice(0, replacement.start)}${replacement.url}${result.slice(replacement.end)}`, markdown);
}
