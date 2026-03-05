import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import "./globals.css";

const SITE_URL = "https://expense-budget-tracker.com";

export const metadata: Metadata = {
  title: {
    default: "Expense Budget Tracker - Open Source Personal Finance",
    template: "%s | Expense Budget Tracker",
  },
  description:
    "Open-source expense and budget tracker with multi-currency support, transfers, and financial dashboards. Self-host on Postgres or use the cloud version.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: `${SITE_URL}/`,
    siteName: "Expense Budget Tracker",
    title: "Expense Budget Tracker - Open Source Personal Finance",
    description:
      "Open-source expense and budget tracker with multi-currency support, transfers, and financial dashboards. Self-host on Postgres or use the cloud version.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expense Budget Tracker - Open Source Personal Finance",
    description:
      "Open-source expense and budget tracker with multi-currency support, transfers, and financial dashboards.",
  },
  alternates: {
    canonical: `${SITE_URL}/`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <JsonLdSchema />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
