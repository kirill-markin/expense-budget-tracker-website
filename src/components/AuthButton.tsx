"use client";

import { useSyncExternalStore } from "react";
import type { AppLocale } from "@/lib/i18n/config";
import { getSiteMessages } from "@/lib/i18n/messages";
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

interface AuthButtonProps {
  readonly locale: AppLocale;
}

export const AuthButton = ({ locale }: AuthButtonProps): React.JSX.Element => {
  const mounted = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot);
  const messages = getSiteMessages(locale);

  if (!mounted) {
    return (
      <div className={styles.buttonGroup}>
        <a href={getLoginUrl("/")} className={styles.loginButton}>
          {messages.auth.login}
        </a>
        <a href={getSignupUrl()} className={styles.signupButton}>
          {messages.auth.signup}
        </a>
      </div>
    );
  }

  const loggedIn = hasLoggedInCookie();

  if (loggedIn) {
    return (
      <a href={getAppUrl()} className={styles.signupButton}>
        {messages.auth.openApp}
      </a>
    );
  }

  return (
    <div className={styles.buttonGroup}>
      <a href={getLoginUrl("/")} className={styles.loginButton}>
        {messages.auth.login}
      </a>
      <a href={getSignupUrl()} className={styles.signupButton}>
        {messages.auth.signup}
      </a>
    </div>
  );
};
