import Link from "next/link";
import styles from "./Footer.module.css";

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.column}>
            <h3>Product</h3>
            <Link href="/features/">Features</Link>
            <Link href="/pricing/">Pricing</Link>
            <Link href="/docs/">Documentation</Link>
            <Link href="/blog/">Blog</Link>
          </div>
          <div className={styles.column}>
            <h3>Open Source</h3>
            <a
              href="https://github.com/kirill-markin/expense-budget-tracker"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <Link href="/docs/self-hosting/">Self-Hosting Guide</Link>
          </div>
          <div className={styles.column}>
            <h3>Legal</h3>
            <Link href="/privacy/">Privacy Policy</Link>
            <Link href="/terms/">Terms of Service</Link>
          </div>
        </div>
        <div className={styles.bottom}>
          <span className={styles.copyright}>
            {year} Expense Budget Tracker
          </span>
        </div>
      </div>
    </footer>
  );
};
