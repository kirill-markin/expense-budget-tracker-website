import assert from "node:assert/strict";
import test from "node:test";
import { remark } from "remark";
import gfm from "remark-gfm";
import html from "remark-html";
import {
  getAppUrl,
  getLoginUrl,
  getSignupUrl,
  localizeProductEntryUrl,
} from "../src/lib/auth";
import { readBlogPostContent } from "../src/lib/blog";
import { renderMarkdownToHtml } from "../src/lib/content/renderMarkdownToHtml";
import { resolveMarkdownProductLinks } from "../src/lib/content/resolveMarkdownProductLinks";
import { readDocContent } from "../src/lib/docs";
import { SUPPORTED_LOCALES, type AppLocale } from "../src/lib/i18n/config";
import { getLocalizedPath } from "../src/lib/i18n/routing";
import { getPagePathFromHtmlPathname } from "../src/lib/markdownAssetPaths";
import { renderMarkdownDocument, renderLlmsText } from "../src/lib/markdownServe";

const APP_URL = "https://app.expense-budget-tracker.com";
const AUTH_URL = "https://auth.expense-budget-tracker.com";
const configuredAppUrl = process.env.NEXT_PUBLIC_APP_URL ?? APP_URL;
const configuredAuthUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? AUTH_URL;

const languageHints: Readonly<Partial<Record<AppLocale, string>>> = {
  "zh-hant": "zh-Hant",
  "pt-br": "pt-BR",
};

test("app and auth entry links defer on English and carry the active locale elsewhere", () => {
  const path = "/budget?utm_source=a%20b&workspace=example#march";
  for (const locale of SUPPORTED_LOCALES) {
    const hint = locale === "en" ? null : languageHints[locale] ?? locale;
    const appUrl = new URL(getAppUrl(locale));
    assert.equal(appUrl.origin, new URL(configuredAppUrl).origin);
    assert.equal(appUrl.searchParams.get("locale"), hint);

    const loginUrl = new URL(getLoginUrl(path, locale));
    const signupUrl = new URL(getSignupUrl(locale));
    for (const authUrl of [loginUrl, signupUrl]) {
      assert.equal(authUrl.origin, new URL(configuredAuthUrl).origin);
      assert.equal(authUrl.pathname, new URL(`${configuredAuthUrl.replace(/\/$/, "")}/login`).pathname);
      assert.equal(authUrl.searchParams.get("lang"), hint);
      assert.equal(authUrl.searchParams.get("carry_locale"), locale === "en" ? "1" : null);
    }
    assert.equal(loginUrl.searchParams.get("redirect_uri"), `${configuredAppUrl.replace(/\/$/, "")}${path}`);
    assert.equal(signupUrl.searchParams.get("redirect_uri"), configuredAppUrl);
  }
  for (const invalidPath of ["https://elsewhere.example/budget", "//elsewhere.example", "//", "/\\elsewhere.example"]) {
    assert.throws(() => getLoginUrl(invalidPath, "es"), /Login redirect must be a relative path/);
  }
});

test("entry localization preserves authored hints and only changes approved human destinations", () => {
  const entryPath = `${APP_URL}/budget?utm_source=a%20b&tag=%7e&tag=other`;
  const appEntry = `${entryPath}#march`;
  const explicitAppEntry = `${entryPath}&lo%63ale=en#march`;
  const authEntry = `${AUTH_URL}/login?redirect_uri=${encodeURIComponent(appEntry)}&utm_source=a%20b#entry`;
  assert.equal(localizeProductEntryUrl(appEntry, "en"), appEntry);
  assert.equal(localizeProductEntryUrl(appEntry, "uk"), `${entryPath}&locale=uk#march`);
  assert.equal(localizeProductEntryUrl(authEntry, "en"), authEntry.replace("#entry", "&carry_locale=1#entry"));
  assert.equal(localizeProductEntryUrl(authEntry, "uk"), authEntry.replace("#entry", "&lang=uk#entry"));
  const authoredCarry = authEntry.replace("#entry", "&carry_locale=1#entry");
  assert.equal(localizeProductEntryUrl(authoredCarry, "en"), authoredCarry);
  assert.equal(localizeProductEntryUrl(`${APP_URL}/?#march`, "uk"), `${APP_URL}/?locale=uk#march`);

  for (const href of [
    explicitAppEntry,
    authEntry.replace("#entry", "&l%61ng=en#entry"),
    authEntry.replace(encodeURIComponent(appEntry), encodeURIComponent(explicitAppEntry)),
    "/docs/getting-started/?locale=ru#cloud",
    "https://example.com/deploy?locale=ru",
    "https://app.expense-budget-tracker.com.example/budget",
    "https://app.expense-budget-tracker.com@example.com/budget",
    `${APP_URL}/api/agent#discovery`,
    `${APP_URL}/.well-known/agent.json`,
    `${APP_URL}/v1/`,
    `${APP_URL}/mcp`,
    `${APP_URL}/share/monthly/public`,
    `${AUTH_URL}/api/agent/send-code`,
    `${AUTH_URL}/oauth/authorize`,
    `${AUTH_URL}/login?redirect_uri=${encodeURIComponent(`${APP_URL}/api/agent`)}`,
    `${AUTH_URL}/login?redirect_uri=${encodeURIComponent(`${AUTH_URL}/oauth/authorize`)}`,
    `${AUTH_URL}/login?redirect_uri=https%3A%2F%2Fexample.com`,
    `${AUTH_URL}/login?redirect_uri=https%3A%2F%2Fexample.com&redirect_uri=${encodeURIComponent(APP_URL)}`,
  ]) {
    assert.equal(localizeProductEntryUrl(href, "en"), href);
    assert.equal(localizeProductEntryUrl(href, "uk"), href);
  }
});

