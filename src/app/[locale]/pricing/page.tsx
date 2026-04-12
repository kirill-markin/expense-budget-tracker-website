import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getMarketingPageMetadata,
  MarketingPage,
} from "@/components/pages/MarketingPage";
import { isPrefixedLocale } from "@/lib/i18n/config";

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

  return getMarketingPageMetadata(locale, "pricing");
}

export default async function LocalizedPricingPage(
  props: PageProps
): Promise<React.JSX.Element> {
  const { locale } = await props.params;

  if (!isPrefixedLocale(locale)) {
    notFound();
  }

  return MarketingPage({ locale, slug: "pricing" });
}
