import type { Metadata } from "next";

const SITE_URL = "https://expense-budget-tracker.com";
const SITE_NAME = "Expense Budget Tracker";
const OPEN_GRAPH_IMAGE_URL = `${SITE_URL}/opengraph-image`;
const TWITTER_IMAGE_URL = `${SITE_URL}/twitter-image`;
const LOCALE = "en_US";

type OpenGraphType = "website" | "article";

interface CreatePageMetadataParams {
  readonly title: string;
  readonly description: string;
  readonly pathname: string;
  readonly markdownPath: string;
  readonly openGraphType: OpenGraphType;
  readonly publishedTime?: string;
}

function getAbsoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString();
}

export function createPageMetadata(
  params: CreatePageMetadataParams
): Metadata {
  const pageUrl = getAbsoluteUrl(params.pathname);
  const markdownUrl = getAbsoluteUrl(params.markdownPath);

  return {
    title: params.title,
    description: params.description,
    alternates: {
      canonical: pageUrl,
      types: { "text/markdown": markdownUrl },
    },
    openGraph: {
      type: params.openGraphType,
      locale: LOCALE,
      siteName: SITE_NAME,
      url: pageUrl,
      title: params.title,
      description: params.description,
      images: [
        {
          url: OPEN_GRAPH_IMAGE_URL,
        },
      ],
      publishedTime: params.publishedTime,
    },
    twitter: {
      card: "summary_large_image",
      title: params.title,
      description: params.description,
      images: [TWITTER_IMAGE_URL],
    },
  };
}
