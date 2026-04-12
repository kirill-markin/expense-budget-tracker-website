import Link from "next/link";
import {
  getLocaleShortLabel,
  type AppLocale,
} from "@/lib/i18n/config";
import { getSiteMessages } from "@/lib/i18n/messages";
import { getLocalizedPath } from "@/lib/i18n/routing";
import styles from "./LocaleSwitcher.module.css";

interface LocaleSwitcherProps {
  readonly availableLocales: ReadonlyArray<AppLocale>;
  readonly locale: AppLocale;
  readonly routePath: string;
}

export function LocaleSwitcher(
  props: LocaleSwitcherProps
): React.JSX.Element {
  const messages = getSiteMessages(props.locale);

  return (
    <details className={styles.switcher}>
      <summary
        aria-label={messages.footer.localeSwitcherAriaLabel}
        className={styles.trigger}
      >
        <span className={styles.current}>
          {getLocaleShortLabel(props.locale)}
        </span>
        <span className={styles.chevron} aria-hidden="true">
          ▾
        </span>
      </summary>
      <div className={styles.menuWrapper}>
        <ul
          className={styles.menu}
          aria-label={messages.footer.localeSwitcherAriaLabel}
        >
          {props.availableLocales.map((availableLocale) => (
            <li key={availableLocale}>
              {availableLocale === props.locale ? (
                <span className={styles.currentOption} aria-current="true">
                  {getLocaleShortLabel(availableLocale)}
                </span>
              ) : (
                <Link href={getLocalizedPath(availableLocale, props.routePath)}>
                  {getLocaleShortLabel(availableLocale)}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </details>
  );
}
