import type { Metadata } from "next";
import {
  getMarketingPageMetadata,
  MarketingPage,
} from "@/components/pages/MarketingPage";

export const metadata: Metadata = getMarketingPageMetadata("es", "privacy");

export default function LocalizedPrivacyPage(): Promise<React.JSX.Element> {
  return MarketingPage({ locale: "es", slug: "privacy" });
}