test("auth links carry the locale through both Markdown renderers", async () => {
  const link = `${AUTH_URL}/login?redirect_uri=${encodeURIComponent(`${APP_URL}/budget?utm_source=a%20b#march`)}`;
  const markdown = `[Sign in](${link})`;
  for (const [locale, hint] of [
    ["en", "carry_locale=1"],
    ["pt-br", "lang=pt-BR"],
    ["zh-hant", "lang=zh-Hant"],
  ] as const) {
    const generatedMarkdown = resolveMarkdownProductLinks(markdown, locale);
    const generatedHtml = String(await remark().use(gfm).use(html).process(generatedMarkdown));
    const pageHtml = await renderMarkdownToHtml(markdown, locale);
    assert.ok(pageHtml.includes(`href="${link}&#x26;${hint}"`));
    assert.equal(generatedHtml, pageHtml);
  }
});

test("Markdown changes product destinations while preserving code samples, images, and internal links", async () => {
  const machine = `${APP_URL}/api/agent`;
  const appEntry = `${APP_URL}/budget?utm_source=a%20b&tag=(monthly)#march`;
  const markdown = [
    `[**Open** app](<${appEntry}> "Budget ]( title")`,
    `[Open app by reference][app]`,
    `[app]: <${APP_URL}> "Hosted app"`,
    `<${APP_URL}>`,
    `Start at ${APP_URL}/ here.`,
    `![Image](${APP_URL})`,
    `[Docs](/es/docs/getting-started/)`,
    `[Agent discovery](${machine})`,
    `\`${APP_URL}\``,
    `\`\`\`md\n[Example](${APP_URL})\n\`\`\``,
  ].join("\n\n");
  const result = resolveMarkdownProductLinks(markdown, "fa");
  assert.ok(result.includes(`[app]: ${APP_URL}?locale=fa "Hosted app"`));
  assert.ok(result.includes(`[${APP_URL}](${APP_URL}?locale=fa)`));
  assert.ok(result.includes(`Start at [${APP_URL}/](${APP_URL}/?locale=fa) here.`));
  assert.ok(result.includes(`![Image](${APP_URL})`));
  assert.ok(result.includes("[Docs](/es/docs/getting-started/)"));
  assert.ok(result.includes(`[Agent discovery](${machine})`));
  assert.ok(result.includes(`\`${APP_URL}\``));
  assert.ok(result.includes(`\`\`\`md\n[Example](${APP_URL})\n\`\`\``));
  assert.equal(resolveMarkdownProductLinks(result, "fa"), result);

  const html = await renderMarkdownToHtml(markdown, "fa");
  assert.ok(html.includes(`href="${APP_URL}/budget?utm_source=a%20b&#x26;tag=(monthly)&#x26;locale=fa#march"`));
  assert.ok(html.includes(`href="${APP_URL}?locale=fa"`));
  assert.ok(html.includes('title="Budget ]( title"><strong>Open</strong> app</a>'));
  assert.ok(html.includes(`href="${machine}"`));
});

test("Markdown preserves escaped pipes in product links inside tables", async () => {
  const markdown = [
    "| Action | Result |",
    "| --- | --- |",
    `| [Open \\| try](${APP_URL}/) | Done |`,
  ].join("\n");
  const destination = `${APP_URL}/?locale=es`;

  const result = resolveMarkdownProductLinks(markdown, "es");
  assert.ok(result.includes(`[Open \\| try](${destination})`));

  for (const input of [markdown, result]) {
    const html = await renderMarkdownToHtml(input, "es");
    assert.ok(html.includes(`<td><a href="${destination}">Open | try</a></td>\n<td>Done</td>`));
  }
});

