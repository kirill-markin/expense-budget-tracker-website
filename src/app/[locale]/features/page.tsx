import type { Metadata } from "next";
import {
  getMarketingPageMetadata,
  MarketingPage,
} from "@/components/pages/MarketingPage";

export const metadata: Metadata = getMarketingPageMetadata("es", "features");

export default function LocalizedFeaturesPage(): Promise<React.JSX.Element> {
  return MarketingPage({ locale: "es", slug: "features" });
}
