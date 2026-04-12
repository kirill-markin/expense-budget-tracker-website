import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getAvailableDocIndexLocales, listDocs } from "@/lib/docs";
import { isPrefixedLocale } from "@/lib/i18n/config";
import { getSiteMessages } from "@/lib/i18n/messages";
import { getLocalizedPath } from "@/lib/i18n/routing";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import styles from "@/app/(default)/docs/page.module.css";

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

  const pageCopy = getSiteMessages(locale).docs;

  return createPageMetadata({
    title: pageCopy.title,
    description: pageCopy.description,
    locale,
    routePath: "/docs/",
    openGraphType: "website",
    availableLocales: getAvailableDocIndexLocales(),
  });
}

export default async function LocalizedDocsPage(
  props: PageProps
): Promise<React.JSX.Element> {
  const { locale } = await props.params;

  if (!isPrefixedLocale(locale)) {
    notFound();
  }

  const docs = listDocs(locale);
  const messages = getSiteMessages(locale);
  const pageCopy = messages.docs;

  return (
    <div className={styles.container}>
      <Breadcrumbs
        locale={locale}
        items={[
          {
            label: messages.breadcrumbs.docs,
            href: getLocalizedPath(locale, "/docs/"),
          },
        ]}
      />
      <h1 className={styles.title}>{pageCopy.title}</h1>
      <div className={styles.grid}>
        {docs.map((doc) => (
          <Link
            key={doc.slug}
            href={getLocalizedPath(locale, `/docs/${doc.slug}/`)}
            className={styles.card}
          >
            <h2>{doc.title}</h2>
            <p>{doc.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
