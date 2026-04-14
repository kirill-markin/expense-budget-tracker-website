import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SiteFrame } from "@/components/SiteFrame";
import { DOC_SLUGS } from "@/data/docs";
import {
  getAvailableDocLocales,
  readDocContent,
} from "@/lib/docs";
import { getSiteMessages } from "@/lib/i18n/messages";
import {
  getAbsoluteUrl,
  getLocalizedPath,
} from "@/lib/i18n/routing";
import { createTechArticleStructuredData } from "@/lib/seo/createTechArticleStructuredData";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "./page.module.css";

const LOCALE = "en";

export const dynamicParams = false;

export const generateStaticParams = (): Array<{ slug: string }> =>
  DOC_SLUGS.map((slug) => ({ slug }));

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const doc = await readDocContent(slug, LOCALE);

  if (doc === null) {
    return { title: "Not Found" };
  }

  return createPageMetadata({
    title: doc.title,
    description: doc.description,
    locale: LOCALE,
    routePath: `/docs/${slug}/`,
    openGraphType: "article",
    availableLocales: getAvailableDocLocales(slug),
  });
};

export default async function DocPage(
  props: PageProps
): Promise<React.JSX.Element> {
  const { slug } = await props.params;
  const doc = await readDocContent(slug, LOCALE);

  if (doc === null) {
    notFound();
  }

  const messages = getSiteMessages(LOCALE);
  const pageUrl = getAbsoluteUrl(getLocalizedPath(LOCALE, `/docs/${slug}/`));
  const articleSchema = createTechArticleStructuredData({
    locale: LOCALE,
    pageUrl,
    article: doc,
  });

  return (
    <SiteFrame
      locale={LOCALE}
      routePath={`/docs/${slug}/`}
      availableLocales={getAvailableDocLocales(slug)}
    >
      <article className={styles.container}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <Breadcrumbs
          locale={LOCALE}
          items={[
            { label: messages.breadcrumbs.docs, href: getLocalizedPath(LOCALE, "/docs/") },
            { label: doc.title, href: getLocalizedPath(LOCALE, `/docs/${slug}/`) },
          ]}
        />
        <header className={styles.header}>
          <h1 className={styles.title}>{doc.title}</h1>
          <p className={styles.description}>{doc.description}</p>
        </header>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: doc.contentHtml }}
        />
      </article>
    </SiteFrame>
  );
}
