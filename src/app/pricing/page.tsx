import type { Metadata } from "next";
import { AuthButton } from "@/components/AuthButton";
import { readPageContent } from "@/lib/content/readPageContent";
import styles from "./page.module.css";

const pageContent = readPageContent("pricing");

function getPricingSection() {
  const section = pageContent.sections[0];

  if (section?.type !== "pricing_tiers") {
    throw new Error("Invalid pricing page content structure");
  }

  return section;
}

const pricingSection = getPricingSection();
const selfHostedTier = pricingSection.tiers[0];
const cloudTier = pricingSection.tiers[1];

if (selfHostedTier.type !== "link_tier" || cloudTier.type !== "auth_tier") {
  throw new Error("Invalid pricing tier structure");
}

export const metadata: Metadata = {
  title: pageContent.title,
  description: pageContent.description,
  alternates: {
    types: { "text/markdown": "/pricing.md" },
  },
};

export default function PricingPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{pageContent.title}</h1>
      <p className={styles.subtitle}>{pricingSection.intro}</p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>{selfHostedTier.name}</h2>
          <div className={styles.price}>{selfHostedTier.price}</div>
          <ul className={styles.features}>
            {selfHostedTier.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <a
            href={selfHostedTier.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryButton}
          >
            {selfHostedTier.cta.label}
          </a>
        </div>

        <div className={`${styles.card} ${styles.highlighted}`}>
          <h2>{cloudTier.name}</h2>
          <div className={styles.price}>{cloudTier.price}</div>
          <ul className={styles.features}>
            {cloudTier.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          <div className={styles.ctaWrapper}>
            <AuthButton />
          </div>
        </div>
      </div>
    </div>
  );
}
