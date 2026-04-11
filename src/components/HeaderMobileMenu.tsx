"use client";

import { useState } from "react";
import Link from "next/link";
import type { AppLocale } from "@/lib/i18n/config";
import { getSiteMessages } from "@/lib/i18n/messages";
import { AuthButton } from "./AuthButton";
import { getHeaderLinks } from "./headerLinks";
import styles from "./Header.module.css";

interface HeaderMobileMenuProps {
  readonly locale: AppLocale;
}

export const HeaderMobileMenu = (
  props: HeaderMobileMenuProps
): React.JSX.Element => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const headerLinks = getHeaderLinks(props.locale);
  const messages = getSiteMessages(props.locale);

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={toggleMobileMenu}
        aria-expanded={mobileMenuOpen}
        aria-label={messages.header.toggleMenu}
      >
        {mobileMenuOpen ? "\u2715" : "\u2630"}
      </button>

      {mobileMenuOpen && (
        <nav className={styles.mobileNav}>
          {headerLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={closeMobileMenu}>
              {link.label}
            </Link>
          ))}
          <div className={styles.mobileAuth}>
            <AuthButton locale={props.locale} />
          </div>
        </nav>
      )}
    </>
  );
};
