import Link from "next/link";
import styles from "./Breadcrumbs.module.css";

const SITE_URL = "https://expense-budget-tracker.com";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: ReadonlyArray<BreadcrumbItem>;
}

export function Breadcrumbs({ items }: BreadcrumbsProps): React.JSX.Element {
  const allItems: ReadonlyArray<BreadcrumbItem> = [
    { label: "Home", href: "/" },
    ...items,
  ];

  const schemaItems = allItems.map((item, index) => ({
    "@type": "ListItem" as const,
    position: index + 1,
    name: item.label,
    item: `${SITE_URL}${item.href}`,
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
