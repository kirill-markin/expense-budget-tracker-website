import type { Metadata } from "next";
import {
  getMarketingPageMetadata,
  MarketingPage,
} from "@/components/pages/MarketingPage";

export const metadata: Metadata = getMarketingPageMetadata("es", "pricing");

export default function LocalizedPricingPage(): Promise<React.JSX.Element> {
  return MarketingPage({ locale: "es", slug: "pricing" });
}
