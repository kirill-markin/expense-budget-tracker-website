import type { Metadata } from "next";
import {
  SITE_NAME,
  type AppLocale,
} from "@/lib/i18n/config";
import {
  getAbsoluteUrl,
  getLocalizedPath,
} from "@/lib/i18n/routing";
import { getOpenGraphLocale } from "@/lib/i18n/config";

const OPEN_GRAPH_IMAGE_URL = getAbsoluteUrl("/opengraph-image");
const TWITTER_IMAGE_URL = getAbsoluteUrl("/twitter-image");

type OpenGraphType = "website" | "article";

interface CreatePageMetadataParams {
  readonly title: string;
  readonly description: string;
  readonly locale: AppLocale;
  readonly routePath: string;
  readonly markdownRoutePath: string;
  readonly openGraphType: OpenGraphType;
  readonly availableLocales: ReadonlyArray<AppLocale>;
  readonly publishedTime?: string;
}

function getLanguageAlternates(
  routePath: string,
  availableLocales: ReadonlyArray<AppLocale>
): Record<string, string> {
  if (availableLocales.length <= 1) {
    return {};
  }

  const alternates = Object.fromEntries(
    availableLocales.map((locale) => [
      locale,
      getAbsoluteUrl(getLocalizedPath(locale, routePath)),
    ])
  );

  return {
    ...alternates,
    "x-default": getAbsoluteUrl(getLocalizedPath("en", routePath)),
  };
}

function getMarkdownAlternateUrl(
  locale: AppLocale,
  routePath: string,
  markdownRoutePath: string
): string {
  if (routePath === "/") {
    const pageUrl = getAbsoluteUrl(getLocalizedPath(locale, routePath));

    return new URL(".md", pageUrl).toString();
  }

  return getAbsoluteUrl(getLocalizedPath(locale, markdownRoutePath));
}

export function createPageMetadata(
  params: CreatePageMetadataParams
): Metadata {
  const pageUrl = getAbsoluteUrl(
    getLocalizedPath(params.locale, params.routePath)
  );
  const markdownUrl = getMarkdownAlternateUrl(
    params.locale,
    params.routePath,
    params.markdownRoutePath
  );
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

  if (Object.keys(languageAlternates).length > 0) {
    alternates.languages = languageAlternates;
  }

  return {
    title: params.title,
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
          url: OPEN_GRAPH_IMAGE_URL,
        },
      ],
      publishedTime: params.publishedTime,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description: params.description,
      images: [TWITTER_IMAGE_URL],
    },
  };
}
