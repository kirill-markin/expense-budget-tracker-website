const MARKDOWN_ASSET_PREFIX = "/__markdown";

export const LLMS_ASSET_PATHNAME = `${MARKDOWN_ASSET_PREFIX}/llms.txt`;

function normalizePagePath(pagePath: string): string {
  if (pagePath === "") {
    return "";
  }

  return pagePath.replace(/^\/+/, "").replace(/\/+$/, "");
}

export function getMarkdownAssetPathname(pagePath: string): string {
  const normalizedPagePath = normalizePagePath(pagePath);

  if (normalizedPagePath === "") {
    return `${MARKDOWN_ASSET_PREFIX}/home.md`;
  }

  return `${MARKDOWN_ASSET_PREFIX}/${normalizedPagePath}.md`;
}

export function getPagePathFromHtmlPathname(pathname: string): string {
  return pathname.replace(/^\/+/, "").replace(/\/+$/, "");
}

export function getPagePathFromMarkdownPathname(pathname: string): string | null {
  if (pathname === "/llms.txt" || !pathname.endsWith(".md")) {
    return null;
  }

  return pathname.slice(1, -3);
}

export function getPagePathFromSegments(
  segments: ReadonlyArray<string>
): string {
  if (segments.length === 0) {
    return "";
  }

  if (segments.length === 1 && segments[0] === "home") {
    return "";
  }

  return segments.join("/");
}
