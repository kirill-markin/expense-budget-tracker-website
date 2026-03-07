import { HOME_PAGE_METADATA } from "@/content/pages/home";

const SITE_URL = "https://expense-budget-tracker.com";

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Expense Budget Tracker",
  description: HOME_PAGE_METADATA.description,
  url: `${SITE_URL}/`,
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
  url: `${SITE_URL}/`,
  name: "Expense Budget Tracker",
  description: HOME_PAGE_METADATA.description,
};

export function JsonLdSchema(): React.JSX.Element {
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
