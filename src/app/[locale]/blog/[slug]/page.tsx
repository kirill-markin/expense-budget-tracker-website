import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
import styles from "@/app/(default)/blog/[slug]/page.module.css";

const AUTHOR_NAME = "Kirill Markin";
const AUTHOR_URL = "https://kirill-markin.com/";

const PAGE_COPY = {
  bylinePrefix: "Por",
  relatedHeading: "Sigue leyendo",
};

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
  return listBlogPosts("es").map((post) => ({ slug: post.slug }));
};

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const post = await readBlogPostContent(slug, "es");

  if (post === null) {
    return { title: "No encontrado" };
  }

  return createPageMetadata({
    title: post.title,
    description: post.description,
    locale: "es",
    routePath: `/blog/${slug}/`,
    openGraphType: "article",
    availableLocales: getAvailableBlogLocales(slug),
    publishedTime: post.date,
  });
};

export default async function LocalizedBlogPostPage(
  props: PageProps
): Promise<React.JSX.Element> {
  const { slug } = await props.params;
  const post = await readBlogPostContent(slug, "es");

  if (post === null) {
    notFound();
  }

  const pageUrl = getAbsoluteUrl(getLocalizedPath("es", `/blog/${slug}/`));
  const messages = getSiteMessages("es");
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
    inLanguage: "es",
  };
  const recommendedPosts = getRecommendedBlogPosts("es", slug, 4);

  return (
    <article className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Breadcrumbs
        locale="es"
        items={[
          { label: messages.breadcrumbs.blog, href: "/es/blog/" },
          { label: post.title, href: `/es/blog/${slug}/` },
        ]}
      />
      <time className={styles.date}>{post.date}</time>
      <a href={AUTHOR_URL} className={styles.byline}>
        {PAGE_COPY.bylinePrefix} {AUTHOR_NAME}
      </a>
      <h1 className={styles.title}>{post.title}</h1>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
      <section className={styles.relatedSection}>
        <h2 className={styles.relatedHeading}>{PAGE_COPY.relatedHeading}</h2>
        <div className={styles.relatedList}>
          {recommendedPosts.map((recommendedPost) => (
            <Link
              key={recommendedPost.slug}
              href={`/es/blog/${recommendedPost.slug}/`}
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
    </article>
  );
}
