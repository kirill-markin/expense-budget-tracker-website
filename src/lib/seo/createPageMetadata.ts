import type { Metadata } from "next";
import {
  SITE_NAME,
  type AppLocale,
} from "@/lib/i18n/config";
import {
  getAbsoluteUrl,
  getLocalizedPath,
} from "@/lib/i18n/routing";
import {
  getMarkdownRoutePathname,
  getPagePathFromHtmlPathname,
} from "@/lib/markdownAssetPaths";
import { getOpenGraphLocale } from "@/lib/i18n/config";
import { getLanguageAlternates } from "@/lib/seo/getLanguageAlternates";

const OPEN_GRAPH_IMAGE_URL = getAbsoluteUrl("/opengraph-image");
const TWITTER_IMAGE_URL = getAbsoluteUrl("/twitter-image");

type OpenGraphType = "website" | "article";

interface CreatePageMetadataParams {
  readonly title: string;
  readonly description: string;
  readonly locale: AppLocale;
  readonly routePath: string;
  readonly openGraphType: OpenGraphType;
  readonly availableLocales: ReadonlyArray<AppLocale>;
  readonly publishedTime?: string;
  readonly modifiedTime?: string;
  readonly imageUrl?: string;
}

function getMarkdownAlternateUrl(
  locale: AppLocale,
  routePath: string
): string {
  const localizedRoutePath = getLocalizedPath(locale, routePath);
  const pagePath = getPagePathFromHtmlPathname(localizedRoutePath);

  return getAbsoluteUrl(getMarkdownRoutePathname(pagePath));
}

export function createPageMetadata(
  params: CreatePageMetadataParams
): Metadata {
  const pageUrl = getAbsoluteUrl(
    getLocalizedPath(params.locale, params.routePath)
  );
  const markdownUrl = getMarkdownAlternateUrl(params.locale, params.routePath);
  const browserTitle: Metadata["title"] =
    params.routePath === "/" ? { absolute: params.title } : params.title;
  const socialTitle =
    params.routePath === "/" ? params.title : `${params.title} | ${SITE_NAME}`;
  const languageAlternates = getLanguageAlternates(
    params.routePath,
    params.availableLocales
  );
  const alternates: NonNullable<Metadata["alternates"]> = {
    canonical: pageUrl,
    types: { "text/markdown": markdownUrl },
  };

  if (languageAlternates !== undefined) {
    alternates.languages = languageAlternates;
  }

  const socialImageUrl = params.imageUrl ?? OPEN_GRAPH_IMAGE_URL;
  const twitterImageUrl = params.imageUrl ?? TWITTER_IMAGE_URL;

  return {
    title: browserTitle,
    description: params.description,
    alternates,
    openGraph: {
      type: params.openGraphType,
      locale: getOpenGraphLocale(params.locale),
      siteName: SITE_NAME,
      url: pageUrl,
      title: socialTitle,
      description: params.description,
      images: [
        {
          url: socialImageUrl,
        },
      ],
      publishedTime: params.publishedTime,
      modifiedTime: params.modifiedTime,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: params.description,
      images: [twitterImageUrl],
    },
  };
}

export function getDefaultOpenGraphImageUrl(): string {
  return OPEN_GRAPH_IMAGE_URL;
}
