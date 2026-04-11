import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { listDocs } from "@/lib/docs";
import { getSiteMessages } from "@/lib/i18n/messages";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "@/app/(default)/docs/page.module.css";

const PAGE_COPY = {
  title: "Documentación",
  description:
    "Primeros pasos, guía de autoalojamiento, referencia de API y resumen de la arquitectura.",
};

export const metadata: Metadata = createPageMetadata({
  title: PAGE_COPY.title,
  description: PAGE_COPY.description,
  locale: "es",
  routePath: "/docs/",
  markdownRoutePath: "/docs.md",
  openGraphType: "website",
  availableLocales: ["en", "es"],
});

export default function LocalizedDocsPage(): React.JSX.Element {
  const docs = listDocs("es");
  const messages = getSiteMessages("es");

  return (
    <div className={styles.container}>
      <Breadcrumbs
        locale="es"
        items={[{ label: messages.breadcrumbs.docs, href: "/es/docs/" }]}
      />
      <h1 className={styles.title}>{PAGE_COPY.title}</h1>
      <div className={styles.grid}>
        {docs.map((doc) => (
          <Link
            key={doc.slug}
            href={`/es/docs/${doc.slug}/`}
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
