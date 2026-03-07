import { NextResponse } from "next/server";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { LLMS_ASSET_PATHNAME } from "@/lib/markdownAssetPaths";

const RESPONSE_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=3600",
};

function getLlmsAssetFilePath(): string {
  return join(process.cwd(), "public", LLMS_ASSET_PATHNAME);
}

export async function GET(): Promise<NextResponse> {
  const llmsAssetFilePath = getLlmsAssetFilePath();

  if (!existsSync(llmsAssetFilePath)) {
    throw new Error(`Static llms.txt asset not found: ${llmsAssetFilePath}`);
  }

  return new NextResponse(readFileSync(llmsAssetFilePath, "utf-8"), {
    headers: RESPONSE_HEADERS,
  });
}
