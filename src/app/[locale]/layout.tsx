import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { RootDocument } from "@/app/RootDocument";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import {
  PREFIXED_LOCALES,
  getHtmlLang,
  getTextDirection,
  isPrefixedLocale,
  type PrefixedLocale,
} from "@/lib/i18n/config";
import { ROOT_LAYOUT_METADATA } from "@/lib/seo/rootMetadata";

interface LocaleLayoutProps {
  readonly children: React.ReactNode;
  readonly params: Promise<{ locale: string }>;
}

export const dynamicParams = false;
export const metadata: Metadata = ROOT_LAYOUT_METADATA;

export function generateStaticParams(): Array<{ locale: PrefixedLocale }> {
  return PREFIXED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout(
  props: LocaleLayoutProps
): Promise<React.JSX.Element> {
  const { locale } = await props.params;

  if (!isPrefixedLocale(locale)) {
    notFound();
  }

  return (
    <RootDocument
      lang={getHtmlLang(locale)}
      dir={getTextDirection(locale)}
    >
      <JsonLdSchema locale={locale} />
      {props.children}
    </RootDocument>
  );
}
