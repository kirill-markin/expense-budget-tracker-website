import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFrame } from "@/components/SiteFrame";
import {
  getAvailableBlogLocales,
  getRecommendedBlogPosts,
  listBlogPosts,
  readBlogPostContent,
} from "@/lib/blog";
import { getSiteMessages } from "@/lib/i18n/messages";
import {
  getAbsoluteUrl,
  getLocalizedPath,
} from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "./page.module.css";

const LOCALE = "en";
const AUTHOR_NAME = "Kirill Markin";
const AUTHOR_URL = "https://kirill-markin.com/";

interface ArticleAuthor {
  readonly "@type": "Person";
  readonly name: string;
  readonly url: string;
}

const ARTICLE_AUTHOR: ArticleAuthor = {
  "@type": "Person",
  name: AUTHOR_NAME,
  url: AUTHOR_URL,
};

export const dynamicParams = false;

export const generateStaticParams = (): Array<{ slug: string }> => {
  return listBlogPosts(LOCALE).map((post) => ({ slug: post.slug }));
};

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const post = await readBlogPostContent(slug, LOCALE);

  if (post === null) {
    return { title: "Not Found" };
  }

  return createPageMetadata({
    title: post.title,
    description: post.description,
    locale: LOCALE,
    routePath: `/blog/${slug}/`,
    openGraphType: "article",
    availableLocales: getAvailableBlogLocales(slug),
    publishedTime: post.date,
  });
};

export default async function BlogPostPage(
  props: PageProps
): Promise<React.JSX.Element> {
  const { slug } = await props.params;
  const post = await readBlogPostContent(slug, LOCALE);

  if (post === null) {
    notFound();
  }

  const pageUrl = getAbsoluteUrl(getLocalizedPath(LOCALE, `/blog/${slug}/`));
  const messages = getSiteMessages(LOCALE);
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: pageUrl,
    author: ARTICLE_AUTHOR,
    publisher: {
      "@type": "Organization",
      name: "Expense Budget Tracker",
      url: getAbsoluteUrl("/"),
    },
    inLanguage: LOCALE,
  };
  const recommendedPosts = getRecommendedBlogPosts(LOCALE, slug, 4);

  return (
    <SiteFrame
      locale={LOCALE}
      routePath={`/blog/${slug}/`}
      availableLocales={getAvailableBlogLocales(slug)}
    >
      <article className={styles.container}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <Breadcrumbs
          locale={LOCALE}
          items={[
            { label: messages.breadcrumbs.blog, href: getLocalizedPath(LOCALE, "/blog/") },
            { label: post.title, href: getLocalizedPath(LOCALE, `/blog/${slug}/`) },
          ]}
        />
        <time className={styles.date}>{post.date}</time>
        <a href={AUTHOR_URL} className={styles.byline}>
          {messages.blogPost.bylinePrefix} {AUTHOR_NAME}
        </a>
        <h1 className={styles.title}>{post.title}</h1>
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
                  href={getLocalizedPath(LOCALE, `/blog/${recommendedPost.slug}/`)}
                  className={styles.relatedCard}
                >
                  <time className={styles.date}>{recommendedPost.date}</time>
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
