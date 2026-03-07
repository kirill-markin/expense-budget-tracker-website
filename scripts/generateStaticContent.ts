import { mkdirSync, rmSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import {
  LLMS_ASSET_PATHNAME,
  getMarkdownAssetPathname,
} from "../src/lib/markdownAssetPaths";
import {
  listMarkdownPagePaths,
  renderLlmsText,
  renderMarkdownDocument,
} from "../src/lib/markdownServe";

interface GeneratedAsset {
  readonly assetPathname: string;
  readonly content: string;
}

function getOutputDirectory(): string {
  return join(process.cwd(), "public", "__markdown");
}

function getOutputFilePath(assetPathname: string): string {
  return join(process.cwd(), "public", assetPathname);
}

function writeGeneratedAsset(asset: GeneratedAsset): void {
  const outputFilePath = getOutputFilePath(asset.assetPathname);

  mkdirSync(dirname(outputFilePath), { recursive: true });
  writeFileSync(outputFilePath, asset.content, "utf-8");
}

function generateMarkdownAssets(): ReadonlyArray<GeneratedAsset> {
  return listMarkdownPagePaths().map((pagePath): GeneratedAsset => {
    const result = renderMarkdownDocument(pagePath);

    if (result.status !== 200) {
      throw new Error(`Failed to render Markdown asset for page path: ${pagePath}`);
    }

    return {
      assetPathname: getMarkdownAssetPathname(pagePath),
      content: result.markdown,
    };
  });
}

function generateLlmsAsset(): GeneratedAsset {
  return {
    assetPathname: LLMS_ASSET_PATHNAME,
    content: renderLlmsText(),
  };
}

function main(): void {
  const outputDirectory = getOutputDirectory();
  const assets = [...generateMarkdownAssets(), generateLlmsAsset()];

  rmSync(outputDirectory, { recursive: true, force: true });
  assets.forEach(writeGeneratedAsset);
}

main();
