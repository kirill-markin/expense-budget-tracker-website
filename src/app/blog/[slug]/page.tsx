import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  getRecommendedBlogPosts,
  listBlogPosts,
  readBlogPostContent,
} from "@/lib/blog";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "./page.module.css";

export const generateStaticParams = (): Array<{ slug: string }> => {
  return listBlogPosts().map((post) => ({ slug: post.slug }));
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = "https://expense-budget-tracker.com";
const AUTHOR_NAME = "Kirill Markin";
const AUTHOR_URL = "https://kirill-markin.com/";

interface ArticleAuthor {
  "@type": "Person";
  name: string;
  url: string;
}

const ARTICLE_AUTHOR: ArticleAuthor = {
  "@type": "Person",
  name: AUTHOR_NAME,
  url: AUTHOR_URL,
};

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const post = await readBlogPostContent(slug);
  if (!post) return { title: "Not Found" };
  return createPageMetadata({
    title: post.title,
    description: post.description,
    pathname: `/blog/${slug}/`,
    markdownPath: `/blog/${slug}.md`,
    openGraphType: "article",
    publishedTime: post.date,
  });
};

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await readBlogPostContent(slug);

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
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `${SITE_URL}/blog/${slug}/`,
    author: ARTICLE_AUTHOR,
    publisher: {
      "@type": "Organization",
      name: "Expense Budget Tracker",
      url: `${SITE_URL}/`,
    },
  };
  const recommendedPosts = getRecommendedBlogPosts(slug, 4);

  return (
    <article className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog/" },
          { label: post.title, href: `/blog/${slug}/` },
        ]}
      />
      <time className={styles.date}>{post.date}</time>
      <a href={AUTHOR_URL} className={styles.byline}>
        By {AUTHOR_NAME}
      </a>
      <h1 className={styles.title}>{post.title}</h1>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
      <section className={styles.relatedSection}>
        <h2 className={styles.relatedHeading}>Read next</h2>
        <div className={styles.relatedList}>
          {recommendedPosts.map((recommendedPost) => (
            <Link
              key={recommendedPost.slug}
              href={`/blog/${recommendedPost.slug}/`}
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
