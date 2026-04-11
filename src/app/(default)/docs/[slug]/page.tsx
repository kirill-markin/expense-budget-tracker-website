import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DOC_SLUGS } from "@/data/docs";
import {
  getAvailableDocLocales,
  readDocContent,
} from "@/lib/docs";
import { getSiteMessages } from "@/lib/i18n/messages";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "./page.module.css";

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
  const doc = await readDocContent(slug, "en");

  if (doc === null) {
    return { title: "Not Found" };
  }

  return createPageMetadata({
    title: doc.title,
    description: doc.description,
    locale: "en",
    routePath: `/docs/${slug}/`,
    markdownRoutePath: `/docs/${slug}.md`,
    openGraphType: "website",
    availableLocales: getAvailableDocLocales(slug),
  });
};

export default async function DocPage(
  props: PageProps
): Promise<React.JSX.Element> {
  const { slug } = await props.params;
  const doc = await readDocContent(slug, "en");

  if (doc === null) {
    notFound();
  }

  const messages = getSiteMessages("en");

  return (
    <div className={styles.container}>
      <Breadcrumbs
        locale="en"
        items={[
          { label: messages.breadcrumbs.docs, href: "/docs/" },
          { label: doc.title, href: `/docs/${slug}/` },
        ]}
      />
      <h1 className={styles.title}>{doc.title}</h1>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: doc.contentHtml }}
      />
    </div>
  );
}
