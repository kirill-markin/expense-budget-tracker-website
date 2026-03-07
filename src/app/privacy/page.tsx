import type { Metadata } from "next";
import { readPageContent } from "@/lib/content/readPageContent";
import { renderMarkdownToHtml } from "@/lib/content/renderMarkdownToHtml";
import styles from "./page.module.css";

const pageContent = readPageContent("privacy");

function getLegalSection() {
  const section = pageContent.sections[0];

  if (section?.type !== "legal_page") {
    throw new Error("Invalid privacy page content structure");
  }

  return section;
}

const legalSection = getLegalSection();

export const metadata: Metadata = {
  title: pageContent.title,
  description: pageContent.description,
  alternates: {
    types: { "text/markdown": "/privacy.md" },
  },
};

export default async function PrivacyPage() {
  const contentHtml = await renderMarkdownToHtml(pageContent.body);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{pageContent.title}</h1>
      <div className={styles.content}>
        <p>
          <strong>Last updated:</strong> {legalSection.lastUpdated}
        </p>
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>
    </div>
  );
}
