import type { Metadata } from "next";
import Image from "next/image";
import { AuthButton } from "@/components/AuthButton";
import { CopyCodeField } from "@/components/CopyCodeField";
import { getAppUrl } from "@/lib/auth";
import { renderMarkdownToHtml } from "@/lib/content/renderMarkdownToHtml";
import {
  getAvailableLocalesForMarketingPage,
  getMarketingPageMarkdownRoutePath,
  getMarketingPageRoutePath,
  readPageContent,
} from "@/lib/content/readPageContent";
import type {
  FeatureListSection,
  HeroSection,
  LegalPageSection,
  MarketingPageSlug,
  PricingTiersSection,
} from "@/lib/content/types";
import type { AppLocale } from "@/lib/i18n/config";
import { getSiteMessages } from "@/lib/i18n/messages";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import homeStyles from "@/app/(default)/page.module.css";
import featuresStyles from "@/app/(default)/features/page.module.css";
import pricingStyles from "@/app/(default)/pricing/page.module.css";
import legalStyles from "@/app/(default)/privacy/page.module.css";

const AGENT_FEATURE_INDEX = 4;

interface MarketingPageProps {
  readonly locale: AppLocale;
  readonly slug: MarketingPageSlug;
}

function getHeroSection(locale: AppLocale): HeroSection {
  const pageContent = readPageContent("home", locale);
  const section = pageContent.sections[0];

  if (section?.type !== "hero") {
    throw new Error(`Invalid home page content structure for locale: ${locale}`);
  }

  return section;
}

function getHomeFeatureSection(locale: AppLocale): FeatureListSection {
  const pageContent = readPageContent("home", locale);
  const section = pageContent.sections[1];

  if (section?.type !== "feature_list") {
    throw new Error(`Invalid home page features structure for locale: ${locale}`);
  }

  return section;
}

function getFeaturesSection(locale: AppLocale): FeatureListSection {
  const pageContent = readPageContent("features", locale);
  const section = pageContent.sections[0];

  if (section?.type !== "feature_list") {
    throw new Error(`Invalid features page content structure for locale: ${locale}`);
  }

  return section;
}

function getPricingSection(locale: AppLocale): PricingTiersSection {
  const pageContent = readPageContent("pricing", locale);
  const section = pageContent.sections[0];

  if (section?.type !== "pricing_tiers") {
    throw new Error(`Invalid pricing page content structure for locale: ${locale}`);
  }

  return section;
}

function getLegalSection(
  slug: Extract<MarketingPageSlug, "privacy" | "terms">,
  locale: AppLocale
): LegalPageSection {
  const pageContent = readPageContent(slug, locale);
  const section = pageContent.sections[0];

  if (section?.type !== "legal_page") {
    throw new Error(`Invalid legal page content structure for ${slug}:${locale}`);
  }

  return section;
}

