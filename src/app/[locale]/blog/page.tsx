import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFrame } from "@/components/SiteFrame";
import { getAvailableBlogIndexLocales, listBlogPosts } from "@/lib/blog";
import { isPrefixedLocale, type AppLocale } from "@/lib/i18n/config";
import { getSiteMessages } from "@/lib/i18n/messages";
import { getLocalizedPath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "@/app/(default)/blog/page.module.css";

interface PageProps {
  readonly params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isPrefixedLocale(locale)) {
    return { title: "Not Found" };
  }

  const pageCopy = getSiteMessages(locale).blogIndex;
  const availableBlogIndexLocales = getAvailableBlogIndexLocales();

  return createPageMetadata({
    title: pageCopy.title,
    description: pageCopy.description,
    locale,
    routePath: "/blog/",
    openGraphType: "website",
    availableLocales: availableBlogIndexLocales.includes(locale)
      ? availableBlogIndexLocales
      : [locale],
  });
}

export default async function LocalizedBlogPage(
  props: PageProps
): Promise<React.JSX.Element> {
  const { locale } = await props.params;

  if (!isPrefixedLocale(locale)) {
    notFound();
  }

  const posts = listBlogPosts(locale);
  const messages = getSiteMessages(locale);
  const pageCopy = messages.blogIndex;
  const availableBlogIndexLocales = getAvailableBlogIndexLocales();
  const availableLocales: ReadonlyArray<AppLocale> =
    availableBlogIndexLocales.includes(locale)
      ? availableBlogIndexLocales
      : [locale];

  return (
    <SiteFrame
      locale={locale}
      routePath="/blog/"
      availableLocales={availableLocales}
    >
      <div className={styles.container}>
        <Breadcrumbs
          locale={locale}
          items={[
            {
              label: messages.breadcrumbs.blog,
              href: getLocalizedPath(locale, "/blog/"),
            },
          ]}
        />
        <h1 className={styles.title}>{pageCopy.title}</h1>
        {posts.length === 0 ? (
          <p className={styles.empty}>{pageCopy.empty}</p>
        ) : (
          <div className={styles.list}>
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={getLocalizedPath(locale, `/blog/${post.slug}/`)}
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
    </SiteFrame>
  );
}
