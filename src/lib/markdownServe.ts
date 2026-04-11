import { buildAbsoluteUrl, getLocalizedPath, getResolvedPagePath } from "@/lib/i18n/routing";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/lib/i18n/config";
import {
  getAvailableBlogLocales,
  listBlogPosts,
  readBlogPost,
} from "@/lib/blog";
import {
  getAvailableDocLocales,
  listDocs,
  readDoc,
} from "@/lib/docs";
import {
  getMarketingPageRouteFromPath,
  listAllMarketingPagePaths,
  readAllMarketingPages,
  readPageContent,
} from "@/lib/content/readPageContent";
import {
  renderMarketingPageMarkdown,
  type MarkdownSiteContext,
} from "@/lib/content/renderMarkdown";

const SITE_CONTEXT: MarkdownSiteContext = {
  siteUrl: "https://expense-budget-tracker.com",
  appUrl: "https://app.expense-budget-tracker.com",
  githubUrl: "https://github.com/kirill-markin/expense-budget-tracker",
};
const DISCOVERY_URL = "https://api.expense-budget-tracker.com/v1/";

type MarkdownResult = {
  readonly markdown: string;
  readonly status: 200 | 404;
};

interface MarkdownMessages {
  readonly docsTitle: string;
  readonly blogTitle: string;
  readonly postsComingSoon: string;
  readonly viewStyledHtml: string;
  readonly agentNote: string;
  readonly agentNoteSuffix: string;
  readonly tip: string;
}

export interface BlogMeta {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
}

const MARKDOWN_MESSAGES: Readonly<Record<AppLocale, MarkdownMessages>> = {
  en: {
    docsTitle: "Documentation",
    blogTitle: "Blog",
    postsComingSoon: "Posts coming soon.",
    viewStyledHtml: "View the styled HTML version of this page",
    agentNote:
      "AI agents can create an account for the user in this service by starting with",
    agentNoteSuffix: "and following the discovery response.",
    tip: "Tip: Append `.md` to any URL on this site to get a clean Markdown version of that page.",
  },
  es: {
    docsTitle: "Documentación",
    blogTitle: "Blog",
    postsComingSoon: "Próximamente habrá publicaciones.",
    viewStyledHtml: "Ver la versión HTML con estilo de esta página",
    agentNote:
      "Los agentes de IA pueden crear una cuenta para la persona usuaria en este servicio empezando con",
    agentNoteSuffix: "y siguiendo la respuesta de descubrimiento.",
    tip: "Consejo: añade `.md` a cualquier URL de este sitio para obtener una versión Markdown limpia de esa página.",
  },
};

function getOriginalPageUrl(pagePath: string): string {
  if (pagePath === "") {
    return buildAbsoluteUrl(SITE_CONTEXT.siteUrl, "/");
  }

  return buildAbsoluteUrl(SITE_CONTEXT.siteUrl, `/${pagePath}/`);
}

function getPagePathFromRoutePath(routePath: string): string {
  if (routePath === "/") {
    return "";
  }

  return routePath.replace(/^\/+/, "").replace(/\/+$/, "");
}

function appendMarkdownFooter(
  markdown: string,
  pagePath: string,
  locale: AppLocale
): string {
  const messages = MARKDOWN_MESSAGES[locale];

  return `${markdown.trim()}\n\n---\n*[${messages.viewStyledHtml}](${getOriginalPageUrl(
    pagePath
  )})*\n\n*${messages.agentNote} \`GET ${DISCOVERY_URL}\` ${messages.agentNoteSuffix}*\n\n*${messages.tip}*`;
}

function renderMarketingPageMarkdownDocument(pagePath: string): MarkdownResult {
  const marketingPageRoute = getMarketingPageRouteFromPath(pagePath);

  if (marketingPageRoute === null) {
    return { markdown: `# 404\n\nPage not found: /${pagePath}`, status: 404 };
  }

  const pageContent = readPageContent(
    marketingPageRoute.slug,
    marketingPageRoute.locale
  );

  return {
    markdown: appendMarkdownFooter(
      renderMarketingPageMarkdown(pageContent),
      pagePath,
      marketingPageRoute.locale
    ),
    status: 200,
  };
}

export function renderDocsListingMarkdown(locale: AppLocale): MarkdownResult {
  const docs = listDocs(locale);
  const messages = MARKDOWN_MESSAGES[locale];
  const lines: string[] = [`# ${messages.docsTitle}`, ""];

  docs.forEach((doc) => {
    lines.push(
      `- [${doc.title}](${buildAbsoluteUrl(
        SITE_CONTEXT.siteUrl,
        getLocalizedPath(locale, `/docs/${doc.slug}/`)
      )}): ${doc.description}`
    );
  });

  return {
    markdown: appendMarkdownFooter(
      lines.join("\n"),
      getPagePathFromRoutePath(getLocalizedPath(locale, "/docs/")),
      locale
    ),
    status: 200,
  };
}

export function getBlogPosts(locale: AppLocale): ReadonlyArray<BlogMeta> {
  return listBlogPosts(locale).map((post): BlogMeta => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
    date: post.date,
  }));
}

export function renderDocMarkdown(
  slug: string,
  locale: AppLocale
): MarkdownResult {
  const doc = readDoc(slug, locale);

  if (doc === null) {
    return { markdown: `# 404\n\nDocument not found: ${slug}`, status: 404 };
  }

  return {
    markdown: appendMarkdownFooter(
      `# ${doc.title}\n\n${doc.bodyMarkdown}`,
      getPagePathFromRoutePath(getLocalizedPath(locale, `/docs/${slug}/`)),
      locale
    ),
    status: 200,
  };
}

