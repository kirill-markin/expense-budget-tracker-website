import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFrame } from "@/components/SiteFrame";
import {
  getAvailableBlogLocales,
  getRepresentativeBlogPostImage,
  getRecommendedBlogPosts,
  listBlogPosts,
  readBlogPostContent,
} from "@/lib/blog";
import { PREFIXED_LOCALES, isPrefixedLocale } from "@/lib/i18n/config";
import { getSiteMessages } from "@/lib/i18n/messages";
import {
  getAbsoluteUrl,
  getLocalizedPath,
} from "@/lib/i18n/routing";
import {
  createBlogPostingStructuredData,
  resolveBlogPostImageUrl,
} from "@/lib/seo/createBlogPostingStructuredData";
import {
  createPageMetadata,
  getDefaultOpenGraphImageUrl,
} from "@/lib/seo/createPageMetadata";
import styles from "@/app/(default)/blog/[slug]/page.module.css";

const AUTHOR_NAME = "Kirill Markin";
const AUTHOR_URL = "https://kirill-markin.com/";

export const dynamicParams = false;

export const generateStaticParams = (): Array<{ locale: string; slug: string }> =>
  PREFIXED_LOCALES.flatMap((locale) =>
    listBlogPosts(locale).map((post) => ({ locale, slug: post.slug }))
  );

interface PageProps {
  readonly params: Promise<{ locale: string; slug: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { locale, slug } = await params;

  if (!isPrefixedLocale(locale)) {
    return { title: "Not Found" };
  }

  const post = await readBlogPostContent(slug, locale);

  if (post === null) {
    return { title: "Not Found" };
  }

  const image = getRepresentativeBlogPostImage(post);

  return createPageMetadata({
    title: post.title,
    description: post.description,
    locale,
    routePath: `/blog/${slug}/`,
    openGraphType: "article",
    availableLocales: getAvailableBlogLocales(slug),
    publishedTime: post.date,
    modifiedTime: post.updated ?? undefined,
    imageUrl: resolveBlogPostImageUrl(image) ?? undefined,
  });
};

export default async function LocalizedBlogPostPage(
  props: PageProps
): Promise<React.JSX.Element> {
  const { locale, slug } = await props.params;

  if (!isPrefixedLocale(locale)) {
    notFound();
  }

  const post = await readBlogPostContent(slug, locale);

  if (post === null) {
    notFound();
  }

  const pageUrl = getAbsoluteUrl(getLocalizedPath(locale, `/blog/${slug}/`));
  const imageUrl =
    resolveBlogPostImageUrl(getRepresentativeBlogPostImage(post)) ??
    getDefaultOpenGraphImageUrl();
  const messages = getSiteMessages(locale);
  const articleSchema = createBlogPostingStructuredData({
    locale,
    pageUrl,
    imageUrl,
    post,
  });
  const recommendedPosts = getRecommendedBlogPosts(locale, slug, 4);

  return (
    <SiteFrame
      locale={locale}
      routePath={`/blog/${slug}/`}
      availableLocales={getAvailableBlogLocales(slug)}
    >
      <article className={styles.container}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <Breadcrumbs
          locale={locale}
          items={[
            { label: messages.breadcrumbs.blog, href: getLocalizedPath(locale, "/blog/") },
            { label: post.title, href: getLocalizedPath(locale, `/blog/${slug}/`) },
          ]}
        />
        <header className={styles.header}>
          <div className={styles.meta}>
            <p className={styles.dateMeta}>
              <span className={styles.dateLabel}>
                {messages.blogPost.publishedLabel}
              </span>
              <time className={styles.date} dateTime={post.date}>
                {post.date}
              </time>
            </p>
            <p className={styles.byline}>
              {messages.blogPost.bylinePrefix}{" "}
              <a href={AUTHOR_URL} rel="author">
                {AUTHOR_NAME}
              </a>
            </p>
          </div>
          <h1 className={styles.title}>{post.title}</h1>
          <p className={styles.description}>{post.description}</p>
        </header>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
        {recommendedPosts.length > 0 ? (
          <section className={styles.relatedSection}>
            <h2 className={styles.relatedHeading}>
              {messages.blogPost.relatedHeading}
            </h2>
            <div className={styles.relatedList}>
              {recommendedPosts.map((recommendedPost) => (
                <Link
                  key={recommendedPost.slug}
                  href={getLocalizedPath(locale, `/blog/${recommendedPost.slug}/`)}
                  className={styles.relatedCard}
                >
                  <time className={styles.date} dateTime={recommendedPost.date}>
                    {recommendedPost.date}
                  </time>
                  <h3>{recommendedPost.title}</h3>
                  <p className={styles.relatedDescription}>
                    {recommendedPost.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </SiteFrame>
  );
}
