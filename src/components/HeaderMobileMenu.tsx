"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthButton } from "./AuthButton";
import { HEADER_LINKS } from "./headerLinks";
import styles from "./Header.module.css";

export const HeaderMobileMenu: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

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
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? "\u2715" : "\u2630"}
      </button>

      {mobileMenuOpen && (
        <nav className={styles.mobileNav}>
          {HEADER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={closeMobileMenu}>
              {link.label}
            </Link>
          ))}
          <div className={styles.mobileAuth}>
            <AuthButton />
          </div>
        </nav>
      )}
    </>
  );
};
