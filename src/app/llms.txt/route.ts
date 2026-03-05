import { NextResponse } from "next/server";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { DOCS } from "@/data/docs";

const SITE_URL = "https://expense-budget-tracker.com";
const BLOG_DIR = join(process.cwd(), "src/content/blog");

interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
}

function getBlogPosts(): ReadonlyArray<BlogMeta> {
  if (!existsSync(BLOG_DIR)) return [];
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file): BlogMeta => {
      const raw = readFileSync(join(BLOG_DIR, file), "utf-8");
      const { data } = matter(raw);
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title as string,
        description: data.description as string,
        date: data.date as string,
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function GET(): Promise<NextResponse> {
  const posts = getBlogPosts();

  const docsSection = DOCS.map(
    (d) => `- [${d.title}](${SITE_URL}/docs/${d.slug}/): ${d.description}`
  ).join("\n");

  const blogSection =
    posts.length > 0
      ? posts
          .map(
            (p) =>
              `- [${p.title}](${SITE_URL}/blog/${p.slug}/): ${p.description}`
          )
          .join("\n")
      : "- Posts coming soon.";

  const content = `# Expense Budget Tracker

> Open-source expense and budget tracker with multi-currency support, transfers, and financial dashboards. Self-host on Postgres or use the cloud version.

## Documentation

${docsSection}

## Blog

${blogSection}

## Pages

- [Home](${SITE_URL}/): Product overview and feature highlights
- [Features](${SITE_URL}/features/): Detailed feature list
- [Pricing](${SITE_URL}/pricing/): Self-hosted (free) and cloud plans
- [Privacy Policy](${SITE_URL}/privacy/): Data handling practices
- [Terms of Service](${SITE_URL}/terms/): Usage terms

## Links

- [GitHub Repository](https://github.com/kirill-markin/expense-budget-tracker)
- [Cloud App](https://app.expense-budget-tracker.com)

## Markdown Access

Any page on this site is available as clean Markdown for LLM consumption:
- Append \`.md\` to any URL (e.g. ${SITE_URL}/.md, ${SITE_URL}/features.md, ${SITE_URL}/docs/api.md)
- Or send the HTTP header \`Accept: text/markdown\` to get Markdown from the original URL`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
