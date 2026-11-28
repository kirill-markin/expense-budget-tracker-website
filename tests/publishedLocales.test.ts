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
  getLocaleLabel,
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
const EXPANSION_DOCS = [...CORE_DOCS, "self-hosting", "api", "architecture"] as const;
const EXPANSION_LOCALES: ReadonlyArray<AppLocale> = [
  "de", "fr", "id", "it", "ja", "ko", "pl", "pt-br", "tr", "vi", "zh-hant",
];
const EXPANSION_BLOG_SLUGS = [
  "how-to-budget-for-school-lunches",
  "how-to-track-expenses-and-manage-your-budget-with-claude-code",
  "quicken-alternative",
];

test("locale metadata uses canonical language tags and stable public paths", () => {
  const hreflangTags = SUPPORTED_LOCALES.map((locale) => {
    const tag = getLanguageTag(locale);
    assert.deepEqual(Intl.getCanonicalLocales(tag), [tag], `Noncanonical language tag for ${locale}`);
    assert.equal(getHreflang(locale), tag, `Wrong hreflang for ${locale}`);
    return tag.toLowerCase();
  });
  assert.equal(new Set(hreflangTags).size, hreflangTags.length, "Two locales use the same hreflang");

  assert.equal(getLanguageTag("zh"), "zh-Hans");
  assert.equal(getLanguageTag("zh-hant"), "zh-Hant");
  assert.equal(getLanguageTag("pt-br"), "pt-BR");
  assert.notEqual(getLocaleLabel("zh"), getLocaleLabel("zh-hant"));
  assert.equal(getTextDirection("ar"), "rtl");
  assert.equal(getLocalizedPath("en", "/"), "/");
  assert.equal(getLocalizedPath("es", "/"), "/es/");
  assert.deepEqual(getResolvedPagePath("/zh/"), { locale: "zh", pagePath: "" });
  assert.deepEqual(getResolvedPagePath("/zh-hant/"), { locale: "zh-hant", pagePath: "" });
  assert.deepEqual(getResolvedPagePath("/pt-br/"), { locale: "pt-br", pagePath: "" });
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

test("registered locales publish core pages and the expansion publishes all six guides", () => {
  for (const slug of MARKETING_PAGE_SLUGS) {
    const availableLocales = getAvailableLocalesForMarketingPage(slug);
    for (const locale of SUPPORTED_LOCALES) {
      assert.ok(availableLocales.includes(locale), `Missing ${locale} ${slug} page`);
      assert.equal(readPageContent(slug, locale).locale, locale);
    }
  }

  const markdownPaths = new Set(listMarkdownPagePaths());
  for (const locale of SUPPORTED_LOCALES) {
    const guides = EXPANSION_LOCALES.includes(locale) ? EXPANSION_DOCS : CORE_DOCS;
    for (const slug of guides) {
      assert.ok(getAvailableDocLocales(slug).includes(locale), `Missing ${locale} ${slug} guide`);
    }

    const routes = [
      ...MARKETING_PAGE_SLUGS.map(getMarketingPageRoutePath),
      "/docs/",
      ...guides.map((slug) => `/docs/${slug}/`),
    ];
    for (const route of routes) {
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

test("new locales publish the three selected blog families", () => {
  for (const locale of EXPANSION_LOCALES) {
    assert.deepEqual(listBlogPosts(locale).map(({ slug }) => slug).sort(), EXPANSION_BLOG_SLUGS, locale);

    for (const route of ["/blog/", ...EXPANSION_BLOG_SLUGS.map((slug) => `/blog/${slug}/`)]) {
      const path = getLocalizedPath(locale, route);
      const { status, markdown } = renderMarkdownDocument(getPagePathFromHtmlPathname(path));
      assert.equal(status, 200, path);
      assert.ok(markdown.includes(`](${getAbsoluteUrl(path)})`), `Markdown footer must link back to ${path}`);
    }
  }
});

test("HTML metadata, sitemap and Markdown use the same published routes", () => {
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

  for (const [pagePath, translations] of urlsByPagePath) {
    const routePath = pagePath === "" ? "/" : `/${pagePath}/`;
    const expectedAlternates = translations.size > 1
      ? Object.fromEntries([...translations].map(([locale, url]) => [getHreflang(locale), url]))
      : undefined;
    const defaultUrl = translations.get(DEFAULT_LOCALE);
    if (expectedAlternates !== undefined && defaultUrl !== undefined) {
      expectedAlternates["x-default"] = defaultUrl;
    }

    for (const [locale, url] of translations) {
      assert.deepEqual(byUrl.get(url)?.alternates?.languages, expectedAlternates, `Incorrect sitemap alternates for ${url}`);
      const { alternates } = createPageMetadata({
        title: routePath,
        description: routePath,
        locale,
        routePath,
        openGraphType: "website",
        availableLocales: [...translations.keys()],
      });
      assert.equal(alternates?.canonical, url, `Incorrect canonical for ${url}`);
      assert.deepEqual(alternates?.languages, expectedAlternates, `Incorrect HTML alternates for ${url}`);

      const markdownPath = getPagePathFromHtmlPathname(new URL(url).pathname);
      assert.deepEqual(
        alternates?.types,
        { "text/markdown": `${SITE_URL}/${markdownPath || "home"}.md` },
        `Incorrect HTML Markdown alternate for ${url}`
      );
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
