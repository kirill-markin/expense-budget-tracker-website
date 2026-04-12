import Link from "next/link";
import { getAvailableBlogIndexLocales } from "@/lib/blog";
import { getAvailableDocIndexLocales, getAvailableDocLocales } from "@/lib/docs";
import type { AppLocale } from "@/lib/i18n/config";
import { getSiteMessages } from "@/lib/i18n/messages";
import { getLocalizedPath } from "@/lib/i18n/routing";
import { LocaleSwitcher } from "./LocaleSwitcher";
import styles from "./Footer.module.css";

interface FooterProps {
  readonly availableLocales: ReadonlyArray<AppLocale>;
  readonly locale: AppLocale;
  readonly routePath: string;
}

export const Footer = ({
  availableLocales,
  locale,
  routePath,
}: FooterProps): React.JSX.Element => {
  const year = new Date().getFullYear();
  const messages = getSiteMessages(locale);
  const hasDocsIndex = getAvailableDocIndexLocales().includes(locale);
  const hasBlogIndex = getAvailableBlogIndexLocales().includes(locale);
  const hasSelfHostingDoc = getAvailableDocLocales("self-hosting").includes(locale);

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
            {hasDocsIndex ? (
              <Link href={getLocalizedPath(locale, "/docs/")}>
                {messages.footer.documentation}
              </Link>
            ) : null}
            {hasBlogIndex ? (
              <Link href={getLocalizedPath(locale, "/blog/")}>
                {messages.header.blog}
              </Link>
            ) : null}
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
            {hasSelfHostingDoc ? (
              <Link href={getLocalizedPath(locale, "/docs/self-hosting/")}>
                {messages.footer.selfHostingGuide}
              </Link>
            ) : null}
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
          <div className={styles.bottomMeta}>
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
          <div className={styles.localePicker}>
            <LocaleSwitcher
              locale={locale}
              routePath={routePath}
              availableLocales={availableLocales}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
