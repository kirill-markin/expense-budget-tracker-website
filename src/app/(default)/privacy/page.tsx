import type { Metadata } from "next";
import {
  getMarketingPageMetadata,
  MarketingPage,
} from "@/components/pages/MarketingPage";

export const metadata: Metadata = getMarketingPageMetadata("en", "privacy");

export default function PrivacyPage(): Promise<React.JSX.Element> {
  return MarketingPage({ locale: "en", slug: "privacy" });
}
