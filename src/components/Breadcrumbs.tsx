import Link from "next/link";
import type { AppLocale } from "@/lib/i18n/config";
import { getSiteMessages } from "@/lib/i18n/messages";
import { getAbsoluteUrl, getLocalizedPath } from "@/lib/i18n/routing";
import styles from "./Breadcrumbs.module.css";

interface BreadcrumbItem {
  readonly label: string;
  readonly href: string;
}

interface BreadcrumbsProps {
  readonly locale: AppLocale;
  readonly items: ReadonlyArray<BreadcrumbItem>;
}

export function Breadcrumbs({ locale, items }: BreadcrumbsProps): React.JSX.Element {
  const messages = getSiteMessages(locale);
  const allItems: ReadonlyArray<BreadcrumbItem> = [
    { label: messages.breadcrumbs.home, href: getLocalizedPath(locale, "/") },
    ...items,
  ];

  const schemaItems = allItems.map((item, index) => ({
    "@type": "ListItem" as const,
    position: index + 1,
    name: item.label,
    item: getAbsoluteUrl(item.href),
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: schemaItems,
  };

  return (
    <nav aria-label="Breadcrumb" className={styles.nav}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ol className={styles.list}>
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={item.href} className={styles.item}>
              {index > 0 && (
                <span className={styles.separator} aria-hidden="true">
                  /
                </span>
              )}
              {isLast ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
