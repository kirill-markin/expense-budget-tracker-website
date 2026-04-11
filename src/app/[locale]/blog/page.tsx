import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { listBlogPosts } from "@/lib/blog";
import { getSiteMessages } from "@/lib/i18n/messages";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "@/app/(default)/blog/page.module.css";

const PAGE_COPY = {
  title: "Blog",
  description:
    "Novedades, tutoriales e ideas sobre Expense Budget Tracker.",
  empty: "Próximamente habrá publicaciones.",
};

export const metadata: Metadata = createPageMetadata({
  title: PAGE_COPY.title,
  description: PAGE_COPY.description,
  locale: "es",
  routePath: "/blog/",
  markdownRoutePath: "/blog.md",
  openGraphType: "website",
  availableLocales: ["en", "es"],
});

export default function LocalizedBlogPage(): React.JSX.Element {
  const posts = listBlogPosts("es");
  const messages = getSiteMessages("es");

  return (
    <div className={styles.container}>
      <Breadcrumbs
        locale="es"
        items={[{ label: messages.breadcrumbs.blog, href: "/es/blog/" }]}
      />
      <h1 className={styles.title}>{PAGE_COPY.title}</h1>
      {posts.length === 0 ? (
        <p className={styles.empty}>{PAGE_COPY.empty}</p>
      ) : (
        <div className={styles.list}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/es/blog/${post.slug}/`}
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
