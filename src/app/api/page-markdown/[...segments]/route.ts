import { NextResponse } from "next/server";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import {
  getMarkdownAssetPathname,
  getPagePathFromSegments,
} from "@/lib/markdownAssetPaths";

const CACHE_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Cache-Control":
    "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
};

function getAssetFilePath(pagePath: string): string {
  return join(process.cwd(), "public", getMarkdownAssetPathname(pagePath));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ segments: string[] }> }
): Promise<NextResponse> {
  const { segments } = await params;
  const pagePath = getPagePathFromSegments(segments);
  const assetFilePath = getAssetFilePath(pagePath);

  if (!existsSync(assetFilePath)) {
    const notFound = `# 404\n\nPage not found: /${segments.join("/")}`;
    return new NextResponse(notFound, { status: 404, headers: CACHE_HEADERS });
  }

  return new NextResponse(readFileSync(assetFilePath, "utf-8"), {
    status: 200,
    headers: CACHE_HEADERS,
  });
}
