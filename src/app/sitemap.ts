import type { MetadataRoute } from "next";
import { join } from "path";
import { DOCS } from "@/data/docs";
import {
  getFileLastModified,
  getMarkdownSlugs,
  getNewestDirectoryFileLastModified,
} from "@/lib/sitemap/getLastModified";

const SITE_URL = "https://expense-budget-tracker.com";
const BLOG_DIR = join(process.cwd(), "src/content/blog");
const DOCS_DIR = join(process.cwd(), "src/content/docs");
const PAGES_DIR = join(process.cwd(), "src/content/pages");
const APP_DIR = join(process.cwd(), "src/app");

export default function sitemap(): MetadataRoute.Sitemap {
  const blogSlugs = getMarkdownSlugs(BLOG_DIR);
  const newestBlogLastModified = getNewestDirectoryFileLastModified(BLOG_DIR);
  const blogIndexLastModified =
    newestBlogLastModified ??
    getFileLastModified(join(APP_DIR, "blog", "page.tsx"));

  const docsIndexLastModified = getNewestDirectoryFileLastModified(DOCS_DIR);

  if (docsIndexLastModified === null) {
    throw new Error(`Missing docs markdown files for sitemap: ${DOCS_DIR}`);
  }

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: getFileLastModified(join(PAGES_DIR, "home.ts")),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/features/`,
      lastModified: getFileLastModified(join(PAGES_DIR, "features.ts")),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/pricing/`,
      lastModified: getFileLastModified(join(PAGES_DIR, "pricing.ts")),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog/`,
      lastModified: blogIndexLastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/docs/`,
      lastModified: docsIndexLastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/privacy/`,
      lastModified: getFileLastModified(join(PAGES_DIR, "privacy", "index.md")),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms/`,
      lastModified: getFileLastModified(join(PAGES_DIR, "terms", "index.md")),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const blogEntries: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}/`,
    lastModified: getFileLastModified(join(BLOG_DIR, `${slug}.md`)),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const docEntries: MetadataRoute.Sitemap = DOCS.map((doc) => ({
    url: `${SITE_URL}/docs/${doc.slug}/`,
    lastModified: getFileLastModified(join(DOCS_DIR, `${doc.slug}.md`)),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...blogEntries, ...docEntries];
}