function renderHomePage(locale: AppLocale): React.JSX.Element {
  const pageContent = readPageContent("home", locale);
  const heroSection = getHeroSection(locale);
  const featureSection = getHomeFeatureSection(locale);
  const agentFeature = featureSection.items[AGENT_FEATURE_INDEX];
  const messages = getSiteMessages(locale);
  const appUrl = getAppUrl();

  if (agentFeature === undefined) {
    throw new Error(`Missing agent feature description for locale: ${locale}`);
  }

  return (
    <div className={homeStyles.hero}>
      <div className={homeStyles.heroInner}>
        <section className={homeStyles.heroGrid} aria-labelledby="home-hero-title">
          <div className={homeStyles.heroMainCard}>
            <div>
              <h1 id="home-hero-title" className={homeStyles.title}>
                {heroSection.titleLines.map((line, index) => (
                  <span key={line}>
                    {line}
                    {index < heroSection.titleLines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </h1>
              <p className={homeStyles.subtitle}>{heroSection.subtitle}</p>
            </div>
            <div className={homeStyles.cta}>
              <AuthButton locale={locale} />
            </div>
          </div>

          <aside className={homeStyles.heroAside}>
            <section
              className={homeStyles.heroAsideSection}
              aria-labelledby="for-human-title"
            >
              <h2 id="for-human-title" className={homeStyles.asideTitle}>
                {messages.home.humanTitle}
              </h2>
              <div className={homeStyles.humanLinks}>
                <a href={appUrl} className={homeStyles.humanLink}>
                  {messages.home.humanWebApp}
                </a>
              </div>
            </section>

            <section
              className={homeStyles.heroAsideSection}
              aria-labelledby="for-agent-title"
            >
              <h2 id="for-agent-title" className={homeStyles.asideTitle}>
                {messages.home.agentTitle}
              </h2>
              <p className={homeStyles.agentDescription}>{agentFeature.description}</p>
              <div className={homeStyles.hint}>
                <CopyCodeField
                  value={`${heroSection.hintText}\n${heroSection.hintLink.href}`}
                />
              </div>
            </section>
          </aside>
        </section>
      </div>

      <section className={homeStyles.showcase} aria-labelledby="product-showcase-title">
        <div className={homeStyles.showcaseHeader}>
          <p className={homeStyles.showcaseEyebrow}>{messages.home.showcaseEyebrow}</p>
          <h2 id="product-showcase-title" className={homeStyles.showcaseTitle}>
            {messages.home.showcaseTitle}
          </h2>
        </div>
        <div className={homeStyles.showcaseFrame}>
          <Image
            src="/home/budget-screenshot.jpg"
            alt={messages.home.showcaseImageAlt}
            width={3624}
            height={2030}
            priority
            className={homeStyles.showcaseImage}
          />
        </div>
      </section>

      <section className={homeStyles.features}>
        <div className={homeStyles.featureGrid}>
          {featureSection.items.map((item) => (
            <div key={item.title} className={homeStyles.featureCard}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function renderFeaturesPage(locale: AppLocale): React.JSX.Element {
  const pageContent = readPageContent("features", locale);
  const featureSection = getFeaturesSection(locale);

  return (
    <div className={featuresStyles.container}>
      <h1 className={featuresStyles.title}>{pageContent.title}</h1>
      <p className={featuresStyles.subtitle}>{featureSection.intro}</p>
      <div className={featuresStyles.grid}>
        {featureSection.items.map((item) => (
          <div key={item.title} className={featuresStyles.card}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderPricingPage(locale: AppLocale): React.JSX.Element {
  const pageContent = readPageContent("pricing", locale);
  const pricingSection = getPricingSection(locale);
  const selfHostedTier = pricingSection.tiers[0];
  const cloudTier = pricingSection.tiers[1];

  if (selfHostedTier?.type !== "link_tier" || cloudTier?.type !== "auth_tier") {
    throw new Error(`Invalid pricing tier structure for locale: ${locale}`);
  }

  return (
    <div className={pricingStyles.container}>
      <h1 className={pricingStyles.title}>{pageContent.title}</h1>
      <p className={pricingStyles.subtitle}>{pricingSection.intro}</p>

      <div className={pricingStyles.grid}>
        <div className={pricingStyles.card}>
          <h2>{selfHostedTier.name}</h2>
          <div className={pricingStyles.price}>{selfHostedTier.price}</div>
          <ul className={pricingStyles.features}>
            {selfHostedTier.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <a
            href={selfHostedTier.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className={pricingStyles.secondaryButton}
          >
            {selfHostedTier.cta.label}
          </a>
        </div>

        <div className={`${pricingStyles.card} ${pricingStyles.highlighted}`}>
          <h2>{cloudTier.name}</h2>
          <div className={pricingStyles.price}>{cloudTier.price}</div>
          <ul className={pricingStyles.features}>
            {cloudTier.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <div className={pricingStyles.ctaWrapper}>
            <AuthButton locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}

async function renderLegalPage(
  slug: Extract<MarketingPageSlug, "privacy" | "terms">,
  locale: AppLocale
): Promise<React.JSX.Element> {
  const pageContent = readPageContent(slug, locale);
  const legalSection = getLegalSection(slug, locale);
  const contentHtml = await renderMarkdownToHtml(pageContent.body);

  return (
    <div className={legalStyles.container}>
      <h1 className={legalStyles.title}>{pageContent.title}</h1>
      <div className={legalStyles.content}>
        <p>
          <strong>{locale === "es" ? "Última actualización:" : "Last updated:"}</strong>{" "}
          {legalSection.lastUpdated}
        </p>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>
    </div>
  );
}

export function getMarketingPageMetadata(
  locale: AppLocale,
  slug: MarketingPageSlug
): Metadata {
  const pageContent = readPageContent(slug, locale);

  return createPageMetadata({
    title: pageContent.title,
    description: pageContent.description,
    locale,
    routePath: getMarketingPageRoutePath(slug),
    markdownRoutePath: getMarketingPageMarkdownRoutePath(slug),
    openGraphType: "website",
    availableLocales: getAvailableLocalesForMarketingPage(slug),
  });
}

export async function MarketingPage(
  props: MarketingPageProps
): Promise<React.JSX.Element> {
  switch (props.slug) {
    case "home":
      return renderHomePage(props.locale);
    case "features":
      return renderFeaturesPage(props.locale);
    case "pricing":
      return renderPricingPage(props.locale);
    case "privacy":
    case "terms":
      return renderLegalPage(props.slug, props.locale);
  }
}
