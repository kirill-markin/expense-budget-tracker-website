# Marketing media

## Upload setup

Use Node 24 and `npm ci`. Create a dedicated public Vercel Blob store for the Expense Budget Tracker website in the Vercel dashboard and obtain its read/write token. Put its `BLOB_READ_WRITE_TOKEN` in `.env.media.local` in the main checkout, with file permissions `0600`; never commit it. Upload commands locate this single file via Git's common directory, including from worktrees. An explicitly supplied `BLOB_READ_WRITE_TOKEN` environment variable takes precedence. Website builds and public downloads require no credentials.

## Add and replace

```sh
npm run media:add -- /absolute/path/article.png
npm run media:add -- /absolute/path/panel.png /home/new-panel.png
npm run media:replace -- /absolute/path/updated-panel.png /home/new-panel.png
```

Add defaults to `/blog/<filename>.webp`; the optional second argument selects a logical path under `/blog` or `/home`. Add rejects occupied paths with different source bytes. Replace requires an existing path and updates only that mapping. Both preserve the exact original in Blob and publish an auto-oriented WebP at quality 85 without resizing. Animated and multipage inputs are rejected by add and replace.

The printed JSON includes the immediately usable public `url`, dimensions, SHA-256 and byte count, plus `original` when delivery differs. Use the Blob `url` in new content. Logical paths are inventory keys; this publishing stage does not route them to Blob. Existing website images continue to use their current local files.

Every object uses a content-hash pathname, disallows overwrites and has a one-year cache lifetime. Replacement retains prior objects and URLs. Commit the sorted `src/content/media-manifest.json` with the content change. Keep source files outside Git. Concurrent upload commands are rejected; after an interrupted process, remove `.generated/media-publishing.lock` only after confirming that process has stopped.

## Import existing images

```sh
npm run media:migrate
```

Import recursively publishes raster files under `public/blog` and `public/home` byte-for-byte, with matching logical paths. It saves the manifest after each completed image, so rerunning resumes. Each published object's public bytes are checksum-verified before recording it. Import rejects conflicting mappings and never deletes source files. The rendering cutover and Git guards are separate work.
