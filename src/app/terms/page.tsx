import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Expense Budget Tracker.",
  alternates: {
    types: { "text/markdown": "/terms.md" },
  },
};

export default function TermsPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Terms of Service</h1>
      <div className={styles.content}>
        <p>
          <strong>Last updated:</strong> March 2026
        </p>

        <h2>Service</h2>
        <p>
          Expense Budget Tracker is an open-source personal finance tool. The
          cloud version is provided as-is during the beta period at no cost.
        </p>

        <h2>Your Data</h2>
        <p>
          You own your data. We do not claim any rights to the financial
          information you enter. You can export or delete your data at any time.
        </p>

        <h2>Acceptable Use</h2>
        <p>
          Do not use the service for illegal activities, attempt to access
          other users&apos; data, or abuse the API rate limits.
        </p>

        <h2>Availability</h2>
        <p>
          The cloud service is provided on a best-effort basis. For guaranteed
          availability, self-host the application on your own infrastructure.
        </p>

        <h2>Open Source</h2>
        <p>
          The source code is available under the MIT license. Self-hosted
          deployments are not subject to these terms.
        </p>
      </div>
    </div>
  );
}
