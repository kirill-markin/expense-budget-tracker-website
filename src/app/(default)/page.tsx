import type { Metadata } from "next";
import {
  getMarketingPageMetadata,
  MarketingPage,
} from "@/components/pages/MarketingPage";

export const metadata: Metadata = getMarketingPageMetadata("en", "home");

export default function HomePage(): Promise<React.JSX.Element> {
  return MarketingPage({ locale: "en", slug: "home" });
}
