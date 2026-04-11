import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { listDocs } from "@/lib/docs";
import { getSiteMessages } from "@/lib/i18n/messages";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "./page.module.css";

const PAGE_COPY = {
  title: "Documentation",
  description:
    "Getting started, self-hosting guide, API reference, and architecture overview.",
};

export const metadata: Metadata = createPageMetadata({
  title: PAGE_COPY.title,
  description: PAGE_COPY.description,
  locale: "en",
  routePath: "/docs/",
  openGraphType: "website",
  availableLocales: ["en", "es"],
});

export default function DocsPage(): React.JSX.Element {
  const docs = listDocs("en");
  const messages = getSiteMessages("en");

  return (
    <div className={styles.container}>
      <Breadcrumbs
        locale="en"
        items={[{ label: messages.breadcrumbs.docs, href: "/docs/" }]}
      />
      <h1 className={styles.title}>{PAGE_COPY.title}</h1>
      <div className={styles.grid}>
        {docs.map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}/`}
            className={styles.card}
          >
            <h2>{doc.title}</h2>
            <p>{doc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
