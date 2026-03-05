const SITE_URL = "https://expense-budget-tracker.com";

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Expense Budget Tracker",
  description:
    "Open-source expense and budget tracker with multi-currency support, transfers, and financial dashboards.",
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
  description:
    "Open-source expense and budget tracker with multi-currency support, transfers, and financial dashboards.",
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
