"use client";

import Link from "next/link";
import { useState } from "react";
import type { AppLocale } from "@/lib/i18n/config";
import styles from "./LocaleSwitcher.module.css";

interface LocaleOption {
  readonly locale: AppLocale;
  readonly languageTag: string;
  readonly nativeLabel: string;
  readonly englishLabel: string;
  readonly href: string;
}

interface LocaleSearchListProps {
  readonly currentLocale: AppLocale;
  readonly listLabel: string;
  readonly searchLabel: string;
  readonly noResults: string;
  readonly options: ReadonlyArray<LocaleOption>;
}

function normalizeSearch(text: string): string {
  return text.trim().normalize("NFC").toLowerCase();
}

export function LocaleSearchList({
  currentLocale,
  listLabel,
  searchLabel,
  noResults,
  options,
}: LocaleSearchListProps): React.JSX.Element {
  const [query, setQuery] = useState("");
  const search = normalizeSearch(query);
  const results = options.filter(({ nativeLabel, englishLabel, languageTag }) =>
    [nativeLabel, englishLabel, languageTag].some((label) => normalizeSearch(label).includes(search))
  );

  return (
    <div className={`${styles.menu} ${styles.searchMenu}`}>
      <input
        aria-label={searchLabel}
        dir="auto"
        placeholder={searchLabel}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />
      {results.length === 0 ? (
        <p className={styles.noResults} role="status">{noResults}</p>
      ) : (
        <ul className={styles.searchResults} aria-label={listLabel}>
          {results.map((option) => {
            const label = (
              <>
                <bdi lang={option.languageTag}>{option.nativeLabel}</bdi>
                {option.nativeLabel !== option.englishLabel ? (
                  <bdi className={styles.englishLabel} lang="en">{option.englishLabel}</bdi>
                ) : null}
              </>
            );

            return (
              <li key={option.locale}>
                {option.locale === currentLocale ? (
                  <span className={styles.currentOption} aria-current="true">{label}</span>
                ) : (
                  <Link href={option.href} hrefLang={option.languageTag} prefetch={false}>{label}</Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
