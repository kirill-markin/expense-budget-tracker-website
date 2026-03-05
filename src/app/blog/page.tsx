import type { Metadata } from "next";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Updates, tutorials, and insights about Expense Budget Tracker.",
};

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
}

const CONTENT_DIR = join(process.cwd(), "src/content/blog");

const getBlogPosts = (): ReadonlyArray<BlogPost> => {
  if (!existsSync(CONTENT_DIR)) return [];
  const files = readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map((file): BlogPost => {
    const raw = readFileSync(join(CONTENT_DIR, file), "utf-8");
    const { data } = matter(raw);
    return {
      slug: file.replace(/\.md$/, ""),
      title: data.title as string,
      description: data.description as string,
      date: data.date as string,
    };
  });
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
};

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <div className={styles.container}>
      <Breadcrumbs items={[{ label: "Blog", href: "/blog/" }]} />
      <h1 className={styles.title}>Blog</h1>
      {posts.length === 0 ? (
        <p className={styles.empty}>Posts coming soon.</p>
      ) : (
        <div className={styles.list}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className={styles.card}
            >
              <time className={styles.date}>{post.date}</time>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
