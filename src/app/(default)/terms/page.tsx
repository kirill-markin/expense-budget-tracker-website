import type { Metadata } from "next";
import {
  getMarketingPageMetadata,
  MarketingPage,
} from "@/components/pages/MarketingPage";

export const metadata: Metadata = getMarketingPageMetadata("en", "terms");

export default function TermsPage(): Promise<React.JSX.Element> {
  return MarketingPage({ locale: "en", slug: "terms" });
}
