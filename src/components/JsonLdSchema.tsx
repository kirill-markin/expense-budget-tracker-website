import { readPageContent } from "@/lib/content/readPageContent";
import type { AppLocale } from "@/lib/i18n/config";
import { buildAbsoluteUrl, getLocalizedPath } from "@/lib/i18n/routing";

interface JsonLdSchemaProps {
  readonly locale: AppLocale;
}

export function JsonLdSchema({ locale }: JsonLdSchemaProps): React.JSX.Element {
  const homePageContent = readPageContent("home", locale);
  const homeUrl = buildAbsoluteUrl(
    "https://expense-budget-tracker.com",
    getLocalizedPath(locale, "/")
  );
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Expense Budget Tracker",
    description: homePageContent.description,
    url: homeUrl,
    inLanguage: locale,
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    license: "https://opensource.org/licenses/MIT",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    codeRepository:
      "https://github.com/kirill-markin/expense-budget-tracker",
  };
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: homeUrl,
    name: "Expense Budget Tracker",
    description: homePageContent.description,
    inLanguage: locale,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
