import type { Metadata } from "next";
import { Source_Serif_4 } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLdSchema } from "@/components/JsonLdSchema";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-source-serif",
});

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
    types: { "text/markdown": "/.md" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sourceSerif.variable}>
        <JsonLdSchema />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
