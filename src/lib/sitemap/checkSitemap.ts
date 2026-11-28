import { Buffer } from "node:buffer";
import type { MetadataRoute } from "next";

export type SitemapEntry = MetadataRoute.Sitemap[number] & {
  images?: never;
  videos?: never;
};

const MAX_BYTES = 50 * 1024 * 1024;
const MAX_URLS = 50_000;
const SPLIT_SITEMAP = "Split the sitemap into multiple files and publish a sitemap index.";
const XML_ENTITIES: Readonly<Record<string, string>> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

// Budget the XHTML namespace and escaped values for a conservative UTF-8 bound
// on the XML emitted by the Next.js sitemap serializer.
const XML_WRAPPER_BYTES = (
  '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
  + '</urlset>\n'
).length;

function getEscapedXmlBytes(value: string): number {
  const escaped = value.replace(/[&<>"']/g, (character) => XML_ENTITIES[character]);
  return Buffer.byteLength(escaped, "utf8");
}

function getEntryXmlBytes(entry: SitemapEntry): number {
  let bytes = "<url>\n<loc></loc>\n</url>\n".length + getEscapedXmlBytes(entry.url);
  for (const [language, url] of Object.entries(entry.alternates?.languages ?? {})) {
    bytes += '<xhtml:link rel="alternate" hreflang="" href="" />\n'.length
      + getEscapedXmlBytes(language)
      + getEscapedXmlBytes(String(url));
  }
  if (entry.lastModified) {
    const date = entry.lastModified instanceof Date ? entry.lastModified.toISOString() : entry.lastModified;
    bytes += "<lastmod></lastmod>\n".length + getEscapedXmlBytes(date);
  }
  if (entry.changeFrequency) {
    bytes += "<changefreq></changefreq>\n".length + entry.changeFrequency.length;
  }
  if (typeof entry.priority === "number") {
    bytes += "<priority></priority>\n".length + String(entry.priority).length;
  }
  return bytes;
}

export function checkSitemap(entries: readonly SitemapEntry[]): void {
  if (entries.length === 0) {
    throw new Error("No URL entries found for /sitemap.xml. Check the sitemap route data.");
  }
  if (entries.length > MAX_URLS) {
    throw new Error(`/sitemap.xml contains ${entries.length} URLs and exceeds the ${MAX_URLS}-URL limit. ${SPLIT_SITEMAP}`);
  }

  const bytes = entries.reduce((total, entry) => total + getEntryXmlBytes(entry), XML_WRAPPER_BYTES);
  if (bytes > MAX_BYTES) {
    throw new Error(`/sitemap.xml could require ${bytes} uncompressed bytes, exceeding the ${MAX_BYTES}-byte limit. ${SPLIT_SITEMAP}`);
  }
}
