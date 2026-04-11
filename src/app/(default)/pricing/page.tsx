import type { Metadata } from "next";
import {
  getMarketingPageMetadata,
  MarketingPage,
} from "@/components/pages/MarketingPage";

export const metadata: Metadata = getMarketingPageMetadata("en", "pricing");

export default function PricingPage(): Promise<React.JSX.Element> {
  return MarketingPage({ locale: "en", slug: "pricing" });
}
