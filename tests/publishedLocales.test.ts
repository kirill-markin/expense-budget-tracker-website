import assert from "node:assert/strict";
import { test } from "node:test";
import sitemap from "@/app/sitemap";
import { listBlogPosts, readBlogPost } from "@/lib/blog";
import {
  getAvailableLocalesForMarketingPage,
  getMarketingPageRoutePath,
  MARKETING_PAGE_SLUGS,
  readPageContent,
} from "@/lib/content/readPageContent";
import { getAvailableDocLocales } from "@/lib/docs";
import {
  DEFAULT_LOCALE,
  getHreflang,
  getLanguageTag,
  getTextDirection,
  SITE_URL,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/lib/i18n/config";
import { getAbsoluteUrl, getLocalizedPath, getResolvedPagePath } from "@/lib/i18n/routing";
import { getPagePathFromHtmlPathname } from "@/lib/markdownAssetPaths";
import { listMarkdownPagePaths, renderMarkdownDocument } from "@/lib/markdownServe";
import { createPageMetadata } from "@/lib/seo/createPageMetadata";
import { getLanguageAlternates } from "@/lib/seo/getLanguageAlternates";

const CORE_DOCS = ["getting-started", "agent-setup", "mcp-connector"] as const;

test("locale metadata uses canonical language tags and stable public paths", () => {
  const hreflangTags = SUPPORTED_LOCALES.map((locale) => {
    const tag = getLanguageTag(locale);
    assert.deepEqual(Intl.getCanonicalLocales(tag), [tag], `Noncanonical language tag for ${locale}`);
    return getHreflang(locale).toLowerCase();
  });
  assert.equal(new Set(hreflangTags).size, hreflangTags.length, "Two locales use the same hreflang");

  assert.equal(getLanguageTag("zh"), "zh-Hans");
  assert.equal(getTextDirection("ar"), "rtl");
  assert.equal(getLocalizedPath("en", "/"), "/");
  assert.equal(getLocalizedPath("es", "/"), "/es/");
  assert.deepEqual(getResolvedPagePath("/zh/"), { locale: "zh", pagePath: "" });
  assert.equal(getResolvedPagePath("/en/"), null);

  const metadata = createPageMetadata({
    title: "Expense Budget Tracker",
    description: "Expense tracking",
    locale: "zh",
    routePath: "/",
    openGraphType: "website",
    availableLocales: ["en", "es", "zh"],
  });
  assert.deepEqual(metadata.alternates, {
    canonical: `${SITE_URL}/zh/`,
    languages: {
      en: `${SITE_URL}/`,
      es: `${SITE_URL}/es/`,
      "zh-Hans": `${SITE_URL}/zh/`,
      "x-default": `${SITE_URL}/`,
    },
    types: { "text/markdown": `${SITE_URL}/zh.md` },
  });
  assert.equal(metadata.openGraph?.locale, "zh_CN");
  assert.deepEqual(getLanguageAlternates("/docs/api/", ["es", "zh"]), {
    es: `${SITE_URL}/es/docs/api/`,
    "zh-Hans": `${SITE_URL}/zh/docs/api/`,
  });
  assert.equal(getLanguageAlternates("/docs/api/", ["en"]), undefined);
});

test("every registered locale publishes the six core pages and three onboarding guides", () => {
  for (const slug of MARKETING_PAGE_SLUGS) {
    const availableLocales = getAvailableLocalesForMarketingPage(slug);
    for (const locale of SUPPORTED_LOCALES) {
      assert.ok(availableLocales.includes(locale), `Missing ${locale} ${slug} page`);
      assert.equal(readPageContent(slug, locale).locale, locale);
    }
  }

  for (const slug of CORE_DOCS) {
    const availableLocales = getAvailableDocLocales(slug);
    for (const locale of SUPPORTED_LOCALES) {
      assert.ok(availableLocales.includes(locale), `Missing ${locale} ${slug} guide`);
    }
  }

  const coreRoutes = [
    ...MARKETING_PAGE_SLUGS.map(getMarketingPageRoutePath),
    ...CORE_DOCS.map((slug) => `/docs/${slug}/`),
  ];
  const markdownPaths = new Set(listMarkdownPagePaths());

  for (const locale of SUPPORTED_LOCALES) {
    for (const route of coreRoutes) {
      const pagePath = getPagePathFromHtmlPathname(getLocalizedPath(locale, route));
      assert.ok(markdownPaths.has(pagePath), `Missing Markdown route for /${pagePath}`);
      const document = renderMarkdownDocument(pagePath);
      assert.equal(document.status, 200, `Failed to render Markdown for /${pagePath}`);
      for (const [, guidePath] of document.markdown.matchAll(/\]\((\/(?:[a-z\d-]+\/)?docs\/[a-z\d-]+\/)[#)]/gi)) {
        const guidePage = getPagePathFromHtmlPathname(guidePath);
        assert.ok(markdownPaths.has(guidePage), `/${pagePath} links to unpublished guide ${guidePath}. Use its English URL when the translation is missing.`);
      }
    }
  }
});

test("the sitemap and Markdown publish the same pages with complete sitemap alternates", () => {
  const entries = sitemap();
  const byUrl = new Map(entries.map((entry) => [entry.url, entry]));
  const markdownPaths = listMarkdownPagePaths();
  const markdownUrls = new Set(markdownPaths.map((path) => getAbsoluteUrl(path === "" ? "/" : `/${path}/`)));
  assert.equal(markdownUrls.size, markdownPaths.length, "Duplicate Markdown routes");
  assert.equal(byUrl.size, entries.length, "Duplicate sitemap routes");
  assert.deepEqual(new Set(byUrl.keys()), markdownUrls);

  const urlsByPagePath = new Map<string, Map<AppLocale, string>>();
  for (const url of markdownUrls) {
    const resolved = getResolvedPagePath(new URL(url).pathname);
    assert.ok(resolved, `Invalid route ${url}`);
    const translations = urlsByPagePath.get(resolved.pagePath) ?? new Map<AppLocale, string>();
    translations.set(resolved.locale, url);
    urlsByPagePath.set(resolved.pagePath, translations);
  }

  for (const translations of urlsByPagePath.values()) {
    const expectedAlternates = translations.size > 1
      ? Object.fromEntries([...translations].map(([locale, url]) => [getHreflang(locale), url]))
      : undefined;
    const defaultUrl = translations.get(DEFAULT_LOCALE);
    if (expectedAlternates !== undefined && defaultUrl !== undefined) {
      expectedAlternates["x-default"] = defaultUrl;
    }

    for (const url of translations.values()) {
      assert.deepEqual(byUrl.get(url)?.alternates?.languages, expectedAlternates, `Incorrect alternates for ${url}`);
    }
  }

  for (const { slug } of listBlogPosts("en")) {
    for (const locale of SUPPORTED_LOCALES) {
      if (readBlogPost(slug, locale) !== null) {
        continue;
      }

      const path = getLocalizedPath(locale, `/blog/${slug}/`);
      assert.equal(byUrl.has(getAbsoluteUrl(path)), false, `Unexpected alternate page ${path}`);
      assert.equal(renderMarkdownDocument(getPagePathFromHtmlPathname(path)).status, 404, `Unexpected Markdown for ${path}`);
    }
  }
});
