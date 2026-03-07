import { AuthButton } from "@/components/AuthButton";
import { readPageContent } from "@/lib/content/readPageContent";
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
        <p className={styles.hint}>
          {heroSection.hintText}{" "}
          <a
            href={heroSection.hintLink.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {heroSection.hintLink.label}
          </a>
        </p>
      </div>

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
