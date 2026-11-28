import { readFileSync, statSync } from "node:fs";

const sitemapPath = ".next/server/app/sitemap.xml.body";
const maxBytes = 50 * 1024 * 1024;
const maxUrls = 50_000;
const splitSitemap = "Split the sitemap into multiple files and publish a sitemap index.";

const sitemap = statSync(sitemapPath, { throwIfNoEntry: false });
if (!sitemap?.isFile()) {
  throw new Error(`Missing built sitemap at ${sitemapPath}. Check that Next.js statically generated /sitemap.xml.`);
}

if (sitemap.size > maxBytes) {
  throw new Error(`/sitemap.xml is ${sitemap.size} uncompressed bytes and exceeds the ${maxBytes}-byte limit. ${splitSitemap}`);
}

const xml = readFileSync(sitemapPath, "utf8");
const urlCount = [...xml.matchAll(/<url>/g)].length;
if (urlCount === 0) {
  throw new Error(`No URL entries found in ${sitemapPath}. Check the generated sitemap XML.`);
}

if (urlCount > maxUrls) {
  throw new Error(`/sitemap.xml contains ${urlCount} URLs and exceeds the ${maxUrls}-URL limit. ${splitSitemap}`);
}
