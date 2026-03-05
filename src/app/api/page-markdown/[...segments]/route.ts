import { NextResponse } from "next/server";
import {
  renderHomeMarkdown,
  renderFeaturesMarkdown,
  renderPricingMarkdown,
  renderDocsListingMarkdown,
  renderDocMarkdown,
  renderBlogListingMarkdown,
  renderBlogPostMarkdown,
  renderPrivacyMarkdown,
  renderTermsMarkdown,
} from "@/lib/markdownServe";

const SITE_URL = "https://expense-budget-tracker.com";

const CACHE_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Cache-Control":
    "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
};

function markdownFooter(pagePath: string): string {
  const originalUrl =
    pagePath === "" ? `${SITE_URL}/` : `${SITE_URL}/${pagePath}/`;
  return `\n\n---\n*[View the styled HTML version of this page](${originalUrl})*\n\n*Tip: Append \`.md\` to any URL on ${SITE_URL} to get a clean Markdown version of that page.*`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ segments: string[] }> }
): Promise<NextResponse> {
  const { segments } = await params;

  // Route: home
  if (
    segments.length === 0 ||
    (segments.length === 1 && segments[0] === "home")
  ) {
    const result = renderHomeMarkdown();
    return new NextResponse(result.markdown + markdownFooter(""), {
      status: result.status,
      headers: CACHE_HEADERS,
    });
  }

  const first = segments[0];

  // Route: features
  if (segments.length === 1 && first === "features") {
    const result = renderFeaturesMarkdown();
    return new NextResponse(result.markdown + markdownFooter("features"), {
      status: result.status,
      headers: CACHE_HEADERS,
    });
  }

  // Route: pricing
  if (segments.length === 1 && first === "pricing") {
    const result = renderPricingMarkdown();
    return new NextResponse(result.markdown + markdownFooter("pricing"), {
      status: result.status,
      headers: CACHE_HEADERS,
    });
  }

  // Route: docs listing
  if (segments.length === 1 && first === "docs") {
    const result = renderDocsListingMarkdown();
    return new NextResponse(result.markdown + markdownFooter("docs"), {
      status: result.status,
      headers: CACHE_HEADERS,
    });
  }

  // Route: docs/[slug]
  if (segments.length === 2 && first === "docs") {
    const result = renderDocMarkdown(segments[1]);
    return new NextResponse(
      result.markdown + markdownFooter(`docs/${segments[1]}`),
      { status: result.status, headers: CACHE_HEADERS }
    );
  }

  // Route: blog listing
  if (segments.length === 1 && first === "blog") {
    const result = renderBlogListingMarkdown();
    return new NextResponse(result.markdown + markdownFooter("blog"), {
      status: result.status,
      headers: CACHE_HEADERS,
    });
  }

  // Route: blog/[slug]
  if (segments.length === 2 && first === "blog") {
    const result = renderBlogPostMarkdown(segments[1]);
    return new NextResponse(
      result.markdown + markdownFooter(`blog/${segments[1]}`),
      { status: result.status, headers: CACHE_HEADERS }
    );
  }

  // Route: privacy
  if (segments.length === 1 && first === "privacy") {
    const result = renderPrivacyMarkdown();
    return new NextResponse(result.markdown + markdownFooter("privacy"), {
      status: result.status,
      headers: CACHE_HEADERS,
    });
  }

  // Route: terms
  if (segments.length === 1 && first === "terms") {
    const result = renderTermsMarkdown();
    return new NextResponse(result.markdown + markdownFooter("terms"), {
      status: result.status,
      headers: CACHE_HEADERS,
    });
  }

  // 404
  const notFound = `# 404\n\nPage not found: /${segments.join("/")}`;
  return new NextResponse(notFound, { status: 404, headers: CACHE_HEADERS });
}
