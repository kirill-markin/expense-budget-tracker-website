import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { listBlogPosts } from "@/lib/blog";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "./page.module.css";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description: "Updates, tutorials, and insights about Expense Budget Tracker.",
  pathname: "/blog/",
  markdownPath: "/blog.md",
  openGraphType: "website",
});

export default function BlogPage() {
  const posts = listBlogPosts();

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
