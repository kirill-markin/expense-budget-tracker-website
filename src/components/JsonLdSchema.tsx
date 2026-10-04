import { readPageContent } from "@/lib/content/readPageContent";
import type { AppLocale } from "@/lib/i18n/config";
import { buildAbsoluteUrl, getLocalizedPath } from "@/lib/i18n/routing";

interface JsonLdSchemaProps {
  readonly locale: AppLocale;
}

const publisherOrganization = {
  "@type": "Organization",
  "@id": "https://kirill-markin.com/samo-danni-eood/#organization",
  name: "SAMO DANNI EOOD",
  legalName: "SAMO DANNI EOOD",
  url: "https://kirill-markin.com/samo-danni-eood/",
  logo: "https://kirill-markin.com/samo-danni-eood/google-play-developer/logo.png",
} as const;

const creatorPerson = {
  "@type": "Person",
  "@id": "https://kirill-markin.com/#person",
  name: "Kirill Markin",
  url: "https://kirill-markin.com/",
} as const;

// Escapes "<" so a JSON string value cannot close the surrounding <script> element.
const serializeJsonLd = (schema: object): string =>
  JSON.stringify(schema).replace(/</g, "\\u003c");

export function JsonLdSchema({ locale }: JsonLdSchemaProps): React.JSX.Element {
  const homePageContent = readPageContent("home", locale);
  const homeUrl = buildAbsoluteUrl(
    "https://expense-budget-tracker.com",
    getLocalizedPath(locale, "/")
  );
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://expense-budget-tracker.com/#software",
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
    publisher: publisherOrganization,
    creator: creatorPerson,
  };
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: homeUrl,
    name: "Expense Budget Tracker",
    description: homePageContent.description,
    inLanguage: locale,
    publisher: publisherOrganization,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteSchema) }}
      />
    </>
  );
}
