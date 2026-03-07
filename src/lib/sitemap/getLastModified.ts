import { existsSync, readdirSync, statSync } from "fs";
import { join } from "path";

export function getFileLastModified(filePath: string): Date {
  if (!existsSync(filePath)) {
    throw new Error(`Missing source file for sitemap: ${filePath}`);
  }

  return statSync(filePath).mtime;
}

export function getNewestDirectoryFileLastModified(
  directoryPath: string
): Date | null {
  if (!existsSync(directoryPath)) {
    return null;
  }

  const filePaths = readdirSync(directoryPath)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => join(directoryPath, fileName));

  if (filePaths.length === 0) {
    return null;
  }

  return filePaths.reduce((latestDate, filePath) => {
    const currentDate = getFileLastModified(filePath);
    return currentDate > latestDate ? currentDate : latestDate;
  }, getFileLastModified(filePaths[0]));
}

export function getMarkdownSlugs(directoryPath: string): ReadonlyArray<string> {
  if (!existsSync(directoryPath)) {
    return [];
  }

  return readdirSync(directoryPath)
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => fileName.replace(/\.md$/, ""));
}
