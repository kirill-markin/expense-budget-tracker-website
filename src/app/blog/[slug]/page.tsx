import type { Metadata } from "next";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
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

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const post = await readPost(slug);
  if (!post) return { title: "Not Found" };
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
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

  return (
    <article className={styles.container}>
      <time className={styles.date}>{post.frontmatter.date}</time>
      <h1 className={styles.title}>{post.frontmatter.title}</h1>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
