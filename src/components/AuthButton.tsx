"use client";

import { useEffect, useState } from "react";
import {
  SESSION_COOKIE_NAME,
  getAppUrl,
  getSignupUrl,
  getLoginUrl,
} from "@/lib/auth";
import styles from "./AuthButton.module.css";

const hasSessionCookie = (): boolean =>
  document.cookie.split(";").some((c) => c.trim().startsWith(`${SESSION_COOKIE_NAME}=`));

export const AuthButton: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setLoggedIn(hasSessionCookie());
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={styles.buttonGroup}>
        <a href={getLoginUrl("/")} className={styles.loginButton}>
          Log In
        </a>
        <a href={getSignupUrl()} className={styles.signupButton}>
          Sign Up Free
        </a>
      </div>
    );
  }

  if (loggedIn) {
    return (
      <a href={getAppUrl()} className={styles.signupButton}>
        Open App
      </a>
    );
  }

  return (
    <div className={styles.buttonGroup}>
      <a href={getLoginUrl("/")} className={styles.loginButton}>
        Log In
      </a>
      <a href={getSignupUrl()} className={styles.signupButton}>
        Sign Up Free
      </a>
    </div>
  );
};
