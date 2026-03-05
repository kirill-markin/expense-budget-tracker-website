import type { MetadataRoute } from "next";
import { readdirSync, statSync, existsSync } from "fs";
import { join } from "path";

const SITE_URL = "https://expense-budget-tracker.com";
const BLOG_DIR = join(process.cwd(), "src/content/blog");
const DOCS_DIR = join(process.cwd(), "src/content/docs");

const DOC_SLUGS = ["getting-started", "self-hosting", "api", "architecture"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE_URL}/features/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/pricing/`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blog/`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/docs/`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/privacy/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/terms/`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const blogEntries: MetadataRoute.Sitemap = existsSync(BLOG_DIR)
    ? readdirSync(BLOG_DIR)
        .filter((f) => f.endsWith(".md"))
        .map((f) => {
          const slug = f.replace(/\.md$/, "");
          const filePath = join(BLOG_DIR, f);
          return {
            url: `${SITE_URL}/blog/${slug}/`,
            lastModified: statSync(filePath).mtime,
            changeFrequency: "monthly" as const,
            priority: 0.6,
          };
        })
    : [];

  const docEntries: MetadataRoute.Sitemap = DOC_SLUGS.map((slug) => {
    const filePath = join(DOCS_DIR, `${slug}.md`);
    const lastModified = existsSync(filePath) ? statSync(filePath).mtime : now;
    return {
      url: `${SITE_URL}/docs/${slug}/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    };
  });

  return [...staticEntries, ...blogEntries, ...docEntries];
}
