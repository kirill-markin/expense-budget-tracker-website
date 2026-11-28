import { buildAbsoluteUrl, getLocalizedPath, getResolvedPagePath } from "@/lib/i18n/routing";
import { getAppUrl } from "@/lib/auth";
import { resolveMarkdownProductLinks } from "@/lib/content/resolveMarkdownProductLinks";
import { resolveMarkdownMedia } from "@/lib/content/resolveMarkdownMedia";
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
    viewStyledHtml: "לצפייה בגרסת ה-HTML המעוצבת של העמוד",
    mcpNote: "לקוחות MCP מרוחקים שתומכים ב-OAuth יכולים להתחבר אל",
    mcpNoteSuffix:
      "עם גישת OAuth Bearer. ההרשאה הנדרשת היא `expenses:read`. הלקוח יכול לבקש גם את ההרשאה האופציונלית `expenses:write`; היא מוצגת במסך ההסכמה של OAuth ונדרשת לביצוע שינויים.",
    agentNote:
      "סוכני שורת פקודה ו-HTTP ישיר יכולים להשתמש ב-Agent API הנפרד על ידי התחלה מ-",
    agentNoteSuffix: "והמשך לפי תגובת הגילוי כדי לקבל ApiKey.",
    tip: "טיפ: הוסיפו `.md` לכל כתובת באתר כדי לקבל גרסת Markdown נקייה של העמוד.",
  },
  de: {
    docsTitle: "Dokumentation",
    blogTitle: "Blog",
    viewStyledHtml: "Formatierte HTML-Version dieser Seite ansehen",
    mcpNote: "Entfernte MCP-Clients mit OAuth-Unterstützung können sich über",
    mcpNoteSuffix:
      "mit OAuth-Bearer-Zugriff verbinden. Der erforderliche Geltungsbereich ist `expenses:read`. Der Client kann zusätzlich `expenses:write` anfordern. Diese optionale Berechtigung erscheint auf der OAuth-Einwilligungsseite und ist für Datenänderungen erforderlich.",
    agentNote:
      "CLI-Agenten und Agenten mit direkten HTTP-Anfragen können die separate Agent-API nutzen. Beginne mit",
    agentNoteSuffix: "und folge der Discovery-Antwort, um einen ApiKey zu erhalten.",
    tip: "Tipp: Hänge `.md` an eine URL dieser Website an, um die Seite als Markdown abzurufen.",
  },
  fr: {
    docsTitle: "Documentation",
    blogTitle: "Blog",
    viewStyledHtml: "Consulter la version HTML mise en forme de cette page",
    mcpNote: "Les clients MCP distants compatibles avec OAuth peuvent se connecter à",
    mcpNoteSuffix:
      "avec un jeton Bearer OAuth. La portée `expenses:read` est obligatoire. Le client peut aussi demander la portée facultative `expenses:write`, qui s’affiche sur l’écran de consentement OAuth et est nécessaire pour modifier les données.",
    agentNote:
      "Les agents en ligne de commande ou ceux qui envoient des requêtes HTTP directes peuvent utiliser l’API distincte pour agents en commençant par",
    agentNoteSuffix: "puis en suivant la réponse de découverte pour obtenir une ApiKey.",
    tip: "Astuce : ajoutez `.md` à une URL de ce site pour consulter la page au format Markdown.",
  },
  id: {
    docsTitle: "Dokumentasi",
    blogTitle: "Blog",
    viewStyledHtml: "Lihat versi HTML halaman ini",
    mcpNote: "Klien MCP jarak jauh yang mendukung OAuth dapat terhubung ke",
    mcpNoteSuffix:
      "dengan token Bearer OAuth. Cakupan `expenses:read` wajib. Klien juga dapat meminta cakupan opsional `expenses:write`, yang ditampilkan di layar persetujuan OAuth dan diperlukan untuk mengubah data.",
    agentNote:
      "Agen CLI dan agen yang mengirim permintaan HTTP langsung dapat memakai API agen yang terpisah, dimulai dengan",
    agentNoteSuffix: "lalu mengikuti respons penemuan untuk mendapatkan ApiKey.",
    tip: "Tips: tambahkan `.md` ke URL di situs ini untuk membuka halaman dalam format Markdown.",
  },
  it: {
    docsTitle: "Documentazione",
    blogTitle: "Blog",
    viewStyledHtml: "Visualizza la versione HTML impaginata di questa pagina",
    mcpNote: "I client MCP remoti che supportano OAuth possono collegarsi a",
    mcpNoteSuffix:
      "con un token Bearer OAuth. L’ambito `expenses:read` è obbligatorio. Il client può richiedere anche l’ambito facoltativo `expenses:write`, che compare nella schermata di consenso OAuth ed è necessario per modificare i dati.",
    agentNote:
      "Gli agenti da riga di comando e quelli che effettuano richieste HTTP dirette possono usare l’API separata per agenti partendo da",
    agentNoteSuffix: "e seguendo la risposta di discovery per ottenere una ApiKey.",
    tip: "Suggerimento: aggiungi `.md` a un URL di questo sito per vedere la pagina in formato Markdown.",
  },
  ja: {
    docsTitle: "ドキュメント",
    blogTitle: "ブログ",
    viewStyledHtml: "このページの HTML 版を表示",
    mcpNote: "OAuth 対応のリモート MCP クライアントの接続先は",
    mcpNoteSuffix:
      "です。アクセスには OAuth の Bearer トークンを使います。必須のスコープは `expenses:read` です。任意の `expenses:write` スコープもリクエストできます。このスコープは OAuth の同意画面に表示され、データを変更する際に必要です。",
    agentNote: "CLI や HTTP リクエストを直接使うエージェント向けには、別途 Agent API があります。最初に送るリクエストは",
    agentNoteSuffix: "です。ディスカバリのレスポンスに従って ApiKey を取得してください。",
    tip: "ヒント：このサイトの URL の末尾に `.md` を追加すると、ページを Markdown 形式で表示できます。",
  },
  ko: {
    docsTitle: "문서",
    blogTitle: "블로그",
    viewStyledHtml: "이 페이지의 HTML 버전 보기",
    mcpNote: "OAuth를 지원하는 원격 MCP 클라이언트의 연결 주소는",
    mcpNoteSuffix:
      "입니다. OAuth Bearer 토큰으로 접근하며 `expenses:read` 범위가 필수입니다. 클라이언트는 선택 사항인 `expenses:write` 범위도 요청할 수 있습니다. 이 범위는 OAuth 동의 화면에 표시되며 데이터를 변경하는 데 필요합니다.",
    agentNote: "CLI 또는 직접 HTTP 요청을 사용하는 에이전트는 별도의 Agent API를 사용할 수 있습니다. 첫 요청은",
    agentNoteSuffix: "입니다. 탐색 응답에 따라 ApiKey를 발급받으세요.",
    tip: "팁: 이 사이트의 URL 끝에 `.md`를 붙이면 해당 페이지의 Markdown 버전을 볼 수 있습니다.",
  },
  pl: {
    docsTitle: "Dokumentacja",
    blogTitle: "Blog",
    viewStyledHtml: "Wyświetl sformatowaną wersję HTML tej strony",
    mcpNote: "Zdalne klienty MCP obsługujące OAuth mogą połączyć się z adresem",
    mcpNoteSuffix:
      "przy użyciu tokena Bearer OAuth. Wymagany jest zakres `expenses:read`. Klient może też poprosić o opcjonalny zakres `expenses:write`, który pojawia się na ekranie zgody OAuth i jest wymagany do zmiany danych.",
    agentNote:
      "Agenty działające w wierszu poleceń lub wysyłające bezpośrednie żądania HTTP mogą korzystać z osobnego API dla agentów. Zacznij od",
    agentNoteSuffix: "i postępuj zgodnie z odpowiedzią usługi wykrywania, aby uzyskać ApiKey.",
    tip: "Wskazówka: dodaj `.md` na końcu adresu URL w tej witrynie, aby wyświetlić stronę w formacie Markdown.",
  },
  "pt-br": {
    docsTitle: "Documentação",
    blogTitle: "Blog",
    viewStyledHtml: "Ver a versão HTML formatada desta página",
    mcpNote: "Clientes MCP remotos com suporte a OAuth podem se conectar a",
    mcpNoteSuffix:
      "com um token Bearer OAuth. O escopo `expenses:read` é obrigatório. O cliente também pode solicitar o escopo opcional `expenses:write`, que aparece na tela de consentimento do OAuth e é necessário para alterar dados.",
    agentNote:
      "Agentes de linha de comando ou que fazem requisições HTTP diretas podem usar a API separada para agentes. Comece com",
    agentNoteSuffix: "e siga a resposta de descoberta para obter uma ApiKey.",
    tip: "Dica: acrescente `.md` ao final de uma URL deste site para ver a página em Markdown.",
  },
  tr: {
    docsTitle: "Belgeler",
    blogTitle: "Blog",
    viewStyledHtml: "Bu sayfanın biçimlendirilmiş HTML sürümünü görüntüle",
    mcpNote: "OAuth destekli uzak MCP istemcileri için bağlantı adresi:",
    mcpNoteSuffix:
      "Erişim için OAuth Bearer belirteci ve `expenses:read` kapsamı gerekir. İstemci isteğe bağlı `expenses:write` kapsamını da isteyebilir. Bu kapsam OAuth onay ekranında görünür ve verileri değiştirmek için gereklidir.",
    agentNote:
      "Komut satırından çalışan veya doğrudan HTTP isteği gönderen ajanlar ayrı ajan API’sini kullanabilir. İlk istek:",
    agentNoteSuffix: "Bir ApiKey almak için keşif yanıtındaki adımları izleyin.",
    tip: "İpucu: Bu sitedeki bir URL’nin sonuna `.md` ekleyerek sayfayı Markdown biçiminde görüntüleyebilirsiniz.",
  },
  vi: {
    docsTitle: "Tài liệu",
    blogTitle: "Blog",
    viewStyledHtml: "Xem phiên bản HTML đã định dạng của trang này",
    mcpNote: "Ứng dụng khách MCP từ xa hỗ trợ OAuth có thể kết nối với",
    mcpNoteSuffix:
      "bằng mã thông báo Bearer OAuth. Phạm vi `expenses:read` là bắt buộc. Ứng dụng khách cũng có thể yêu cầu phạm vi tùy chọn `expenses:write`. Phạm vi này xuất hiện trên màn hình chấp thuận OAuth và cần thiết để thay đổi dữ liệu.",
    agentNote:
      "Tác nhân dòng lệnh hoặc tác nhân gửi yêu cầu HTTP trực tiếp có thể dùng API dành riêng cho tác nhân. Hãy bắt đầu bằng",
    agentNoteSuffix: "rồi làm theo phản hồi khám phá để lấy ApiKey.",
    tip: "Mẹo: thêm `.md` vào cuối URL trên trang web này để xem trang dưới dạng Markdown.",
  },
  "zh-hant": {
    docsTitle: "使用文件",
    blogTitle: "部落格",
    viewStyledHtml: "查看此頁面的 HTML 排版版本",
    mcpNote: "支援 OAuth 的遠端 MCP 用戶端可連線至",
    mcpNoteSuffix:
      "並使用 OAuth Bearer 權杖存取。必要的授權範圍是 `expenses:read`。用戶端也可要求選用的 `expenses:write` 範圍；此範圍會顯示在 OAuth 同意畫面上，變更資料時必須取得這項授權。",
    agentNote: "透過命令列或直接發出 HTTP 請求的代理程式可使用獨立的 Agent API。請先送出",
    agentNoteSuffix: "，再依照探索回應取得 ApiKey。",
    tip: "提示：在本站網址後加上 `.md`，即可取得該頁面的 Markdown 版本。",
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

  return `${resolveMarkdownMedia(markdown).trim()}\n\n---\n*[${messages.viewStyledHtml}](${getOriginalPageUrl(
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

  if (docs.length === 0) {
    return { markdown: `# 404\n\nPage not found: ${getLocalizedPath(locale, "/docs/")}`, status: 404 };
  }

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
      `# ${doc.title}\n\n${resolveMarkdownProductLinks(doc.bodyMarkdown, locale)}`,
      getPagePathFromRoutePath(getLocalizedPath(locale, `/docs/${slug}/`)),
      locale
    ),
    status: 200,
  };
}

