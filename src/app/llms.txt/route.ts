import { NextResponse } from "next/server";

const SITE_URL = "https://expense-budget-tracker.com";

export async function GET(): Promise<NextResponse> {
  const content = `# Expense Budget Tracker

> Open-source expense and budget tracker with multi-currency support, transfers, and financial dashboards. Self-host on Postgres or use the cloud version.

## Documentation

- [Getting Started](${SITE_URL}/docs/getting-started/): Sign up for cloud or set up your own instance
- [Self-Hosting Guide](${SITE_URL}/docs/self-hosting/): Docker Compose deployment
- [API Reference](${SITE_URL}/docs/api/): SQL API with bearer token auth
- [Architecture](${SITE_URL}/docs/architecture/): System overview and data model

## Pages

- [Home](${SITE_URL}/): Product overview and feature highlights
- [Features](${SITE_URL}/features/): Detailed feature list
- [Pricing](${SITE_URL}/pricing/): Self-hosted (free) and cloud plans
- [Blog](${SITE_URL}/blog/): Updates and tutorials
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
