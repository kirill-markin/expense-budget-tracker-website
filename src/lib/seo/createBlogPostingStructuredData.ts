import type { BlogPostRecord } from "@/lib/blog";
import { type AppLocale, getHtmlLang } from "@/lib/i18n/config";
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

export interface BlogPostingStructuredData {
  readonly "@context": "https://schema.org";
  readonly "@type": "BlogPosting";
  readonly headline: string;
  readonly description: string;
  readonly author: PersonStructuredData;
  readonly datePublished: string;
  readonly image: string;
  readonly mainEntityOfPage: WebPageStructuredData;
  readonly publisher: OrganizationStructuredData;
  readonly url: string;
  readonly inLanguage: string;
  readonly dateModified?: string;
}

interface CreateBlogPostingStructuredDataParams {
  readonly locale: AppLocale;
  readonly pageUrl: string;
  readonly imageUrl: string;
  readonly post: Pick<
    BlogPostRecord,
    "title" | "description" | "date" | "updated"
  >;
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

export function resolveBlogPostImageUrl(image: string | null): string | null {
  if (image === null) {
    return null;
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  if (!image.startsWith("/")) {
    throw new Error(
      `Invalid blog image path: ${image}. Use an absolute http(s) URL or a /public asset path.`
    );
  }

  return getAbsoluteUrl(image);
}

export function createBlogPostingStructuredData(
  params: CreateBlogPostingStructuredDataParams
): BlogPostingStructuredData {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: params.post.title,
    description: params.post.description,
    author: ARTICLE_AUTHOR,
    datePublished: params.post.date,
    image: params.imageUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": params.pageUrl,
    },
    publisher: ARTICLE_PUBLISHER,
    url: params.pageUrl,
    inLanguage: getHtmlLang(params.locale),
    ...(params.post.updated === null
      ? {}
      : { dateModified: params.post.updated }),
  };
}
