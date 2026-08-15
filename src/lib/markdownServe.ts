import { buildAbsoluteUrl, getLocalizedPath, getResolvedPagePath } from "@/lib/i18n/routing";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type AppLocale,
} from "@/lib/i18n/config";
import {
  getAvailableBlogIndexLocales,
  getAvailableBlogLocales,
  listBlogPosts,
  readBlogPost,
} from "@/lib/blog";
import {
  getAvailableDocIndexLocales,
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
const MCP_URL = "https://mcp.expense-budget-tracker.com/mcp";

type MarkdownResult = {
  readonly markdown: string;
  readonly status: 200 | 404;
};

interface MarkdownMessages {
  readonly docsTitle: string;
  readonly blogTitle: string;
  readonly postsComingSoon: string;
  readonly viewStyledHtml: string;
  readonly mcpNote: string;
  readonly mcpNoteSuffix: string;
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
    mcpNote: "OAuth-capable remote MCP clients can connect at",
    mcpNoteSuffix:
      "with OAuth Bearer access. The required scope is `expenses:read`. A client can also request the optional `expenses:write` scope; it appears on the OAuth consent screen and is required for mutations.",
    agentNote:
      "CLI and direct HTTP agents can use the separate Agent API by starting with",
    agentNoteSuffix:
      "and following the discovery response to obtain an ApiKey.",
    tip: "Tip: Append `.md` to any URL on this site to get a clean Markdown version of that page.",
  },
  es: {
    docsTitle: "Documentación",
    blogTitle: "Blog",
    postsComingSoon: "Próximamente habrá publicaciones.",
    viewStyledHtml: "Ver la versión HTML con estilo de esta página",
    mcpNote: "Los clientes MCP remotos compatibles con OAuth pueden conectarse a",
    mcpNoteSuffix:
      "con acceso OAuth Bearer. El permiso obligatorio es `expenses:read`. El cliente también puede solicitar el permiso opcional `expenses:write`; aparece en la pantalla de consentimiento OAuth y es necesario para modificar datos.",
    agentNote:
      "Los agentes de CLI y HTTP directo pueden usar la API para agentes independiente empezando con",
    agentNoteSuffix:
      "y siguiendo la respuesta de descubrimiento para obtener una ApiKey.",
    tip: "Consejo: añade `.md` a cualquier URL de este sitio para obtener una versión Markdown limpia de esa página.",
  },
  ru: {
    docsTitle: "Документация",
    blogTitle: "Блог",
    postsComingSoon: "Публикации скоро появятся.",
    viewStyledHtml: "Открыть HTML-версию этой страницы",
    mcpNote: "Удаленные MCP-клиенты с поддержкой OAuth могут подключиться к",
    mcpNoteSuffix:
      "с доступом OAuth Bearer. Обязательное разрешение — `expenses:read`. Клиент также может запросить необязательное разрешение `expenses:write`: оно отображается на экране согласия OAuth и требуется для изменения данных.",
    agentNote:
      "Агенты командной строки и прямых HTTP-запросов могут использовать отдельный Agent API, начав с",
    agentNoteSuffix:
      "и следуя ответу сервиса обнаружения, чтобы получить ApiKey.",
    tip: "Подсказка: добавьте `.md` к любому URL этого сайта, чтобы получить чистую Markdown-версию страницы.",
  },
  uk: {
    docsTitle: "Документація",
    blogTitle: "Блог",
    postsComingSoon: "Публікації незабаром з’являться.",
    viewStyledHtml: "Переглянути HTML-версію цієї сторінки",
    mcpNote: "Віддалені MCP-клієнти з підтримкою OAuth можуть підключитися до",
    mcpNoteSuffix:
      "з доступом OAuth Bearer. Обов’язковий дозвіл — `expenses:read`. Клієнт також може запитати необов’язковий дозвіл `expenses:write`: він відображається на екрані згоди OAuth і потрібен для зміни даних.",
    agentNote:
      "Агенти командного рядка та прямих HTTP-запитів можуть використовувати окремий Agent API, почавши з",
    agentNoteSuffix:
      "і дотримуючись відповіді документа виявлення, щоб отримати ApiKey.",
    tip: "Порада: додайте `.md` до будь-якої адреси цього сайту, щоб отримати чисту Markdown-версію сторінки.",
  },
  fa: {
    docsTitle: "مستندات",
    blogTitle: "وبلاگ",
    postsComingSoon: "مطلب‌ها به‌زودی منتشر می‌شوند.",
    viewStyledHtml: "نسخه HTML این صفحه را ببینید",
    mcpNote: "کلاینت‌های راه‌دور MCP سازگار با OAuth می‌توانند به این نشانی متصل شوند",
    mcpNoteSuffix:
      "با دسترسی OAuth Bearer. مجوز الزامی `expenses:read` است. کلاینت همچنین می‌تواند مجوز اختیاری `expenses:write` را درخواست کند؛ این مجوز در صفحه رضایت OAuth نمایش داده می‌شود و برای تغییر داده‌ها لازم است.",
    agentNote:
      "ایجنت‌های خط فرمان و HTTP مستقیم می‌توانند با شروع از این نشانی از Agent API جداگانه استفاده کنند",
    agentNoteSuffix:
      "و برای دریافت ApiKey پاسخ شناسایی سرویس را دنبال کنند.",
    tip: "نکته: برای دریافت نسخه Markdown تمیز هر صفحه، `.md` را به هر آدرس این سایت اضافه کنید.",
  },
  zh: {
    docsTitle: "文档",
    blogTitle: "博客",
    postsComingSoon: "文章即将发布。",
    viewStyledHtml: "查看此页面的 HTML 样式版本",
    mcpNote: "支持 OAuth 的远程 MCP 客户端可连接",
    mcpNoteSuffix:
      "并使用 OAuth Bearer 访问。必需权限为 `expenses:read`。客户端还可请求可选的 `expenses:write` 权限；该权限会显示在 OAuth 同意屏幕上，修改数据时必须具备。",
    agentNote:
      "命令行和直接使用 HTTP 的智能体可从以下地址开始使用独立的 Agent API",
    agentNoteSuffix: "并按照发现响应获取 ApiKey。",
    tip: "提示：在本站任意 URL 后追加 `.md`，即可获得该页面的纯 Markdown 版本。",
  },
  ar: {
    docsTitle: "التوثيق",
    blogTitle: "المدونة",
    postsComingSoon: "ستتوفر المقالات قريبًا.",
    viewStyledHtml: "عرض نسخة HTML المنسقة من هذه الصفحة",
    mcpNote: "يمكن لعملاء MCP البعيدين الذين يدعمون OAuth الاتصال بـ",
    mcpNoteSuffix:
      "باستخدام وصول OAuth Bearer. النطاق الإلزامي هو `expenses:read`. ويمكن للعميل أيضًا طلب النطاق الاختياري `expenses:write`؛ ويظهر في شاشة موافقة OAuth ويلزم لإجراء التعديلات.",
    agentNote:
      "يمكن للوكلاء عبر سطر الأوامر وHTTP المباشر استخدام Agent API المنفصل بدءًا من",
    agentNoteSuffix: "واتباع استجابة الاكتشاف للحصول على ApiKey.",
    tip: "تلميح: أضف `.md` إلى أي رابط في هذا الموقع للحصول على نسخة Markdown نظيفة من الصفحة.",
  },
  he: {
    docsTitle: "תיעוד",
    blogTitle: "בלוג",
    postsComingSoon: "פוסטים יפורסמו בקרוב.",
    viewStyledHtml: "לצפייה בגרסת ה-HTML המעוצבת של העמוד",
    mcpNote: "לקוחות MCP מרוחקים שתומכים ב-OAuth יכולים להתחבר אל",
    mcpNoteSuffix:
      "עם גישת OAuth Bearer. ההרשאה הנדרשת היא `expenses:read`. הלקוח יכול לבקש גם את ההרשאה האופציונלית `expenses:write`; היא מוצגת במסך ההסכמה של OAuth ונדרשת לביצוע שינויים.",
    agentNote:
      "סוכני שורת פקודה ו-HTTP ישיר יכולים להשתמש ב-Agent API הנפרד על ידי התחלה מ-",
    agentNoteSuffix: "והמשך לפי תגובת הגילוי כדי לקבל ApiKey.",
    tip: "טיפ: הוסיפו `.md` לכל כתובת באתר כדי לקבל גרסת Markdown נקייה של העמוד.",
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
  )})*\n\n*${messages.mcpNote} \`${MCP_URL}\` ${messages.mcpNoteSuffix}*\n\n*${messages.agentNote} \`GET ${DISCOVERY_URL}\` ${messages.agentNoteSuffix}*\n\n*${messages.tip}*`;
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
  const docsIndexPaths = getAvailableDocIndexLocales().map((locale) =>
    getPagePathFromRoutePath(getLocalizedPath(locale, "/docs/"))
  );
  const blogIndexPaths = getAvailableBlogIndexLocales().map((locale) =>
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
- [Hosted MCP Server](${MCP_URL}): OAuth Bearer access for remote MCP clients; requires \`expenses:read\`. A client can also request optional \`expenses:write\`; it appears on the OAuth consent screen and is required for mutations
- [Agent API Discovery](${DISCOVERY_URL}): Separate ApiKey onboarding for CLI and direct HTTP agents

## Markdown Access

Any page on this site is available as clean Markdown for LLM consumption:
- Append \`.md\` to any URL (e.g. ${SITE_CONTEXT.siteUrl}/.md, ${SITE_CONTEXT.siteUrl}/features.md, ${SITE_CONTEXT.siteUrl}/docs/api.md)
- Or send the HTTP header \`Accept: text/markdown\` to get Markdown from the original URL`;
}
