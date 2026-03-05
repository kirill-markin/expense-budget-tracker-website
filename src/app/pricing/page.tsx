import type { Metadata } from "next";
import { AuthButton } from "@/components/AuthButton";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Free self-hosted deployment or managed cloud hosting. Open source, no feature gating.",
};

export default function PricingPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pricing</h1>
      <p className={styles.subtitle}>
        All features are available in every plan. No feature gating.
      </p>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2>Self-Hosted</h2>
          <div className={styles.price}>Free</div>
          <ul className={styles.features}>
            <li>Full source code on GitHub</li>
            <li>Docker Compose + Postgres</li>
            <li>All features included</li>
            <li>Your server, your data</li>
            <li>Community support</li>
          </ul>
          <a
            href="https://github.com/kirill-markin/expense-budget-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryButton}
          >
            View on GitHub
          </a>
        </div>

        <div className={`${styles.card} ${styles.highlighted}`}>
          <h2>Cloud</h2>
          <div className={styles.price}>Free during beta</div>
          <ul className={styles.features}>
            <li>Managed hosting on AWS</li>
            <li>Automatic backups</li>
            <li>All features included</li>
            <li>Email OTP authentication</li>
            <li>Daily FX rate updates</li>
          </ul>
          <div className={styles.ctaWrapper}>
            <AuthButton />
          </div>
        </div>
      </div>
    </div>
  );
}
