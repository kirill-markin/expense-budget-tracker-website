import { spawnSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const current = spawnSync("git", ["config", "--get", "core.hooksPath"], { encoding: "utf8" });
if (current.status !== 0 && current.status !== 1) throw new Error(`Cannot read core.hooksPath: ${current.error?.message ?? current.stderr}`);
const hooksPath = current.stdout.trim();
if (current.status === 0 && hooksPath !== ".githooks") {
  throw new Error(`Existing core.hooksPath=${JSON.stringify(hooksPath)} is preserved. Add the two commands from docs/media-git.md to your hooks manually.`);
}
if (current.status === 1) {
  const location = spawnSync("git", ["rev-parse", "--git-path", "hooks"], { encoding: "utf8" });
  if (location.status !== 0) throw new Error(`Cannot locate Git hooks: ${location.error?.message ?? location.stderr}`);
  const directory = resolve(location.stdout.trim());
  const existing = existsSync(directory) ? readdirSync(directory).filter((name) => !name.endsWith(".sample")) : [];
  if (existing.length) throw new Error(`Existing hooks in ${directory} are preserved: ${existing.join(", ")}. Add the commands from docs/media-git.md manually.`);
}
const install = spawnSync("git", ["config", "--local", "core.hooksPath", ".githooks"], { encoding: "utf8" });
if (install.status !== 0) throw new Error(`Cannot install media hooks: ${install.error?.message ?? install.stderr}`);
console.log("Media hooks enabled for this Git repository (including its worktrees).");
