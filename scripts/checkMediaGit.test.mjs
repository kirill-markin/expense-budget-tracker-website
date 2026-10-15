import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const guard = fileURLToPath(new URL("./checkMediaGit.ts", import.meta.url));
const installer = fileURLToPath(new URL("./installMediaHooks.ts", import.meta.url));
const png = Buffer.from("89504e470d0a1a0a00000000", "hex");

function git(cwd, ...args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}

function save(cwd, path, data) {
  mkdirSync(dirname(join(cwd, path)), { recursive: true });
  writeFileSync(join(cwd, path), data);
  git(cwd, "add", "--", path);
}

function commit(cwd) {
  git(cwd, "-c", "user.name=Media guard fixture", "-c", "user.email=fixture@example.com", "-c", "core.hooksPath=/dev/null", "commit", "--quiet", "--allow-empty", "-m", "fixture");
  return git(cwd, "rev-parse", "HEAD");
}

function run(cwd, args, input) {
  return spawnSync(process.execPath, [guard, ...args], { cwd, input, encoding: "utf8" });
}

function expect(result, status) {
  assert.equal(result.status, status, result.stderr);
  if (status === 1) assert.match(result.stderr, /Media Git guard rejected/);
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "media-git-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  git(root, "init", "--quiet", "--initial-branch=main");
  git(root, "config", "user.name", "Media guard fixture");
  git(root, "config", "user.email", "fixture@example.com");
  save(root, "old.png", png);
  return { root, base: commit(root) };
}

test("staged guard reads the index, allows old media deletion and text, rejects media and oversized binary", (t) => {
  const { root } = fixture(t);
  git(root, "rm", "old.png");
  save(root, "large.json", "a".repeat(441_000));
  save(root, "small-font.ttf", Buffer.alloc(5_000));
  expect(run(root, ["staged"], ""), 0);
  for (const [path, data] of [["new.PNG", png], ["renamed.txt", png], ["payload", Buffer.alloc(40_000)], ["report.txt", "a".repeat(2_097_153)], ["backup.zip", "archive"]]) {
    save(root, path, data);
    writeFileSync(join(root, path), "unstaged text");
    expect(run(root, ["staged"], ""), 1);
    git(root, "rm", "--cached", "-f", path);
  }
  for (const path of ["public/icon-preview.png", "public/logo-512.png", "src/app/favicon.ico"]) {
    save(root, path, png);
    expect(run(root, ["staged"], ""), 0);
  }
  save(root, "src/app/icon-preview.png", png);
  expect(run(root, ["staged"], ""), 1);
  git(root, "rm", "--cached", "src/app/icon-preview.png");
  save(root, "public/logo-512.png", Buffer.alloc(33_000));
  expect(run(root, ["staged"], ""), 1);
});

test("commit ranges reject media added then deleted, while text-only commits and historical media pass", (t) => {
  const { root, base } = fixture(t);
  save(root, "content.md", "Article using https://example.com/image.webp");
  const text = commit(root);
  expect(run(root, ["commits", base, text], ""), 0);
  save(root, "temporary.webp", png);
  commit(root);
  git(root, "rm", "temporary.webp");
  const head = commit(root);
  expect(run(root, ["commits", base, head], ""), 1);
  const missing = run(root, ["commits", "f".repeat(40), head], "");
  assert.notEqual(missing.status, 0);
  assert.match(missing.stderr, /failed/);
});

test("merge commits inspect their own new blobs", (t) => {
  const { root, base } = fixture(t);
  git(root, "checkout", "-b", "side");
  save(root, "side.txt", "side");
  commit(root);
  git(root, "checkout", "main");
  save(root, "main.txt", "main");
  commit(root);
  git(root, "merge", "--no-commit", "--no-ff", "side");
  save(root, "merge.png", png);
  const head = commit(root);
  expect(run(root, ["commits", base, head], ""), 1);
});

test("pre-push handles new branches, existing updates, all ref updates, deletion, and unpushed local refs", (t) => {
  const { root, base } = fixture(t);
  const remote = join(root, "remote.git");
  git(root, "init", "--bare", "--quiet", remote);
  git(root, "push", remote, "main");
  const zeros = "0".repeat(40);
  const update = (head, previous, name) => `refs/heads/${name} ${head} refs/heads/${name} ${previous}\n`;
  save(root, "text.txt", "ordinary text");
  const clean = commit(root);
  expect(run(root, ["pre-push", "origin", remote], update(clean, zeros, "new")), 0);
  expect(run(root, ["pre-push", "origin", remote], update(clean, base, "main")), 0);
  save(root, "hidden", Buffer.alloc(40_000));
  commit(root);
  git(root, "rm", "hidden");
  const bad = commit(root);
  git(root, "branch", "already-local", bad);
  for (const previous of [zeros, base]) {
    expect(run(root, ["pre-push", "origin", remote], update(bad, previous, "bad")), 1);
  }
  expect(run(root, ["pre-push", "origin", remote], update(clean, zeros, "good") + update(bad, zeros, "bad")), 1);
  expect(run(root, ["pre-push", "origin", remote], update(zeros, bad, "delete")), 0);
  git(root, "-c", "core.hooksPath=/dev/null", "push", remote, `${bad}:refs/heads/trusted`);
  expect(run(root, ["pre-push", "origin", remote], update(bad, zeros, "copy-existing")), 0);
});

test("hook installer opts in and preserves custom hook paths and default hooks", (t) => {
  const { root } = fixture(t);
  git(root, "config", "--local", "core.hooksPath", "custom-hooks");
  const refused = spawnSync(process.execPath, [installer], { cwd: root, encoding: "utf8" });
  assert.notEqual(refused.status, 0);
  assert.match(refused.stderr, /is preserved/);
  assert.equal(git(root, "config", "--get", "core.hooksPath"), "custom-hooks");
  git(root, "config", "--unset", "core.hooksPath");
  const existingHook = join(root, ".git/hooks/pre-push");
  writeFileSync(existingHook, "#!/bin/sh\nexit 0\n");
  const preserved = spawnSync(process.execPath, [installer], { cwd: root, encoding: "utf8" });
  assert.notEqual(preserved.status, 0);
  assert.match(preserved.stderr, /Existing hooks.*are preserved/);
  assert.equal(spawnSync("git", ["config", "--get", "core.hooksPath"], { cwd: root }).status, 1);
  rmSync(existingHook);
  const installed = spawnSync(process.execPath, [installer], { cwd: root, encoding: "utf8" });
  assert.equal(installed.status, 0, installed.stderr);
  assert.equal(git(root, "config", "--get", "core.hooksPath"), ".githooks");
});
