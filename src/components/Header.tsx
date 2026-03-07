import Link from "next/link";
import { AuthButton } from "./AuthButton";
import { HeaderMobileMenu } from "./HeaderMobileMenu";
import { HEADER_LINKS } from "./headerLinks";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Expense Budget Tracker
        </Link>

        <nav className={styles.desktopNav}>
          {HEADER_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.desktopAuth}>
          <AuthButton />
        </div>

        <HeaderMobileMenu />
      </div>
    </header>
  );
};
