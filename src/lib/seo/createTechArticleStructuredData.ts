import type { AppLocale } from "@/lib/i18n/config";
import { getHtmlLang } from "@/lib/i18n/config";
import { getAbsoluteUrl } from "@/lib/i18n/routing";

const AUTHOR_NAME = "Kirill Markin";
const AUTHOR_URL = "https://kirill-markin.com/";

interface PersonStructuredData {
  readonly "@type": "Person";
  readonly name: string;
  readonly url: string;
}

interface OrganizationStructuredData {
  readonly "@type": "Organization";
  readonly name: string;
  readonly url: string;
}

interface WebPageStructuredData {
  readonly "@type": "WebPage";
  readonly "@id": string;
}

export interface TechArticleStructuredData {
  readonly "@context": "https://schema.org";
  readonly "@type": "TechArticle";
  readonly headline: string;
  readonly description: string;
  readonly author: PersonStructuredData;
  readonly mainEntityOfPage: WebPageStructuredData;
  readonly publisher: OrganizationStructuredData;
  readonly url: string;
  readonly inLanguage: string;
}

interface CreateTechArticleStructuredDataParams {
  readonly locale: AppLocale;
  readonly pageUrl: string;
  readonly article: {
    readonly title: string;
    readonly description: string;
  };
}

const ARTICLE_AUTHOR: PersonStructuredData = {
  "@type": "Person",
  name: AUTHOR_NAME,
  url: AUTHOR_URL,
};

const ARTICLE_PUBLISHER: OrganizationStructuredData = {
  "@type": "Organization",
  name: "Expense Budget Tracker",
  url: getAbsoluteUrl("/"),
};

export function createTechArticleStructuredData(
  params: CreateTechArticleStructuredDataParams
): TechArticleStructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: params.article.title,
    description: params.article.description,
    author: ARTICLE_AUTHOR,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": params.pageUrl,
    },
    publisher: ARTICLE_PUBLISHER,
    url: params.pageUrl,
    inLanguage: getHtmlLang(params.locale),
  };
}
