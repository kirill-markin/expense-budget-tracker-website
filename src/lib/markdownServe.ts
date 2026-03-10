import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { DOCS } from "@/data/docs";
import {
  getMarketingPageSlugFromPath,
  listMarketingPagePaths,
  readAllMarketingPages,
  readPageContent,
} from "@/lib/content/readPageContent";
import {
  renderMarketingPageMarkdown,
  type MarkdownSiteContext,
} from "@/lib/content/renderMarkdown";

const SITE_CONTEXT: MarkdownSiteContext = {
  siteUrl: "https://expense-budget-tracker.com",
  appUrl: "https://app.expense-budget-tracker.com",
  githubUrl: "https://github.com/kirill-markin/expense-budget-tracker",
};
const DISCOVERY_URL = "https://app.expense-budget-tracker.com/api/agent";

const DOCS_DIR = join(process.cwd(), "src/content/docs");
const BLOG_DIR = join(process.cwd(), "src/content/blog");

type MarkdownResult = {
  readonly markdown: string;
  readonly status: 200 | 404;
};

interface DocFrontmatter {
  readonly title: string;
}

interface BlogFrontmatter {
  readonly title: string;
  readonly description: string;
  readonly date: string;
}

export interface BlogMeta {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
}

function getDocFilePath(slug: string): string {
  return join(DOCS_DIR, `${slug}.md`);
}

function getBlogFilePath(slug: string): string {
  return join(BLOG_DIR, `${slug}.md`);
}

function getOriginalPageUrl(pagePath: string): string {
  if (pagePath === "") {
    return `${SITE_CONTEXT.siteUrl}/`;
  }

  return `${SITE_CONTEXT.siteUrl}/${pagePath}/`;
}

function appendMarkdownFooter(markdown: string, pagePath: string): string {
  return `${markdown.trim()}\n\n---\n*[View the styled HTML version of this page](${getOriginalPageUrl(
    pagePath
  )})*\n\n*AI agents can create an account for the user in this service by starting with \`GET ${DISCOVERY_URL}\`.*\n\n*Tip: Append \`.md\` to any URL on ${SITE_CONTEXT.siteUrl} to get a clean Markdown version of that page.*`;
}

function renderMarketingPageMarkdownDocument(pagePath: string): MarkdownResult {
  const pageSlug = getMarketingPageSlugFromPath(pagePath);

  if (pageSlug === null) {
    return { markdown: `# 404\n\nPage not found: /${pagePath}`, status: 404 };
  }

  const pageContent = readPageContent(pageSlug);

  return {
    markdown: appendMarkdownFooter(
      renderMarketingPageMarkdown(pageContent),
      pagePath
    ),
    status: 200,
  };
}

export function renderDocsListingMarkdown(): MarkdownResult {
  const lines: string[] = [
    "# Documentation",
    "",
  ];

  DOCS.forEach((doc) => {
    lines.push(
      `- [${doc.title}](${SITE_CONTEXT.siteUrl}/docs/${doc.slug}/): ${doc.description}`
    );
  });

  return { markdown: appendMarkdownFooter(lines.join("\n"), "docs"), status: 200 };
}

export function getBlogPosts(): ReadonlyArray<BlogMeta> {
  if (!existsSync(BLOG_DIR)) {
    return [];
  }

  return readdirSync(BLOG_DIR)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName): BlogMeta => {
      const raw = readFileSync(
        getBlogFilePath(fileName.replace(/\.md$/, "")),
        "utf-8"
      );
      const { data } = matter(raw);
      const frontmatter = data as BlogFrontmatter;

      return {
        slug: fileName.replace(/\.md$/, ""),
        title: frontmatter.title,
        description: frontmatter.description,
        date: frontmatter.date,
      };
    })
    .sort((leftPost, rightPost) => (leftPost.date > rightPost.date ? -1 : 1));
}

export function renderDocMarkdown(slug: string): MarkdownResult {
  const filePath = getDocFilePath(slug);

  if (!existsSync(filePath)) {
    return { markdown: `# 404\n\nDocument not found: ${slug}`, status: 404 };
  }

  const raw = readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as DocFrontmatter;

  return {
    markdown: appendMarkdownFooter(
      `# ${frontmatter.title}\n\n${content.trim()}`,
      `docs/${slug}`
    ),
    status: 200,
  };
}

