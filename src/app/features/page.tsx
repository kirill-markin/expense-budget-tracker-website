import type { Metadata } from "next";
import { FEATURES } from "@/data/features";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Multi-currency tracking, budget planning, dashboards, API access, self-hosting, and workspace isolation.",
  alternates: {
    types: { "text/markdown": "/features.md" },
  },
};

export default function FeaturesPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Features</h1>
      <p className={styles.subtitle}>
        Everything you need to track personal finances, without giving up
        control of your data.
      </p>
      <div className={styles.grid}>
        {FEATURES.map((feature) => (
          <div key={feature.title} className={styles.card}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
