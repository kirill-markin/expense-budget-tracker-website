export type MarketingPageSlug =
  | "home"
  | "features"
  | "pricing"
  | "privacy"
  | "terms";

export interface ContentLink {
  readonly label: string;
  readonly href: string;
}

export interface FeatureItem {
  readonly title: string;
  readonly description: string;
}

export interface HeroSection {
  readonly type: "hero";
  readonly titleLines: ReadonlyArray<string>;
  readonly subtitle: string;
  readonly primaryLink: ContentLink;
  readonly secondaryLink: ContentLink;
  readonly hintText: string;
  readonly hintLink: ContentLink;
}

export interface FeatureListSection {
  readonly type: "feature_list";
  readonly title: string;
  readonly intro: string;
  readonly items: ReadonlyArray<FeatureItem>;
}

export interface LinkPricingTier {
  readonly type: "link_tier";
  readonly name: string;
  readonly price: string;
  readonly highlighted: boolean;
  readonly bullets: ReadonlyArray<string>;
  readonly cta: ContentLink;
}

export interface AuthPricingTier {
  readonly type: "auth_tier";
  readonly name: string;
  readonly price: string;
  readonly highlighted: boolean;
  readonly bullets: ReadonlyArray<string>;
  readonly cta: ContentLink;
}

export type PricingTier = LinkPricingTier | AuthPricingTier;

export interface PricingTiersSection {
  readonly type: "pricing_tiers";
  readonly title: string;
  readonly intro: string;
  readonly tiers: ReadonlyArray<PricingTier>;
}

export interface LegalPageSection {
  readonly type: "legal_page";
  readonly lastUpdated: string;
}

export interface SimpleMarkdownPageSection {
  readonly type: "simple_markdown_page";
}

export type PageSection =
  | HeroSection
  | FeatureListSection
  | PricingTiersSection
  | LegalPageSection
  | SimpleMarkdownPageSection;

export interface PageContent {
  readonly title: string;
  readonly description: string;
  readonly slug: MarketingPageSlug;
  readonly sections: ReadonlyArray<PageSection>;
  readonly body: string;
}
