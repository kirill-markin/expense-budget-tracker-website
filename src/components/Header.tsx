"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthButton } from "./AuthButton";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = (): void => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Expense Budget Tracker
        </Link>

        <nav className={styles.desktopNav}>
          <Link href="/features/">Features</Link>
          <Link href="/pricing/">Pricing</Link>
          <Link href="/docs/">Docs</Link>
          <Link href="/blog/">Blog</Link>
        </nav>

        <div className={styles.desktopAuth}>
          <AuthButton />
        </div>

        <button
          className={styles.mobileToggle}
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "\u2715" : "\u2630"}
        </button>
      </div>

      {mobileMenuOpen && (
        <nav className={styles.mobileNav}>
          <Link href="/features/" onClick={closeMobileMenu}>
            Features
          </Link>
          <Link href="/pricing/" onClick={closeMobileMenu}>
            Pricing
          </Link>
          <Link href="/docs/" onClick={closeMobileMenu}>
            Docs
          </Link>
          <Link href="/blog/" onClick={closeMobileMenu}>
            Blog
          </Link>
          <div className={styles.mobileAuth}>
            <AuthButton />
          </div>
        </nav>
      )}
    </header>
  );
};
