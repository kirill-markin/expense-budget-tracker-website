import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { FEATURES } from "@/data/features";
import { DOCS } from "@/data/docs";

const SITE_URL = "https://expense-budget-tracker.com";
const GITHUB_URL = "https://github.com/kirill-markin/expense-budget-tracker";
const APP_URL = "https://app.expense-budget-tracker.com";
const DOCS_DIR = join(process.cwd(), "src/content/docs");
const BLOG_DIR = join(process.cwd(), "src/content/blog");

type MarkdownResult = {
  markdown: string;
  status: 200 | 404;
};

export function renderHomeMarkdown(): MarkdownResult {
  const lines: string[] = [
    "# Expense Budget Tracker",
    "",
    "Track expenses. Plan budgets. Own your data.",
    "",
    "Open-source personal finance tracker with multi-currency support, budget planning, and financial dashboards. Self-host on Postgres or use the cloud version.",
    "",
    `- [Get Started](${APP_URL})`,
    `- [View on GitHub](${GITHUB_URL})`,
    "",
    "## Features",
    "",
    "- **Multi-Currency** — Track accounts in any currency. Automatic FX conversion from ECB, CBR, and NBS rates.",
    "- **Budget Planning** — Monthly budget grid with income and spending categories. Compare planned vs actual.",
    "- **Dashboards** — Visual breakdowns of spending, balances over time, and FX impact on your portfolio.",
    "- **Self-Hosted** — Docker Compose with Postgres. Your data stays on your server. No third-party dependencies.",
    "- **API Access** — SQL API with bearer token auth. Connect LLM agents, scripts, or dashboards directly.",
    "- **Workspace Isolation** — Row-level security in Postgres. Each user gets an isolated workspace. Share via invites.",
    "",
    `[Features](${SITE_URL}/features/) | [Pricing](${SITE_URL}/pricing/) | [Docs](${SITE_URL}/docs/) | [Blog](${SITE_URL}/blog/)`,
  ];

  return { markdown: lines.join("\n"), status: 200 };
}

export function renderFeaturesMarkdown(): MarkdownResult {
  const lines: string[] = [
    "# Features",
    "",
    "Everything you need to track personal finances, without giving up control of your data.",
    "",
  ];

  for (const f of FEATURES) {
    lines.push(`## ${f.title}`);
    lines.push("");
    lines.push(f.description);
    lines.push("");
  }

  return { markdown: lines.join("\n"), status: 200 };
}

export function renderPricingMarkdown(): MarkdownResult {
  const lines: string[] = [
    "# Pricing",
    "",
    "All features are available in every plan. No feature gating.",
    "",
    "## Self-Hosted — Free",
    "",
    "- Full source code on GitHub",
    "- Docker Compose + Postgres",
    "- All features included",
    "- Your server, your data",
    "- Community support",
    "",
    `[View on GitHub](${GITHUB_URL})`,
    "",
    "## Cloud — Free during beta",
    "",
    "- Managed hosting on AWS",
    "- Automatic backups",
    "- All features included",
    "- Email OTP authentication",
    "- Daily FX rate updates",
    "",
    `[Get Started](${APP_URL})`,
  ];

  return { markdown: lines.join("\n"), status: 200 };
}

export function renderDocsListingMarkdown(): MarkdownResult {
  const lines: string[] = [
    "# Documentation",
    "",
  ];

  for (const doc of DOCS) {
    lines.push(`- [${doc.title}](${SITE_URL}/docs/${doc.slug}/): ${doc.description}`);
  }

  return { markdown: lines.join("\n"), status: 200 };
}

export function renderDocMarkdown(slug: string): MarkdownResult {
  const filePath = join(DOCS_DIR, `${slug}.md`);
  if (!existsSync(filePath)) {
    return { markdown: `# 404\n\nDocument not found: ${slug}`, status: 404 };
  }
  const raw = readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const title = (data as { title: string }).title;
  return { markdown: `# ${title}\n\n${content.trim()}`, status: 200 };
}

export function renderBlogListingMarkdown(): MarkdownResult {
  if (!existsSync(BLOG_DIR)) {
    return { markdown: "# Blog\n\nPosts coming soon.", status: 200 };
  }

  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts = files
    .map((file) => {
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

  const lines: string[] = [
    "# Blog",
    "",
  ];

  for (const post of posts) {
    lines.push(`- [${post.title}](${SITE_URL}/blog/${post.slug}/) — ${post.date}: ${post.description}`);
  }

  return { markdown: lines.join("\n"), status: 200 };
}

export function renderBlogPostMarkdown(slug: string): MarkdownResult {
  const filePath = join(BLOG_DIR, `${slug}.md`);
  if (!existsSync(filePath)) {
    return { markdown: `# 404\n\nBlog post not found: ${slug}`, status: 404 };
  }
  const raw = readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const title = (data as { title: string; date: string }).title;
  const date = (data as { title: string; date: string }).date;
  return { markdown: `# ${title}\n\n*${date}*\n\n${content.trim()}`, status: 200 };
}

export function renderPrivacyMarkdown(): MarkdownResult {
  const lines: string[] = [
    "# Privacy Policy",
    "",
    "**Last updated:** March 2026",
    "",
    "## What We Collect",
    "",
    "When you use the cloud version, we store the financial data you enter (transactions, budgets, account names) and your email address for authentication. Self-hosted instances do not send any data to us.",
    "",
    "## How We Use Your Data",
    "",
    "Your financial data is used solely to provide the service. We do not sell, share, or use your data for advertising. Each workspace is isolated via Postgres row-level security.",
    "",
    "## Data Storage",
    "",
    "Cloud data is stored in AWS RDS (Postgres) in the eu-central-1 region with daily automated backups. Data is encrypted at rest and in transit.",
    "",
    "## Cookies",
    "",
    "We use a `session` cookie for authentication (HttpOnly, Secure, SameSite=Lax). No tracking cookies or third-party analytics.",
    "",
    "## Data Deletion",
    "",
    "You can delete your account and all associated data at any time from Settings in the app. For self-hosted instances, you control the database directly.",
    "",
    "## Open Source",
    "",
    "The entire codebase is open source. You can audit exactly what the application does with your data.",
  ];

  return { markdown: lines.join("\n"), status: 200 };
}

export function renderTermsMarkdown(): MarkdownResult {
  const lines: string[] = [
    "# Terms of Service",
    "",
    "**Last updated:** March 2026",
    "",
    "## Service",
    "",
    "Expense Budget Tracker is an open-source personal finance tool. The cloud version is provided as-is during the beta period at no cost.",
    "",
    "## Your Data",
    "",
    "You own your data. We do not claim any rights to the financial information you enter. You can export or delete your data at any time.",
    "",
    "## Acceptable Use",
    "",
    "Do not use the service for illegal activities, attempt to access other users' data, or abuse the API rate limits.",
    "",
    "## Availability",
    "",
    "The cloud service is provided on a best-effort basis. For guaranteed availability, self-host the application on your own infrastructure.",
    "",
    "## Open Source",
    "",
    "The source code is available under the MIT license. Self-hosted deployments are not subject to these terms.",
  ];

  return { markdown: lines.join("\n"), status: 200 };
}
