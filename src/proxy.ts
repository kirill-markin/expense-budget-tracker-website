import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // --- Markdown serving: .md extension ---
  if (pathname.endsWith(".md")) {
    if (pathname === "/llms.txt") {
      return NextResponse.next();
    }

    const stripped = pathname.slice(1, -3); // remove leading / and .md
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/api/page-markdown/${stripped || "home"}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  // --- Markdown serving: Accept header ---
  const accept = request.headers.get("accept") || "";
  if (
    accept.includes("text/markdown") &&
    !pathname.startsWith("/api/") &&
    !pathname.startsWith("/_next/")
  ) {
    const stripped = pathname.replace(/^\//, "").replace(/\/$/, "");
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/api/page-markdown/${stripped || "home"}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  // --- Default: add Vary and Link headers ---
  const response = NextResponse.next();
  response.headers.set("Vary", "Accept");

  const cleanPath = pathname.replace(/\/+$/, "");
  const mdPath = cleanPath === "" ? "/.md" : `${cleanPath}.md`;
  response.headers.set(
    "Link",
    `<${mdPath}>; rel="alternate"; type="text/markdown"`
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)|robots\\.txt).*)",
  ],
};
