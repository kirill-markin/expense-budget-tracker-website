/**
 * Auth utilities for the marketing site.
 *
 * The marketing site checks for the `logged_in` cookie — a non-HttpOnly
 * UI indicator set by auth.expense-budget-tracker.com on the shared
 * .expense-budget-tracker.com domain. It carries no security value;
 * the real JWT verification happens on app.expense-budget-tracker.com.
 */

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://app.expense-budget-tracker.com";
const AUTH_URL =
  process.env.NEXT_PUBLIC_AUTH_URL ??
  "https://auth.expense-budget-tracker.com";

export const getLoginUrl = (redirectPath: string): string => {
  const redirectUri = `${APP_URL}${redirectPath}`;
  return `${AUTH_URL}/login?redirect_uri=${encodeURIComponent(redirectUri)}`;
};

export const getSignupUrl = (): string => {
  const redirectUri = APP_URL;
  return `${AUTH_URL}/login?redirect_uri=${encodeURIComponent(redirectUri)}`;
};

export const getAppUrl = (): string => APP_URL;

export const LOGGED_IN_COOKIE_NAME = "logged_in";
