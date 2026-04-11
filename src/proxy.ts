import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  LLMS_ASSET_PATHNAME,
  getMarkdownAssetPathname,
  getMarkdownRoutePathname,
  getPagePathFromHtmlPathname,
  getPagePathFromMarkdownPathname,
} from "./lib/markdownAssetPaths";

function getMarkdownAlternatePathname(pathname: string): string {
  return getMarkdownRoutePathname(getPagePathFromHtmlPathname(pathname));
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/__markdown/")) {
    return NextResponse.next();
  }

  if (pathname === "/llms.txt") {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = LLMS_ASSET_PATHNAME;
    return NextResponse.rewrite(rewriteUrl);
  }

  // --- Markdown serving: .md extension ---
  const markdownPagePath = getPagePathFromMarkdownPathname(pathname);
  if (markdownPagePath !== null) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = getMarkdownAssetPathname(markdownPagePath);
    return NextResponse.rewrite(rewriteUrl);
  }

  // --- Markdown serving: Accept header ---
  const accept = request.headers.get("accept") || "";
  if (
    accept.includes("text/markdown") &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/_next/")
  ) {
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = getMarkdownAssetPathname(
      getPagePathFromHtmlPathname(pathname)
    );
    return NextResponse.rewrite(rewriteUrl);
  }

  // --- Default: add Vary and Link headers ---
  const response = NextResponse.next();
  response.headers.append("Vary", "Accept");

  response.headers.set(
    "Link",
    `<${getMarkdownAlternatePathname(pathname)}>; rel="alternate"; type="text/markdown"`
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)|robots\\.txt).*)",
  ],
};
