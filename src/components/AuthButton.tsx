"use client";

import { useSyncExternalStore } from "react";
import {
  LOGGED_IN_COOKIE_NAME,
  getAppUrl,
  getSignupUrl,
  getLoginUrl,
} from "@/lib/auth";
import styles from "./AuthButton.module.css";

const hasLoggedInCookie = (): boolean =>
  document.cookie.split(";").some((c) => c.trim().startsWith(`${LOGGED_IN_COOKIE_NAME}=`));

const subscribe = (): (() => void) => () => undefined;
const getClientSnapshot = (): boolean => true;
const getServerSnapshot = (): boolean => false;

export const AuthButton: React.FC = () => {
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);

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

  const loggedIn = hasLoggedInCookie();

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
