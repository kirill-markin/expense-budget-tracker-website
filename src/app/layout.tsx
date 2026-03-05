import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Expense Budget Tracker - Open Source Personal Finance",
    template: "%s | Expense Budget Tracker",
  },
  description:
    "Open-source expense and budget tracker with multi-currency support, transfers, and financial dashboards. Self-host on Postgres or use the cloud version.",
  metadataBase: new URL("https://expense-budget-tracker.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Expense Budget Tracker",
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
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
