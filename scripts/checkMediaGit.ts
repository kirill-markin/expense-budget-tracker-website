import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { extname } from "node:path";

const smallBinaryLimit = 32 * 1024;
const fileLimit = 2 * 1024 * 1024;
const mediaExtensions = new Set(".png .jpg .jpeg .gif .webp .avif .heic .heif .bmp .tif .tiff .ico .psd .apng .jxl .mp4 .mov .m4v .webm .avi .mkv .mpeg .mpg .mp3 .m4a .aac .wav .ogg .opus .flac .aiff .zip .gz .tgz .bz2 .xz .7z .rar .tar .pdf .apkg .colpkg".split(" "));
const icons = new Set(["public/icon-preview.png", "public/logo-512.png", "src/app/favicon.ico"]);

type Change = Readonly<{ oid: string; path: string; context: string }>;

function git(args: string[]): Buffer {
  const result = spawnSync("git", args, { maxBuffer: 64 * 1024 * 1024 });
  if (result.status !== 0) {
    throw new Error(`Media guard: git ${args.join(" ")} failed. ${result.error?.message ?? ""}\n${result.stderr?.toString()}`);
  }
  return result.stdout;
}

function lines(value: Buffer): string[] {
  return value.toString("utf8").trim().split("\n").filter(Boolean);
}

function commit(value: string): string {
  if (!/^[a-f0-9]{40,64}$/.test(value)) throw new Error(`Media guard: expected a full commit SHA, received ${JSON.stringify(value)}.`);
  return git(["rev-parse", "--verify", `${value}^{commit}`]).toString().trim();
}

function changes(args: string[], context: string): Change[] {
  const records = git(args).toString("utf8").split("\0");
  const result: Change[] = [];
  for (let index = 0; index < records.length - 1; index += 2) {
    const header = /^:\d+ (\d+) [a-f0-9]+ ([a-f0-9]+) [ACMT]$/.exec(records[index]);
    if (!header || !records[index + 1]) throw new Error(`Media guard: malformed Git change record in ${context}.`);
    if (header[1] === "160000") throw new Error(`Media guard: submodule ${records[index + 1]} cannot be inspected. Keep media in Blob; see docs/media.md.`);
    result.push({ oid: header[2], path: records[index + 1], context });
  }
  return result;
}

function hasMediaSignature(data: Buffer): boolean {
  const hex = data.subarray(0, 12).toString("hex");
  const ascii = data.subarray(0, 12).toString("ascii");
  return /^(89504e470d0a1a0a|ffd8ff|474946383[79]61|424d|49492a00|4d4d002a|00000100|504b0304|504b0506|1f8b|425a68|fd377a585a00|377abcaf271c|52617221|25504446|664c6143|4f676753|494433|1a45dfa3)/.test(hex)
    || (ascii.startsWith("RIFF") && /WEBP|WAVE|AVI /.test(ascii.slice(8)))
    || ascii.slice(4, 8) === "ftyp";
}

function isBinary(data: Buffer): boolean {
  if (data.includes(0)) return true;
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(data);
    return false;
  } catch (error) {
    if (error instanceof TypeError) return true;
    throw error;
  }
}

function check(items: Change[]): void {
  const inspected = new Set<string>();
  const failures: string[] = [];
  for (const item of items) {
    const key = `${item.oid}:${item.path}`;
    if (inspected.has(key)) continue;
    inspected.add(key);
    const size = Number(git(["cat-file", "-s", item.oid]).toString());
    let reason: string | undefined;
    if (size > fileLimit) reason = `file exceeds ${fileLimit} bytes`;
    else {
      const data = git(["cat-file", "blob", item.oid]);
      if (icons.has(item.path) && size <= smallBinaryLimit) continue;
      if (mediaExtensions.has(extname(item.path).toLowerCase()) || hasMediaSignature(data)) reason = "raster, audio, video or archive media belongs in Blob";
      else if (size > smallBinaryLimit && isBinary(data)) reason = `binary file exceeds ${smallBinaryLimit} bytes`;
    }
    if (reason) failures.push(`${JSON.stringify(item.path)} (${size} bytes, ${item.context}): ${reason}`);
  }
  if (failures.length) {
    throw new Error(`Media Git guard rejected:\n${failures.join("\n")}\nUpload images with npm run media:add -- /absolute/path/image.png and commit the manifest + content URL. See docs/media.md. Remove prohibited blobs from every introduced commit, not only the final tree.`);
  }
}

function introduced(heads: string[], trusted: string[]): Change[] {
  if (heads.length === 0) return [];
  const commits = lines(git(["rev-list", ...heads, "--not", ...trusted]));
  return commits.flatMap((sha) => changes(["diff-tree", "--root", "--no-commit-id", "-r", "--raw", "--no-abbrev", "-z", "--no-renames", "--diff-filter=ACMT", "--diff-merges=first-parent", sha], sha));
}

function prePush(remote: string): void {
  const updates = readFileSync(0, "utf8").trim().split("\n").filter(Boolean).map((line) => {
    const fields = line.split(" ");
    if (fields.length !== 4 || !fields.every(Boolean)) throw new Error(`Media guard: malformed pre-push ref update ${JSON.stringify(line)}.`);
    return { local: fields[1], previous: fields[3] };
  });
  const active = updates.filter(({ local }) => !/^0+$/.test(local));
  if (active.length === 0) return;
  const advertised = lines(git(["ls-remote", "--heads", "--tags", remote])).map((line) => line.split("\t")[0]);
  // Only server-advertised tips are trusted; local branches can contain the very blobs being pushed.
  const available = [...new Set(advertised)].filter((sha) => spawnSync("git", ["cat-file", "-e", `${sha}^{commit}`]).status === 0);
  for (const { previous } of active) {
    if (!/^0+$/.test(previous)) available.push(commit(previous));
  }
  if (advertised.length > 0 && available.length === 0) throw new Error(`Media guard: no advertised remote commit is available locally. Run git fetch ${remote}, then retry the push.`);
  check(introduced(active.map(({ local }) => commit(local)), available));
}

const [mode, ...args] = process.argv.slice(2);
if (mode === "staged" && args.length === 0) {
  check(changes(["diff", "--cached", "--raw", "--no-abbrev", "-z", "--no-renames", "--diff-filter=ACMT"], "staged"));
} else if (mode === "commits" && args.length === 2) {
  check(introduced([commit(args[1])], [commit(args[0])]));
} else if (mode === "pre-push" && args.length === 2) {
  prePush(args[1]);
} else {
  throw new Error("Usage: node scripts/checkMediaGit.ts staged | commits <base-sha> <head-sha> | pre-push <remote-name> <remote-url>");
}
