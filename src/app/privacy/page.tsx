import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Expense Budget Tracker.",
  alternates: {
    types: { "text/markdown": "/privacy.md" },
  },
};

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <div className={styles.content}>
        <p>
          <strong>Last updated:</strong> March 2026
        </p>

        <h2>What We Collect</h2>
        <p>
          When you use the cloud version, we store the financial data you enter
          (transactions, budgets, account names) and your email address for
          authentication. Self-hosted instances do not send any data to us.
        </p>

        <h2>How We Use Your Data</h2>
        <p>
          Your financial data is used solely to provide the service. We do not
          sell, share, or use your data for advertising. Each workspace is
          isolated via Postgres row-level security.
        </p>

        <h2>Data Storage</h2>
        <p>
          Cloud data is stored in AWS RDS (Postgres) in the eu-central-1 region
          with daily automated backups. Data is encrypted at rest and in
          transit.
        </p>

        <h2>Cookies</h2>
        <p>
          We use a <code>session</code> cookie for authentication (HttpOnly,
          Secure, SameSite=Lax). No tracking cookies or third-party analytics.
        </p>

        <h2>Data Deletion</h2>
        <p>
          You can delete your account and all associated data at any time from
          Settings in the app. For self-hosted instances, you control the
          database directly.
        </p>

        <h2>Open Source</h2>
        <p>
          The entire codebase is open source. You can audit exactly what the
          application does with your data.
        </p>
      </div>
    </div>
  );
}
