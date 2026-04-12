import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFrame } from "@/components/SiteFrame";
import { getAvailableDocIndexLocales, listDocs } from "@/lib/docs";
import { getSiteMessages } from "@/lib/i18n/messages";
import { getLocalizedPath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "./page.module.css";

const LOCALE = "en";
const PAGE_COPY = getSiteMessages(LOCALE).docs;

export const metadata: Metadata = createPageMetadata({
  title: PAGE_COPY.title,
  description: PAGE_COPY.description,
  locale: LOCALE,
  routePath: "/docs/",
  openGraphType: "website",
  availableLocales: getAvailableDocIndexLocales(),
});

export default function DocsPage(): React.JSX.Element {
  const docs = listDocs(LOCALE);
  const messages = getSiteMessages(LOCALE);

  return (
    <SiteFrame
      locale={LOCALE}
      routePath="/docs/"
      availableLocales={getAvailableDocIndexLocales()}
    >
      <div className={styles.container}>
        <Breadcrumbs
          locale={LOCALE}
          items={[
            {
              label: messages.breadcrumbs.docs,
              href: getLocalizedPath(LOCALE, "/docs/"),
            },
          ]}
        />
        <h1 className={styles.title}>{PAGE_COPY.title}</h1>
        <div className={styles.grid}>
          {docs.map((doc) => (
            <Link
              key={doc.slug}
              href={getLocalizedPath(LOCALE, `/docs/${doc.slug}/`)}
              className={styles.card}
            >
              <h2>{doc.title}</h2>
              <p>{doc.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </SiteFrame>
  );
}
