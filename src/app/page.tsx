import { AuthButton } from "@/components/AuthButton";
import { CopyCodeField } from "@/components/CopyCodeField";
import { readPageContent } from "@/lib/content/readPageContent";
import Image from "next/image";
import styles from "./page.module.css";

const pageContent = readPageContent("home");

function getHeroSection() {
  const section = pageContent.sections[0];

  if (section?.type !== "hero") {
    throw new Error("Invalid home page content structure");
  }

  return section;
}

function getFeatureSection() {
  const section = pageContent.sections[1];

  if (section?.type !== "feature_list") {
    throw new Error("Invalid home page content structure");
  }

  return section;
}

const heroSection = getHeroSection();
const featureSection = getFeatureSection();

export default function HomePage() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <h1 className={styles.title}>
          {heroSection.titleLines.map((line, index) => (
            <span key={line}>
              {line}
              {index < heroSection.titleLines.length - 1 ? <br /> : null}
            </span>
          ))}
        </h1>
        <p className={styles.subtitle}>{heroSection.subtitle}</p>
        <div className={styles.cta}>
          <AuthButton />
        </div>
        <div className={styles.hint}>
          <CopyCodeField
            value={`${heroSection.hintText}\n${heroSection.hintLink.href}`}
          />
        </div>
      </div>

      <section className={styles.showcase} aria-labelledby="product-showcase-title">
        <div className={styles.showcaseHeader}>
          <p className={styles.showcaseEyebrow}>Real interface</p>
          <h2 id="product-showcase-title" className={styles.showcaseTitle}>
            See the budget workspace before you read the feature list
          </h2>
        </div>
        <div className={styles.showcaseFrame}>
          <Image
            src="/home/budget-screenshot.jpg"
            alt="Expense Budget Tracker interface showing AI chat, budget categories, actual expenses, current month, and future plans."
            width={3624}
            height={2030}
            priority
            className={styles.showcaseImage}
          />
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featureGrid}>
          {featureSection.items.map((item) => (
            <div key={item.title} className={styles.featureCard}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
