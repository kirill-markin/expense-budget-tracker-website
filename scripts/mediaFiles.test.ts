import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import sharp from "sharp";
import { parseMediaManifest, type MarketingMedia } from "../src/lib/marketingMedia";
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
