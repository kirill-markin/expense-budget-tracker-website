import Link from "next/link";
import type { AppLocale } from "@/lib/i18n/config";
import { getLocalizedPath } from "@/lib/i18n/routing";
import { AuthButton } from "./AuthButton";
import { HeaderMobileMenu } from "./HeaderMobileMenu";
import { getHeaderLinks } from "./headerLinks";
import styles from "./Header.module.css";

interface HeaderProps {
  readonly locale: AppLocale;
}

export const Header = ({ locale }: HeaderProps): React.JSX.Element => {
  const headerLinks = getHeaderLinks(locale);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href={getLocalizedPath(locale, "/")} className={styles.logo}>
          Expense Budget Tracker
        </Link>

        <nav className={styles.desktopNav}>
          {headerLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.desktopAuth}>
          <AuthButton locale={locale} />
        </div>

        <HeaderMobileMenu locale={locale} />
      </div>
    </header>
  );
};
