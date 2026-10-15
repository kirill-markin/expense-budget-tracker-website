import { basename, extname } from "node:path";
import { validateMediaPublicPath } from "../src/lib/marketingMedia";
import { assertAvailablePath, prepareMedia, readMediaManifest, writeMediaManifest } from "./mediaFiles";
import { printMedia, publishMedia, runMediaCommand } from "./mediaUpload";

void runMediaCommand(async (token) => {
  const [file, requestedPath, ...extra] = process.argv.slice(2);
  if (!file || extra.length > 0) {
    throw new Error("Usage: npm run media:add -- <file> [public-path]");
  }
  const publicPath = validateMediaPublicPath(requestedPath ?? `/blog/${basename(file, extname(file))}.webp`);
  const manifest = await readMediaManifest();
  const { original, delivery } = await prepareMedia(file);
  const existing = assertAvailablePath(manifest, publicPath, original.sha256);
  if (existing !== undefined) {
    printMedia(existing);
    return;
  }
  const entry = await publishMedia(publicPath, original, delivery, token);
  await writeMediaManifest([...manifest, entry]);
  printMedia(entry);
});
