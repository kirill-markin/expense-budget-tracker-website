import type { Metadata } from "next";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import styles from "./page.module.css";

const CONTENT_DIR = join(process.cwd(), "src/content/blog");

interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
}

const readPost = async (
  slug: string
): Promise<{ frontmatter: BlogFrontmatter; contentHtml: string } | null> => {
  const filePath = join(CONTENT_DIR, `${slug}.md`);
  if (!existsSync(filePath)) return null;

  const raw = readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const result = await remark().use(html).process(content);
  return {
    frontmatter: data as BlogFrontmatter,
    contentHtml: result.toString(),
  };
};

export const generateStaticParams = (): Array<{ slug: string }> => {
  if (!existsSync(CONTENT_DIR)) return [];
  return readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => ({ slug: f.replace(/\.md$/, "") }));
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = "https://expense-budget-tracker.com";

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const post = await readPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      type: "article",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url: `${SITE_URL}/blog/${slug}/`,
      publishedTime: post.frontmatter.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title,
      description: post.frontmatter.description,
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}/`,
      types: { "text/markdown": `/blog/${slug}.md` },
    },
  };
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await readPost(slug);

  if (!post) {
    return (
      <div className={styles.container}>
        <h1>Not Found</h1>
        <p>This blog post does not exist.</p>
      </div>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    url: `${SITE_URL}/blog/${slug}/`,
    publisher: {
      "@type": "Organization",
      name: "Expense Budget Tracker",
      url: `${SITE_URL}/`,
    },
  };

  return (
    <article className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog/" },
          { label: post.frontmatter.title, href: `/blog/${slug}/` },
        ]}
      />
      <time className={styles.date}>{post.frontmatter.date}</time>
      <h1 className={styles.title}>{post.frontmatter.title}</h1>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
