import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";
import { test } from "node:test";

function assertEnglishBlogSources(contentDirectory: string): void {
  const articlePaths = readdirSync(contentDirectory, {
    recursive: true,
    withFileTypes: true,
  })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => relative(contentDirectory, join(entry.parentPath, entry.name)))
    .filter((articlePath) => articlePath.split(sep)[1] === "blog")
    .sort();
  const existingArticles = new Set(articlePaths);
  const missingSources = articlePaths.flatMap((articlePath) => {
    const [locale, ...articleSegments] = articlePath.split(sep);
    const englishPath = join("en", ...articleSegments);

    return locale !== "en" && !existingArticles.has(englishPath)
      ? [`${join(contentDirectory, articlePath)} -> missing ${join(contentDirectory, englishPath)}`]
      : [];
  });

  assert.equal(
    missingSources.length,
    0,
    `Localized blog articles require English source files:\n${missingSources.join("\n")}`
  );
}

test("every localized repository blog article has an English source", () => {
  assertEnglishBlogSources(join(process.cwd(), "src", "content"));
});

test("allows incomplete translations and rejects a localized article without English", (context) => {
  const contentDirectory = mkdtempSync(join(tmpdir(), "blog-english-source-"));
  context.after(() => rmSync(contentDirectory, { recursive: true, force: true }));

  mkdirSync(join(contentDirectory, "en", "blog"), { recursive: true });
  mkdirSync(join(contentDirectory, "es", "blog"), { recursive: true });
  writeFileSync(join(contentDirectory, "en", "blog", "english-only.md"), "# English only\n");
  writeFileSync(join(contentDirectory, "en", "blog", "translated.md"), "# English source\n");
  writeFileSync(join(contentDirectory, "es", "blog", "translated.md"), "# Traducción\n");

  assertEnglishBlogSources(contentDirectory);

  const localizedPath = join(contentDirectory, "es", "blog", "orphan.md");
  const englishPath = join(contentDirectory, "en", "blog", "orphan.md");
  writeFileSync(localizedPath, "# Sin original inglés\n");

  assert.throws(() => assertEnglishBlogSources(contentDirectory), (error) => {
    assert.ok(error instanceof assert.AssertionError);
    assert.ok(error.message.includes(`${localizedPath} -> missing ${englishPath}`));
    return true;
  });
});
