import type { Definition, ImageReference, LinkReference, Nodes, Parents, Root } from "mdast";
import { remark } from "remark";
import gfm from "remark-gfm";
import { localizeProductEntryUrl } from "@/lib/auth";
import type { AppLocale } from "@/lib/i18n/config";

const processor = remark().data("settings", { resourceLink: true }).use(gfm);
const plainReferenceLabel = /^[\p{L}\p{M}\p{N}_.-]+(?: [\p{L}\p{M}\p{N}_.-]+)*$/u;

type ReferenceAssociation = Definition | LinkReference | ImageReference;

interface LocalizedMarkdown {
  readonly tree: Root;
  readonly linksChanged: boolean;
}

function visitChildren(parent: Parents, visit: (node: Nodes, parent: Parents, index: number) => void): void {
  parent.children.forEach((node, index) => {
    visit(node, parent, index);
    if ("children" in node) visitChildren(node, visit);
  });
}

export function parseMarkdownWithProductLinks(markdown: string, locale: AppLocale): LocalizedMarkdown {
  const tree = processor.parse(markdown);
  const definitions = new Map<string, Definition>();
  const imageReferences = new Set<string>();

  visitChildren(tree, (node) => {
    if (node.type === "imageReference") imageReferences.add(node.identifier);
    if (node.type === "definition" && !definitions.has(node.identifier)) {
      definitions.set(node.identifier, node);
    }
  });

  let linksChanged = false;
  visitChildren(tree, (node, parent, index) => {
    if (node.type !== "link" && node.type !== "linkReference") return;
    const link = node.type === "link" ? node : definitions.get(node.identifier);
    if (!link) return;

    const url = localizeProductEntryUrl(link.url, locale);
    if (url === link.url) return;

    if (node.type === "linkReference" && imageReferences.has(node.identifier)) {
      parent.children[index] = {
        type: "link",
        url,
        title: link.title,
        children: node.children,
        position: node.position,
      };
    } else {
      link.url = url;
    }
    linksChanged = true;
  });

  return { tree, linksChanged };
}

function preserveReferenceIdentifiers(tree: Root): void {
  const associations = new Map<string, ReferenceAssociation[]>();
  visitChildren(tree, (node) => {
    if (node.type !== "definition" && node.type !== "linkReference" && node.type !== "imageReference") return;
    const group = associations.get(node.identifier);
    if (group) group.push(node);
    else associations.set(node.identifier, [node]);
  });

  // CommonMark matches raw labels, but Remark serializes their decoded text.
  let nextId = 1;
  for (const [identifier, group] of associations) {
    if (plainReferenceLabel.test(identifier) && group.every(({ label }) => label && plainReferenceLabel.test(label))) {
      continue;
    }

    let emittedId: string;
    do {
      emittedId = `reference-${nextId++}`;
    } while (associations.has(emittedId));
    for (const node of group) {
      node.identifier = emittedId;
      node.label = emittedId;
    }
  }
}

export function resolveMarkdownProductLinks(markdown: string, locale: AppLocale): string {
  const { tree, linksChanged } = parseMarkdownWithProductLinks(markdown, locale);
  if (!linksChanged) return markdown;

  preserveReferenceIdentifiers(tree);
  return processor.stringify(tree).trimEnd();
}
