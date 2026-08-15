import type { Metadata } from "next";
import {
  getMarketingPageMetadata,
  MarketingPage,
} from "@/components/pages/MarketingPage";

export const metadata: Metadata = getMarketingPageMetadata("en", "support");

export default function SupportPage(): Promise<React.JSX.Element> {
  return MarketingPage({ locale: "en", slug: "support" });
}
