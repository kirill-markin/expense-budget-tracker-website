import type { Metadata } from "next";
import "@/app/globals.css";
import { RootDocument } from "@/app/RootDocument";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { DEFAULT_LOCALE, getTextDirection } from "@/lib/i18n/config";
import { ROOT_LAYOUT_METADATA } from "@/lib/seo/rootMetadata";

export const metadata: Metadata = ROOT_LAYOUT_METADATA;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <RootDocument
      lang={DEFAULT_LOCALE}
      dir={getTextDirection(DEFAULT_LOCALE)}
    >
      <JsonLdSchema locale={DEFAULT_LOCALE} />
      {children}
    </RootDocument>
  );
}
