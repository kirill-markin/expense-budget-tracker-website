import { AuthButton } from "@/components/AuthButton";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroInner}>
        <h1 className={styles.title}>
          Track expenses.
          <br />
          Plan budgets.
          <br />
          Own your data.
        </h1>
        <p className={styles.subtitle}>
          Open-source personal finance tracker with multi-currency support,
          budget planning, and financial dashboards. Self-host on Postgres or
          use the cloud version.
        </p>
        <div className={styles.cta}>
          <AuthButton />
        </div>
        <p className={styles.hint}>
          Free and open source.{" "}
          <a
            href="https://github.com/kirill-markin/expense-budget-tracker"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </div>

      <section className={styles.features}>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3>Multi-Currency</h3>
            <p>
              Track accounts in any currency. Automatic FX conversion from ECB,
              CBR, and NBS rates.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>Budget Planning</h3>
            <p>
              Monthly budget grid with income and spending categories. Compare
              planned vs actual.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>Dashboards</h3>
            <p>
              Visual breakdowns of spending, balances over time, and FX impact
              on your portfolio.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>Self-Hosted</h3>
            <p>
              Docker Compose with Postgres. Your data stays on your server. No
              third-party dependencies.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>API Access</h3>
            <p>
              SQL API with bearer token auth. Connect LLM agents, scripts, or
              dashboards directly.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3>Workspace Isolation</h3>
            <p>
              Row-level security in Postgres. Each user gets an isolated
              workspace. Share via invites.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