export function renderBlogListingMarkdown(locale: AppLocale): MarkdownResult {
  const posts = getBlogPosts(locale);
  if (posts.length === 0) {
    return { markdown: `# 404\n\nPage not found: ${getLocalizedPath(locale, "/blog/")}`, status: 404 };
  }

  const messages = MARKDOWN_MESSAGES[locale];
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
      `# ${post.title}\n\n*${post.date}*\n\n${resolveMarkdownProductLinks(post.bodyMarkdown.trim(), locale)}`,
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
- [Cloud App](${getAppUrl(DEFAULT_LOCALE)})
- [Hosted MCP Server](${MCP_URL}): OAuth Bearer access for remote MCP clients; requires \`expenses:read\`. A client can also request optional \`expenses:write\`; it appears on the OAuth consent screen and is required for mutations
- [Agent API Discovery](${DISCOVERY_URL}): Separate ApiKey onboarding for CLI and direct HTTP agents

## Markdown Access

Any page on this site is available as clean Markdown for LLM consumption:
- Append \`.md\` to any URL (e.g. ${SITE_CONTEXT.siteUrl}/.md, ${SITE_CONTEXT.siteUrl}/features.md, ${SITE_CONTEXT.siteUrl}/docs/api.md)
- Or send the HTTP header \`Accept: text/markdown\` to get Markdown from the original URL`;
}
