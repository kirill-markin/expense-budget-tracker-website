/**
 * Auth utilities for the marketing site.
 *
 * The marketing site never verifies JWTs — it only checks for the presence
 * of the `session` cookie (set by auth.expense-budget-tracker.com on the
 * shared .expense-budget-tracker.com domain). The real auth check happens
 * when the user navigates to app.expense-budget-tracker.com.
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

export const SESSION_COOKIE_NAME = "session";
