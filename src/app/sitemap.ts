import type { MetadataRoute } from "next";
import { join } from "path";
import {
  getAlternateBlogIndexLocales,
  getAvailableBlogIndexLocales,
  getAvailableBlogLocales,
  listBlogPosts,
} from "@/lib/blog";
import {
  getBlogFilePath,
  getContentSectionDirectories,
  getDocFilePath,
} from "@/lib/content/contentPaths";
import {
  getAvailableDocIndexLocales,
  getAvailableDocLocales,
  listDocs,
} from "@/lib/docs";
import { type AppLocale } from "@/lib/i18n/config";
import { getAbsoluteUrl, getLocalizedPath } from "@/lib/i18n/routing";
import {
  getAvailableLocalesForMarketingPage,
  getMarketingPageRoutePath,
  getMarketingPageSourcePath,
  MARKETING_PAGE_SLUGS,
} from "@/lib/content/readPageContent";
import {
  getFileLastModified,
  getNewestDirectoryFileLastModified,
} from "@/lib/sitemap/getLastModified";

const APP_DIR = join(process.cwd(), "src/app", "(default)");

function getLanguageAlternates(
  routePath: string,
  locales: ReadonlyArray<AppLocale>
): NonNullable<MetadataRoute.Sitemap[number]["alternates"]> {
  return {
    languages: Object.fromEntries(
      locales.map((locale) => [
        locale,
        getAbsoluteUrl(getLocalizedPath(locale, routePath)),
      ])
    ),
  };
}

function getOptionalAlternates(
  routePath: string,
  locales: ReadonlyArray<AppLocale>
): NonNullable<MetadataRoute.Sitemap[number]["alternates"]> | undefined {
  if (locales.length <= 1) {
    return undefined;
  }

  return getLanguageAlternates(routePath, locales);
}

function getNewestLocaleDirectoryFileLastModified(
  directoryPaths: ReadonlyArray<string>
): Date | null {
  return directoryPaths.reduce<Date | null>((latestDate, directoryPath) => {
    const currentDate = getNewestDirectoryFileLastModified(directoryPath);

    if (currentDate === null) {
      return latestDate;
    }

    if (latestDate === null || currentDate > latestDate) {
      return currentDate;
    }

    return latestDate;
  }, null);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const availableBlogIndexLocales = getAvailableBlogIndexLocales();
  const alternateBlogIndexLocales = getAlternateBlogIndexLocales();
  const availableDocIndexLocales = getAvailableDocIndexLocales();
  const blogPosts = listBlogPosts("en");
  const docs = listDocs("en");
  const newestBlogLastModified = getNewestLocaleDirectoryFileLastModified(
    getContentSectionDirectories("blog")
  );
  const blogIndexLastModified =
    newestBlogLastModified ??
    getFileLastModified(join(APP_DIR, "blog", "page.tsx"));
  const docsIndexLastModified = getNewestLocaleDirectoryFileLastModified(
    getContentSectionDirectories("docs")
  );

  if (docsIndexLastModified === null) {
    throw new Error("Missing docs markdown files for sitemap");
  }

  const marketingEntries: MetadataRoute.Sitemap = MARKETING_PAGE_SLUGS.flatMap(
    (slug) => {
      const availableLocales = getAvailableLocalesForMarketingPage(slug);
      const alternates = getOptionalAlternates(
        getMarketingPageRoutePath(slug),
        availableLocales
      );
      const changeFrequency = slug === "home" ? "weekly" : "monthly";
      const priority =
        slug === "home" ? 1.0 : slug === "features" || slug === "pricing" ? 0.8 : 0.3;

      return availableLocales.map((locale) => ({
        url: getAbsoluteUrl(getLocalizedPath(locale, getMarketingPageRoutePath(slug))),
        lastModified: getFileLastModified(getMarketingPageSourcePath(slug, locale)),
        changeFrequency,
        priority,
        alternates,
      }));
    }
  );

  const staticEntries: MetadataRoute.Sitemap = [
    ...availableBlogIndexLocales.map((locale) => {
      const alternates = alternateBlogIndexLocales.includes(locale)
        ? getOptionalAlternates("/blog/", alternateBlogIndexLocales)
        : undefined;

      return {
        url: getAbsoluteUrl(getLocalizedPath(locale, "/blog/")),
        lastModified: blogIndexLastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates,
      };
    }),
    ...availableDocIndexLocales.map((locale) => ({
      url: getAbsoluteUrl(getLocalizedPath(locale, "/docs/")),
      lastModified: docsIndexLastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: getOptionalAlternates("/docs/", availableDocIndexLocales),
    })),
  ];

  const blogEntries: MetadataRoute.Sitemap = blogPosts.flatMap((post) => {
    const availableLocales = getAvailableBlogLocales(post.slug);
    const alternates = getOptionalAlternates(
      `/blog/${post.slug}/`,
      availableLocales
    );

    return availableLocales.map((locale) => ({
      url: getAbsoluteUrl(getLocalizedPath(locale, `/blog/${post.slug}/`)),
      lastModified: getFileLastModified(getBlogFilePath(post.slug, locale)),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates,
    }));
  });

  const docEntries: MetadataRoute.Sitemap = docs.flatMap((doc) => {
    const availableLocales = getAvailableDocLocales(doc.slug);
    const alternates = getOptionalAlternates(
      `/docs/${doc.slug}/`,
      availableLocales
    );

    return availableLocales.map((locale) => ({
      url: getAbsoluteUrl(getLocalizedPath(locale, `/docs/${doc.slug}/`)),
      lastModified: getFileLastModified(getDocFilePath(doc.slug, locale)),
      changeFrequency: "monthly" as const,
      priority: 0.5,
      alternates,
    }));
  });

  return [...marketingEntries, ...staticEntries, ...blogEntries, ...docEntries];
}
