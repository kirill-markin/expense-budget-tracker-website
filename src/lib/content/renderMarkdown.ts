import type {
  FeatureListSection,
  HeroSection,
  LegalPageSection,
  MarketingPageSlug,
  PageContent,
  PricingTier,
  PricingTiersSection,
} from "./types";
import { getMarketingPagePath } from "./readPageContent";

export interface MarkdownSiteContext {
  readonly siteUrl: string;
  readonly appUrl: string;
  readonly githubUrl: string;
}

function getPageUrl(
  siteContext: MarkdownSiteContext,
  slug: MarketingPageSlug
): string {
  const pagePath = getMarketingPagePath(slug);

  if (pagePath === "") {
    return `${siteContext.siteUrl}/`;
  }

  return `${siteContext.siteUrl}/${pagePath}/`;
}

function renderHeroSection(
  section: HeroSection,
  lines: string[]
): void {
  lines.push(section.titleLines.join(" "));
  lines.push("");
  lines.push(section.subtitle);
  lines.push("");
  lines.push(`[${section.primaryLink.label}](${section.primaryLink.href})`);
  lines.push(`[${section.secondaryLink.label}](${section.secondaryLink.href})`);
  lines.push("");
  lines.push("```text");
  lines.push(section.hintText);
  lines.push(section.hintLink.href);
  lines.push("```");
  lines.push("");
}

function renderFeatureListSection(
  section: FeatureListSection,
  pageContent: PageContent,
  lines: string[]
): void {
  if (section.title !== pageContent.title) {
    lines.push(`## ${section.title}`);
    lines.push("");
  }

  lines.push(section.intro);
  lines.push("");

  section.items.forEach((item) => {
    lines.push(`- **${item.title}** - ${item.description}`);
  });

  lines.push("");
}

function renderPricingTier(tier: PricingTier, lines: string[]): void {
  lines.push(`## ${tier.name} - ${tier.price}`);
  lines.push("");

  tier.bullets.forEach((bullet) => {
    lines.push(`- ${bullet}`);
  });

  lines.push("");
  lines.push(`[${tier.cta.label}](${tier.cta.href})`);
  lines.push("");
}

function renderPricingTiersSection(
  section: PricingTiersSection,
  pageContent: PageContent,
  lines: string[]
): void {
  if (section.title !== pageContent.title) {
    lines.push(`## ${section.title}`);
    lines.push("");
  }

  lines.push(section.intro);
  lines.push("");
  section.tiers.forEach((tier) => renderPricingTier(tier, lines));
}

function renderLegalPageSection(
  section: LegalPageSection,
  pageContent: PageContent,
  lines: string[]
): void {
  lines.push(`**Last updated:** ${section.lastUpdated}`);
  lines.push("");
  lines.push(pageContent.body);
  lines.push("");
}

function renderPageSections(
  pageContent: PageContent,
  lines: string[]
): void {
  pageContent.sections.forEach((section) => {
    switch (section.type) {
      case "hero":
        renderHeroSection(section, lines);
        return;
      case "feature_list":
        renderFeatureListSection(section, pageContent, lines);
        return;
      case "pricing_tiers":
        renderPricingTiersSection(section, pageContent, lines);
        return;
      case "legal_page":
        renderLegalPageSection(section, pageContent, lines);
        return;
      case "simple_markdown_page":
        lines.push(pageContent.body);
        lines.push("");
        return;
    }
  });
}

function renderMarkdownFooter(
  pageContent: PageContent,
  siteContext: MarkdownSiteContext
): string {
  const originalUrl = getPageUrl(siteContext, pageContent.slug);

  return `\n\n---\n*[View the styled HTML version of this page](${originalUrl})*\n\n*Tip: Append \`.md\` to any URL on ${siteContext.siteUrl} to get a clean Markdown version of that page.*`;
}

export function renderMarketingPageMarkdown(
  pageContent: PageContent
): string {
  const lines: string[] = [`# ${pageContent.title}`, ""];

  renderPageSections(pageContent, lines);

  return lines.join("\n").trim();
}

export function renderMarketingPageDocument(
  pageContent: PageContent,
  siteContext: MarkdownSiteContext
): string {
  return `${renderMarketingPageMarkdown(pageContent)}${renderMarkdownFooter(
    pageContent,
    siteContext
  )}`;
}
