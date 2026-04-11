import type { Metadata } from "next";
import {
  getMarketingPageMetadata,
  MarketingPage,
} from "@/components/pages/MarketingPage";

export const metadata: Metadata = getMarketingPageMetadata("en", "features");

export default function FeaturesPage(): Promise<React.JSX.Element> {
  return MarketingPage({ locale: "en", slug: "features" });
}
