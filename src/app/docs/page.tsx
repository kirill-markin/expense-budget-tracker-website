import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Getting started, self-hosting guide, API reference, and architecture overview.",
};

const DOCS = [
  {
    slug: "getting-started",
    title: "Getting Started",
    description:
      "Sign up for the cloud version or set up your own instance in minutes.",
  },
  {
    slug: "self-hosting",
    title: "Self-Hosting Guide",
    description:
      "Run Expense Budget Tracker on your own server with Docker Compose and Postgres.",
  },
  {
    slug: "api",
    title: "API Reference",
    description:
      "SQL API with bearer token auth. Query your data from scripts, LLM agents, or dashboards.",
  },
  {
    slug: "architecture",
    title: "Architecture",
    description:
      "System overview, data model, multi-currency design, and auth model.",
  },
] as const;

export default function DocsPage() {
  return (
    <div className={styles.container}>
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