export function renderBlogListingMarkdown(): MarkdownResult {
  const posts = getBlogPosts();

  if (posts.length === 0) {
    return { markdown: "# Blog\n\nPosts coming soon.", status: 200 };
  }

  const lines: string[] = [
    "# Blog",
    "",
  ];

  posts.forEach((post) => {
    lines.push(
      `- [${post.title}](${SITE_CONTEXT.siteUrl}/blog/${post.slug}/) - ${post.date}: ${post.description}`
    );
  });

  return { markdown: appendMarkdownFooter(lines.join("\n"), "blog"), status: 200 };
}

export function renderBlogPostMarkdown(slug: string): MarkdownResult {
  const filePath = getBlogFilePath(slug);

  if (!existsSync(filePath)) {
    return { markdown: `# 404\n\nBlog post not found: ${slug}`, status: 404 };
  }

  const raw = readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const frontmatter = data as BlogFrontmatter;

  return {
    markdown: appendMarkdownFooter(
      `# ${frontmatter.title}\n\n*${frontmatter.date}*\n\n${content.trim()}`,
      `blog/${slug}`
    ),
    status: 200,
  };
}

export function listMarkdownPagePaths(): ReadonlyArray<string> {
  const blogPostPaths = getBlogPosts().map((post) => `blog/${post.slug}`);
  const docPaths = DOCS.map((doc) => `docs/${doc.slug}`);

  return [
    ...listMarketingPagePaths(),
    "docs",
    ...docPaths,
    "blog",
    ...blogPostPaths,
  ];
}

export function renderMarkdownDocument(pagePath: string): MarkdownResult {
  const marketingPageResult = renderMarketingPageMarkdownDocument(pagePath);

  if (marketingPageResult.status === 200) {
    return marketingPageResult;
  }

  if (pagePath === "docs") {
    return renderDocsListingMarkdown();
  }

  if (pagePath.startsWith("docs/")) {
    return renderDocMarkdown(pagePath.replace(/^docs\//, ""));
  }

  if (pagePath === "blog") {
    return renderBlogListingMarkdown();
  }

  if (pagePath.startsWith("blog/")) {
    return renderBlogPostMarkdown(pagePath.replace(/^blog\//, ""));
  }

  return marketingPageResult;
}

export function renderLlmsText(): string {
  const pagesSection = readAllMarketingPages()
    .map((pageContent) => {
      const pageHref =
        pageContent.slug === "home"
          ? `${SITE_CONTEXT.siteUrl}/`
          : `${SITE_CONTEXT.siteUrl}/${pageContent.slug}/`;

      return `- [${pageContent.title}](${pageHref}): ${pageContent.description}`;
    })
    .join("\n");

  const docsSection = DOCS.map(
    (doc) =>
      `- [${doc.title}](${SITE_CONTEXT.siteUrl}/docs/${doc.slug}/): ${doc.description}`
  ).join("\n");

  const posts = getBlogPosts();
  const blogSection =
    posts.length > 0
      ? posts
          .map(
            (post) =>
              `- [${post.title}](${SITE_CONTEXT.siteUrl}/blog/${post.slug}/): ${post.description}`
          )
          .join("\n")
      : "- Posts coming soon.";

  return `# Expense Budget Tracker

> Open-source expense and budget tracker with multi-currency support, budget planning, and financial dashboards.

## Pages

${pagesSection}

## Documentation

${docsSection}

## Blog

${blogSection}

## Links

- [GitHub Repository](${SITE_CONTEXT.githubUrl})
- [Cloud App](${SITE_CONTEXT.appUrl})

## Markdown Access

Any page on this site is available as clean Markdown for LLM consumption:
- Append \`.md\` to any URL (e.g. ${SITE_CONTEXT.siteUrl}/.md, ${SITE_CONTEXT.siteUrl}/features.md, ${SITE_CONTEXT.siteUrl}/docs/api.md)
- Or send the HTTP header \`Accept: text/markdown\` to get Markdown from the original URL`;
}
