import type { Metadata } from "next";
import { readPageContent } from "@/lib/content/readPageContent";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "./page.module.css";

const pageContent = readPageContent("features");

function getFeatureSection() {
  const section = pageContent.sections[0];

  if (section?.type !== "feature_list") {
    throw new Error("Invalid features page content structure");
  }

  return section;
}

const featureSection = getFeatureSection();

export const metadata: Metadata = createPageMetadata({
  title: pageContent.title,
  description: pageContent.description,
  pathname: "/features/",
  markdownPath: "/features.md",
  openGraphType: "website",
});

export default function FeaturesPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{pageContent.title}</h1>
      <p className={styles.subtitle}>{featureSection.intro}</p>
      <div className={styles.grid}>
        {featureSection.items.map((item) => (
          <div key={item.title} className={styles.card}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
