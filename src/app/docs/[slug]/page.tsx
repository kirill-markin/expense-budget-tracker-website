import type { Metadata } from "next";
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DOCS } from "@/data/docs";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "./page.module.css";

const CONTENT_DIR = join(process.cwd(), "src/content/docs");

interface DocFrontmatter {
  title: string;
  description: string;
}

const readDoc = async (
  slug: string
): Promise<{ frontmatter: DocFrontmatter; contentHtml: string } | null> => {
  const filePath = join(CONTENT_DIR, `${slug}.md`);
  if (!existsSync(filePath)) return null;

  const raw = readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const result = await remark().use(html).process(content);
  return {
    frontmatter: data as DocFrontmatter,
    contentHtml: result.toString(),
  };
};

export const generateStaticParams = (): Array<{ slug: string }> =>
  DOCS.map((doc) => ({ slug: doc.slug }));

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = "https://expense-budget-tracker.com";

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const doc = await readDoc(slug);
  if (!doc) return { title: "Not Found" };
  return createPageMetadata({
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
    pathname: `/docs/${slug}/`,
    markdownPath: `/docs/${slug}.md`,
    openGraphType: "website",
  });
};

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await readDoc(slug);

  if (!doc) {
    return (
      <div className={styles.container}>
        <h1>Coming Soon</h1>
        <p>This documentation page is being written.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Breadcrumbs
        items={[
          { label: "Docs", href: "/docs/" },
          { label: doc.frontmatter.title, href: `/docs/${slug}/` },
        ]}
      />
      <h1 className={styles.title}>{doc.frontmatter.title}</h1>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: doc.contentHtml }}
      />
    </div>
  );
}
