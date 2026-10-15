import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import sharp from "sharp";
import { marketingMediaManifest, parseMediaManifest, resolveMarketingMediaUrl, type MarketingMedia } from "../src/lib/marketingMedia";
import { resolveMarkdownMedia } from "../src/lib/content/resolveMarkdownMedia";
import { renderMarkdownToHtml } from "../src/lib/content/renderMarkdownToHtml";
import { assertAvailablePath, checksum, inspectMedia, prepareMedia } from "./mediaFiles";

const sha256 = "a".repeat(64);
const entry: MarketingMedia = {
  publicPath: "/blog/article.png",
  url: `https://example.public.blob.vercel-storage.com/marketing/${sha256}.png`,
  width: 10,
  height: 20,
  sha256,
  bytes: 100,
};

test("marketing paths resolve to imported media and missing assets fail explicitly", () => {
  assert.ok(marketingMediaManifest.length > 0);
  for (const media of marketingMediaManifest) {
    assert.equal(resolveMarketingMediaUrl(media.publicPath), media.url);
    assert.equal(resolveMarketingMediaUrl(`https://expense-budget-tracker.com${media.publicPath}`), media.url);
    assert.equal(resolveMarketingMediaUrl(media.url), media.url);
  }
  assert.equal(resolveMarketingMediaUrl("/logo.svg"), "/logo.svg");
  assert.equal(resolveMarketingMediaUrl("/blog/article/"), "/blog/article/");
  assert.equal(resolveMarketingMediaUrl("https://example.com/image.png"), "https://example.com/image.png");
  assert.throws(() => resolveMarketingMediaUrl("/blog/unpublished-test-image.png"), /Missing marketing media manifest entry/);
});

test("Markdown and HTML share Blob destinations without editing prose or code samples", async () => {
  const media = marketingMediaManifest[0];
  assert.ok(media);
  const markdown = [
    `![Cover](${media.publicPath} "Cover")`,
    `![Reference][cover]`,
    `[cover]: <${media.publicPath}> "Cover"`,
    `[Download](${media.publicPath})`,
    `Plain path: ${media.publicPath}`,
    `\`${media.publicPath}\``,
    "```md",
    `![Example](${media.publicPath})`,
    "```",
  ].join("\n\n");
  const resolved = resolveMarkdownMedia(markdown);
  assert.ok(resolved.includes(`![Cover](${media.url} "Cover")`));
  assert.ok(resolved.includes(`[cover]: <${media.url}> "Cover"`));
  assert.ok(resolved.includes(`[Download](${media.url})`));
  assert.ok(resolved.includes(`Plain path: ${media.publicPath}`));
  assert.ok(resolved.includes(`\`${media.publicPath}\``));
  assert.ok(resolved.includes(`![Example](${media.publicPath})`));
  const html = await renderMarkdownToHtml(markdown);
  assert.ok(html.includes(`src="${media.url}"`));
  assert.ok(html.includes(`href="${media.url}"`));
  assert.equal(resolveMarkdownMedia(resolved), resolved);
});

test("manifest rejects duplicate paths, invalid dimensions and nonimmutable public URLs", () => {
  assert.deepEqual(parseMediaManifest([entry]), [entry]);
  assert.deepEqual(parseMediaManifest([{ ...entry, publicPath: "/home/panel.png" }]), [{ ...entry, publicPath: "/home/panel.png" }]);
  assert.throws(() => parseMediaManifest([{ ...entry, publicPath: "/features/panel.png" }]), /public path/);
  assert.throws(() => parseMediaManifest([entry, entry]), /Duplicate media public path/);
  assert.throws(() => parseMediaManifest([{ ...entry, width: 0 }]), /dimensions/);
  assert.throws(() => parseMediaManifest([{ ...entry, url: "https://example.com/image.png" }]), /Blob URL/);
  assert.throws(() => parseMediaManifest([{ ...entry, url: entry.url.replace(sha256, "b".repeat(64)) }]), /Blob URL/);
  assert.throws(() => parseMediaManifest([{ ...entry, publicPath: "/home/../image.png" }]), /public path/);
});

test("add compares original bytes and refuses conflicting logical paths", () => {
  const original = { ...entry, sha256: "b".repeat(64), url: entry.url.replace(sha256, "b".repeat(64)) };
  const optimized = { ...entry, original };
  assert.equal(assertAvailablePath([optimized], entry.publicPath, original.sha256), optimized);
  assert.throws(() => assertAvailablePath([optimized], entry.publicPath, entry.sha256), /different content/);
  assert.equal(assertAvailablePath([entry], "/home/new.png", sha256), undefined);
});

test("raster preparation preserves source bytes and creates a correctly measured WebP", async () => {
  const directory = await mkdtemp(join(tmpdir(), "media-publishing-"));
  try {
    const file = join(directory, "source.png");
    const data = await sharp({ create: { width: 7, height: 11, channels: 4, background: "red" } }).png().toBuffer();
    await writeFile(file, data);
    const { original, delivery } = await prepareMedia(file);
    assert.deepEqual(original.data, data);
    assert.deepEqual(await readFile(file), data);
    assert.equal(original.sha256, checksum(data));
    assert.equal(delivery.extension, "webp");
    assert.equal(delivery.width, 7);
    assert.equal(delivery.height, 11);
    assert.equal(delivery.sha256, checksum(delivery.data));
    assert.equal((await inspectMedia(data)).data, data);
  } finally {
    await rm(directory, { recursive: true });
  }
});
