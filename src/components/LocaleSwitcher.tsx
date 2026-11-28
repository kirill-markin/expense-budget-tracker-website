import Link from "next/link";
import {
  getLanguageTag,
  getLocaleEnglishLabel,
  getLocaleLabel,
  getLocaleShortLabel,
  type AppLocale,
} from "@/lib/i18n/config";
import { getSiteMessages } from "@/lib/i18n/messages";
import { getLocalizedPath } from "@/lib/i18n/routing";
import { LocaleSearchList } from "./LocaleSearchList";
import styles from "./LocaleSwitcher.module.css";

const COMPACT_LOCALE_LIMIT = 8;

interface LocaleSwitcherProps {
  readonly availableLocales: ReadonlyArray<AppLocale>;
  readonly locale: AppLocale;
  readonly routePath: string;
}

export function LocaleSwitcher(
  props: LocaleSwitcherProps
): React.JSX.Element {
  const messages = getSiteMessages(props.locale).footer;

  return (
    <details className={styles.switcher}>
      <summary
        aria-label={messages.localeSwitcherAriaLabel}
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
        {props.availableLocales.length > COMPACT_LOCALE_LIMIT ? (
          <LocaleSearchList
            currentLocale={props.locale}
            listLabel={messages.localeSwitcherAriaLabel}
            searchLabel={messages.localeSearchLabel}
            noResults={messages.localeSearchEmpty}
            options={props.availableLocales.map((locale) => ({
              locale,
              languageTag: getLanguageTag(locale),
              nativeLabel: getLocaleLabel(locale),
              englishLabel: getLocaleEnglishLabel(locale),
              href: getLocalizedPath(locale, props.routePath),
            }))}
          />
        ) : (
          <ul
            className={styles.menu}
            aria-label={messages.localeSwitcherAriaLabel}
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
        )}
      </div>
    </details>
  );
}
