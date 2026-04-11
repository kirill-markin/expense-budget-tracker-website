import Link from "next/link";
import type { AppLocale } from "@/lib/i18n/config";
import { getSiteMessages } from "@/lib/i18n/messages";
import { getLocalizedPath } from "@/lib/i18n/routing";
import styles from "./Footer.module.css";

interface FooterProps {
  readonly locale: AppLocale;
}

export const Footer = ({ locale }: FooterProps): React.JSX.Element => {
  const year = new Date().getFullYear();
  const messages = getSiteMessages(locale);

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.columns}>
          <div className={styles.column}>
            <h3>{messages.footer.productTitle}</h3>
            <Link href={getLocalizedPath(locale, "/features/")}>
              {messages.header.features}
            </Link>
            <Link href={getLocalizedPath(locale, "/pricing/")}>
              {messages.header.pricing}
            </Link>
            <Link href={getLocalizedPath(locale, "/docs/")}>
              {messages.footer.documentation}
            </Link>
            <Link href={getLocalizedPath(locale, "/blog/")}>
              {messages.header.blog}
            </Link>
          </div>
          <div className={styles.column}>
            <h3>{messages.footer.openSourceTitle}</h3>
            <a
              href="https://github.com/kirill-markin/expense-budget-tracker"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <Link href={getLocalizedPath(locale, "/docs/self-hosting/")}>
              {messages.footer.selfHostingGuide}
            </Link>
          </div>
          <div className={styles.column}>
            <h3>{messages.footer.legalTitle}</h3>
            <Link href={getLocalizedPath(locale, "/privacy/")}>
              {messages.footer.privacyPolicy}
            </Link>
            <Link href={getLocalizedPath(locale, "/terms/")}>
              {messages.footer.termsOfService}
            </Link>
          </div>
        </div>
        <div className={styles.bottom}>
          <span className={styles.copyright}>{year} Expense Budget Tracker</span>
          <div className={styles.attribution}>
            <span className={styles.attributionLine}>
              {messages.footer.builtBy} ·{" "}
              <a
                href="https://kirill-markin.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                kirill-markin.com
              </a>
            </span>
            <span className={styles.attributionLine}>
              {messages.footer.operatedBy}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