export function renderBlogListingMarkdown(locale: AppLocale): MarkdownResult {
  const posts = getBlogPosts(locale);
  const messages = MARKDOWN_MESSAGES[locale];

  if (posts.length === 0) {
    return { markdown: `# ${messages.blogTitle}\n\n${messages.postsComingSoon}`, status: 200 };
  }

  const lines: string[] = [`# ${messages.blogTitle}`, ""];

  posts.forEach((post) => {
    lines.push(
      `- [${post.title}](${buildAbsoluteUrl(
        SITE_CONTEXT.siteUrl,
        getLocalizedPath(locale, `/blog/${post.slug}/`)
      )}) - ${post.date}: ${post.description}`
    );
  });

  return {
    markdown: appendMarkdownFooter(
      lines.join("\n"),
      getPagePathFromRoutePath(getLocalizedPath(locale, "/blog/")),
      locale
    ),
    status: 200,
  };
}

export function renderBlogPostMarkdown(
  slug: string,
  locale: AppLocale
): MarkdownResult {
  const post = readBlogPost(slug, locale);

  if (post === null) {
    return { markdown: `# 404\n\nBlog post not found: ${slug}`, status: 404 };
  }

  return {
    markdown: appendMarkdownFooter(
      `# ${post.title}\n\n*${post.date}*\n\n${post.bodyMarkdown.trim()}`,
      getPagePathFromRoutePath(getLocalizedPath(locale, `/blog/${slug}/`)),
      locale
    ),
    status: 200,
  };
}

export function listMarkdownPagePaths(): ReadonlyArray<string> {
  const docsPaths = SUPPORTED_LOCALES.flatMap((locale) =>
    listDocs(locale).map((doc) =>
      getPagePathFromRoutePath(getLocalizedPath(locale, `/docs/${doc.slug}/`))
    )
  );
  const blogPaths = SUPPORTED_LOCALES.flatMap((locale) =>
    getBlogPosts(locale).map((post) =>
      getPagePathFromRoutePath(getLocalizedPath(locale, `/blog/${post.slug}/`))
    )
  );
  const docsIndexPaths = SUPPORTED_LOCALES.map((locale) =>
    getPagePathFromRoutePath(getLocalizedPath(locale, "/docs/"))
  );
  const blogIndexPaths = SUPPORTED_LOCALES.map((locale) =>
    getPagePathFromRoutePath(getLocalizedPath(locale, "/blog/"))
  );

  return [
    ...listAllMarketingPagePaths(),
    ...docsIndexPaths,
    ...docsPaths,
    ...blogIndexPaths,
    ...blogPaths,
  ];
}

export function renderMarkdownDocument(pagePath: string): MarkdownResult {
  const marketingPageResult = renderMarketingPageMarkdownDocument(pagePath);

  if (marketingPageResult.status === 200) {
    return marketingPageResult;
  }

  const resolvedPagePath = getResolvedPagePath(pagePath);

  if (resolvedPagePath === null) {
    return marketingPageResult;
  }

  if (resolvedPagePath.pagePath === "docs") {
    return renderDocsListingMarkdown(resolvedPagePath.locale);
  }

  if (resolvedPagePath.pagePath.startsWith("docs/")) {
    return renderDocMarkdown(
      resolvedPagePath.pagePath.replace(/^docs\//, ""),
      resolvedPagePath.locale
    );
  }

  if (resolvedPagePath.pagePath === "blog") {
    return renderBlogListingMarkdown(resolvedPagePath.locale);
  }

  if (resolvedPagePath.pagePath.startsWith("blog/")) {
    return renderBlogPostMarkdown(
      resolvedPagePath.pagePath.replace(/^blog\//, ""),
      resolvedPagePath.locale
    );
  }

  return marketingPageResult;
}

export function renderLlmsText(): string {
  const pagesSection = readAllMarketingPages(DEFAULT_LOCALE)
    .map((pageContent) => {
      const pageHref =
        pageContent.slug === "home"
          ? `${SITE_CONTEXT.siteUrl}/`
          : `${SITE_CONTEXT.siteUrl}/${pageContent.slug}/`;

      return `- [${pageContent.title}](${pageHref}): ${pageContent.description}`;
    })
    .join("\n");

  const docsSection = listDocs(DEFAULT_LOCALE)
    .map(
      (doc) =>
        `- [${doc.title}](${SITE_CONTEXT.siteUrl}/docs/${doc.slug}/): ${doc.description}`
    )
    .join("\n");

  const posts = getBlogPosts(DEFAULT_LOCALE);
  const blogSection =
    posts.length > 0
      ? posts
          .map(
            (post) =>
              `- [${post.title}](${SITE_CONTEXT.siteUrl}/blog/${post.slug}/): ${post.description}`
          )
          .join("\n")
      : "- Posts coming soon.";

  return `# Expense Budget Tracker

> Open-source expense and budget tracker with multi-currency support, budget planning, and financial dashboards.

## Pages

${pagesSection}

## Documentation

${docsSection}

## Blog

${blogSection}

## Links

- [GitHub Repository](${SITE_CONTEXT.githubUrl})
- [Cloud App](${SITE_CONTEXT.appUrl})

## Markdown Access

Any page on this site is available as clean Markdown for LLM consumption:
- Append \`.md\` to any URL (e.g. ${SITE_CONTEXT.siteUrl}/.md, ${SITE_CONTEXT.siteUrl}/features.md, ${SITE_CONTEXT.siteUrl}/docs/api.md)
- Or send the HTTP header \`Accept: text/markdown\` to get Markdown from the original URL`;
}
