import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAlternateBlogIndexLocales, listBlogPosts } from "@/lib/blog";
import { getSiteMessages } from "@/lib/i18n/messages";
import { getLocalizedPath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "./page.module.css";

const LOCALE = "en";
const PAGE_COPY = getSiteMessages(LOCALE).blogIndex;
const BLOG_INDEX_ALTERNATE_LOCALES = getAlternateBlogIndexLocales();

export const metadata: Metadata = createPageMetadata({
  title: PAGE_COPY.title,
  description: PAGE_COPY.description,
  locale: LOCALE,
  routePath: "/blog/",
  openGraphType: "website",
  availableLocales: BLOG_INDEX_ALTERNATE_LOCALES.includes(LOCALE)
    ? BLOG_INDEX_ALTERNATE_LOCALES
    : [LOCALE],
});

export default function BlogPage(): React.JSX.Element {
  const posts = listBlogPosts(LOCALE);
  const messages = getSiteMessages(LOCALE);

  return (
    <div className={styles.container}>
      <Breadcrumbs
        locale={LOCALE}
        items={[
          {
            label: messages.breadcrumbs.blog,
            href: getLocalizedPath(LOCALE, "/blog/"),
          },
        ]}
      />
      <h1 className={styles.title}>{PAGE_COPY.title}</h1>
      {posts.length === 0 ? (
        <p className={styles.empty}>{PAGE_COPY.empty}</p>
      ) : (
        <div className={styles.list}>
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={getLocalizedPath(LOCALE, `/blog/${post.slug}/`)}
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