test("Markdown localizes GFM autolinks without source positions", async () => {
  const markdown = String.raw`Start at https\://app.expense-budget-tracker.com/ here.`;
  const destination = `${APP_URL}/?locale=es`;

  assert.equal(resolveMarkdownProductLinks(markdown, "es"), `Start at [${APP_URL}/](${destination}) here.`);
  const html = await renderMarkdownToHtml(markdown, "es");
  assert.ok(html.includes(`Start at <a href="${destination}">${APP_URL}/</a> here.`));
});

test("generated Markdown preserves distinct reference destinations when labels decode to the same text", async () => {
  const external = "https://example.com/reference";
  const markdown = [
    "[Open app][go]",
    "[External article][g&#111;]",
    "![External preview][g&#111;]",
    "[Reserved label][reference-1]",
    `[go]: ${APP_URL}`,
    `[g&#111;]: ${external}`,
    "[reference-1]: https://example.org",
  ].join("\n\n");

  const result = resolveMarkdownProductLinks(markdown, "es");
  const originalHtml = await renderMarkdownToHtml(markdown, "es");
  const generatedHtml = String(await remark().use(gfm).use(html).process(result));
  assert.ok(originalHtml.includes(`<a href="${APP_URL}?locale=es">Open app</a>`));
  assert.ok(originalHtml.includes(`<a href="${external}">External article</a>`));
  assert.ok(originalHtml.includes(`<img src="${external}" alt="External preview">`));
  assert.ok(originalHtml.includes('<a href="https://example.org">Reserved label</a>'));
  assert.equal(generatedHtml, originalHtml);
});

test("a link sharing a definition with an image gets an independent localized URL", async () => {
  const markdown = [
    "[**Open** app][entry]",
    "![Preview][entry]",
    `[entry]: ${APP_URL} "Hosted app"`,
  ].join("\n\n");

  const result = resolveMarkdownProductLinks(markdown, "es");
  const originalHtml = await renderMarkdownToHtml(markdown, "es");
  const generatedHtml = String(await remark().use(gfm).use(html).process(result));
  assert.ok(originalHtml.includes(`<a href="${APP_URL}?locale=es" title="Hosted app"><strong>Open</strong> app</a>`));
  assert.ok(originalHtml.includes(`<img src="${APP_URL}" alt="Preview" title="Hosted app">`));
  assert.equal(generatedHtml, originalHtml);
});

test("generated Markdown preserves a mailto link with multiple recipients", async () => {
  const recipients = "one@example.com,two@example.com";
  const markdown = `[Open app](${APP_URL}) and [${recipients}](mailto:${recipients}).`;
  const result = resolveMarkdownProductLinks(markdown, "es");
  const generatedHtml = String(await remark().use(gfm).use(html).process(result));
  assert.ok(generatedHtml.includes(`<a href="mailto:${recipients}">${recipients}</a>`));
  assert.ok(generatedHtml.includes(`<a href="${APP_URL}?locale=es">Open app</a>`));
});

test("English and localized product pages render matching app links across HTML and Markdown", async () => {
  for (const locale of ["en", "es", "pt-br", "zh-hant"] as const) {
    const hint = locale === "en" ? "" : `?locale=${languageHints[locale] ?? locale}`;
    const doc = await readDocContent("getting-started", locale);
    assert.ok(doc?.contentHtml.includes(`href="${APP_URL}${hint}"`));
    assert.ok(doc?.contentHtml.includes(`<code>${APP_URL}</code>`));

    const blog = await readBlogPostContent("quicken-alternative", locale);
    assert.ok(blog?.contentHtml.includes(`href="${APP_URL}/${hint}"`));
    assert.ok(blog?.contentHtml.includes(`href="${APP_URL}/api/agent"`));

    const renderPage = (route: string) =>
      renderMarkdownDocument(getPagePathFromHtmlPathname(getLocalizedPath(locale, route)));
    const home = renderPage("/");
    const pricing = renderPage("/pricing/");
    const docMarkdown = renderPage("/docs/getting-started/");
    for (const result of [home, pricing, docMarkdown]) {
      assert.equal(result.status, 200);
      assert.ok(result.markdown.includes(`(${APP_URL}${hint})`));
    }
    assert.ok(home.markdown.includes("https://mcp.expense-budget-tracker.com/mcp"));
    assert.ok(pricing.markdown.includes("(https://github.com/kirill-markin/expense-budget-tracker)"));
    assert.ok(docMarkdown.markdown.includes(`\`${APP_URL}\``));

    const blogMarkdown = renderPage("/blog/quicken-alternative/");
    assert.equal(blogMarkdown.status, 200);
    assert.ok(blogMarkdown.markdown.includes(`(${APP_URL}/${hint})`));
    assert.ok(blogMarkdown.markdown.includes(`(${APP_URL}/api/agent)`));
  }

  assert.ok(renderLlmsText().includes(`[Cloud App](${configuredAppUrl})`));
});
