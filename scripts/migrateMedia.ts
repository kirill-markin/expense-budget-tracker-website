import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";
import { validateMediaPublicPath } from "../src/lib/marketingMedia";
import { assertAvailablePath, inspectMedia, readMediaManifest, writeMediaManifest } from "./mediaFiles";
import { printMedia, publishMedia, runMediaCommand } from "./mediaUpload";

async function rasterFiles(directory: string): Promise<readonly string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await rasterFiles(path));
    else if (/\.(png|jpe?g|webp|avif|gif|tiff?)$/i.test(entry.name)) {
      if (!entry.isFile()) throw new Error(`Migration requires regular files: ${path}.`);
      files.push(path);
    }
  }
  return files.sort();
}

void runMediaCommand(async (token) => {
  if (process.argv.length !== 2) throw new Error("Usage: npm run media:migrate");
  const publicRoot = resolve("public");
  let manifest = await readMediaManifest();
  for (const directory of ["blog", "home"]) {
    for (const file of await rasterFiles(join(publicRoot, directory))) {
      const publicPath = validateMediaPublicPath(`/${relative(publicRoot, file).split(sep).join("/")}`);
      const original = await inspectMedia(await readFile(file));
      const existing = assertAvailablePath(manifest, publicPath, original.sha256);
      if (existing !== undefined) {
        if (existing.original !== undefined || existing.sha256 !== original.sha256) {
          throw new Error(`Migration requires byte-for-byte delivery at ${publicPath}; an optimized mapping already exists.`);
        }
        continue;
      }
      const entry = await publishMedia(publicPath, original, original, token);
      manifest = [...manifest, entry];
      await writeMediaManifest(manifest);
      printMedia(entry);
    }
  }
});
