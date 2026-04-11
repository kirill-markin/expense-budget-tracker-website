import type { Metadata } from "next";
import "@/app/globals.css";
import { RootDocument } from "@/app/RootDocument";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import { ROOT_LAYOUT_METADATA } from "@/lib/seo/rootMetadata";

export const metadata: Metadata = ROOT_LAYOUT_METADATA;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <RootDocument lang="en">
      <JsonLdSchema locale="en" />
      <Header locale="en" />
      <main lang="en">{children}</main>
      <Footer locale="en" />
    </RootDocument>
  );
}
