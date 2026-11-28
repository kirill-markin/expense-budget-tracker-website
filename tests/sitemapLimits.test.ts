import assert from "node:assert/strict";
import { test } from "node:test";
import { checkSitemap, type SitemapEntry } from "@/lib/sitemap/checkSitemap";

const entry: SitemapEntry = {
  url: "https://example.com/",
  lastModified: new Date("2026-11-28T00:00:00Z"),
  changeFrequency: "weekly",
  priority: 1,
  alternates: { languages: { es: "https://example.com/es/" } },
};

test("the sitemap guard accepts a normal sitemap", () => {
  assert.doesNotThrow(() => checkSitemap([entry]));
});

test("the sitemap guard rejects an empty sitemap", () => {
  assert.throws(() => checkSitemap([]), /No URL entries found for \/sitemap\.xml/);
});

test("the sitemap guard rejects more than 50,000 URL entries", () => {
  const entries = Array.from({ length: 50_001 }, () => entry);
  assert.throws(() => checkSitemap(entries), /50001 URLs.*50000-URL limit.*Split the sitemap/);
});

test("the sitemap guard includes escaped UTF-8 alternate URLs in the XML size", () => {
  const largeEntry: SitemapEntry = {
    ...entry,
    alternates: { languages: { es: `https://example.com/es/?q=${"é&".repeat(900)}` } },
  };
  const entries = Array.from({ length: 8_500 }, () => largeEntry);
  assert.throws(() => checkSitemap(entries), /uncompressed bytes.*52428800-byte limit.*Split the sitemap/);
});
