import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import {
  getAvailableDocLocales,
  listDocs,
  readDocContent,
} from "@/lib/docs";
import { PREFIXED_LOCALES, isPrefixedLocale } from "@/lib/i18n/config";
import { getSiteMessages } from "@/lib/i18n/messages";
import { getLocalizedPath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "@/app/(default)/docs/[slug]/page.module.css";

export const dynamicParams = false;

export const generateStaticParams = (): Array<{ locale: string; slug: string }> =>
  PREFIXED_LOCALES.flatMap((locale) =>
    listDocs(locale).map((doc) => ({ locale, slug: doc.slug }))
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

  const doc = await readDocContent(slug, locale);

  if (doc === null) {
    return { title: "Not Found" };
  }

  return createPageMetadata({
    title: doc.title,
    description: doc.description,
    locale,
    routePath: `/docs/${slug}/`,
    openGraphType: "website",
    availableLocales: getAvailableDocLocales(slug),
  });
};

export default async function LocalizedDocPage(
  props: PageProps
): Promise<React.JSX.Element> {
  const { locale, slug } = await props.params;

  if (!isPrefixedLocale(locale)) {
    notFound();
  }

  const doc = await readDocContent(slug, locale);

  if (doc === null) {
    notFound();
  }

  const messages = getSiteMessages(locale);

  return (
    <div className={styles.container}>
      <Breadcrumbs
        locale={locale}
        items={[
          { label: messages.breadcrumbs.docs, href: getLocalizedPath(locale, "/docs/") },
          { label: doc.title, href: getLocalizedPath(locale, `/docs/${slug}/`) },
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
