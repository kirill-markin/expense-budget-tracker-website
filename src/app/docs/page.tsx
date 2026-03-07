import type { Metadata } from "next";
import Link from "next/link";
import { DOCS } from "@/data/docs";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "./page.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Documentation",
  description:
    "Getting started, self-hosting guide, API reference, and architecture overview.",
  pathname: "/docs/",
  markdownPath: "/docs.md",
  openGraphType: "website",
});

export default function DocsPage() {
  return (
    <div className={styles.container}>
      <Breadcrumbs items={[{ label: "Docs", href: "/docs/" }]} />
      <h1 className={styles.title}>Documentation</h1>
      <div className={styles.grid}>
        {DOCS.map((doc) => (
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
