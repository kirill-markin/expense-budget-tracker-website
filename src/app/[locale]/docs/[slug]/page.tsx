import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  getAvailableDocLocales,
  listDocs,
  readDocContent,
} from "@/lib/docs";
import { getSiteMessages } from "@/lib/i18n/messages";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "@/app/(default)/docs/[slug]/page.module.css";

export const dynamicParams = false;

export const generateStaticParams = (): Array<{ slug: string }> =>
  listDocs("es").map((doc) => ({ slug: doc.slug }));

interface PageProps {
  readonly params: Promise<{ slug: string }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug } = await params;
  const doc = await readDocContent(slug, "es");

  if (doc === null) {
    return { title: "No encontrado" };
  }

  return createPageMetadata({
    title: doc.title,
    description: doc.description,
    locale: "es",
    routePath: `/docs/${slug}/`,
    openGraphType: "website",
    availableLocales: getAvailableDocLocales(slug),
  });
};

export default async function LocalizedDocPage(
  props: PageProps
): Promise<React.JSX.Element> {
  const { slug } = await props.params;
  const doc = await readDocContent(slug, "es");

  if (doc === null) {
    notFound();
  }

  const messages = getSiteMessages("es");

  return (
    <div className={styles.container}>
      <Breadcrumbs
        locale="es"
        items={[
          { label: messages.breadcrumbs.docs, href: "/es/docs/" },
          { label: doc.title, href: `/es/docs/${slug}/` },
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
