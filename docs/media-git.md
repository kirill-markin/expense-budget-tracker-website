# Media in Git

[Publish media to Blob](media.md), then commit the manifest and content URL. Do not add marketing images, audio, video, archives, or PDFs to Git. Text and SVG are allowed up to 2 MiB; other binary files are limited to 32 KiB. Only `public/icon-preview.png`, `public/logo-512.png`, and `src/app/favicon.ico` are exempt from the media ban, each at most 32 KiB.

## Optional local hooks

Use Node 24, then run `npm run hooks:install` once per clone. This sets the repository's `core.hooksPath` to `.githooks`, including its worktrees. Existing custom hook paths or non-sample default hooks cause an explicit failure; integrate these commands into your hooks manually:

- Pre-commit: `node scripts/checkMediaGit.ts staged`
- Pre-push: `node scripts/checkMediaGit.ts pre-push "$@"` (preserve the Git ref-update input on stdin).

Run `npm run media:check -- staged` to inspect staged blobs or `npm run media:check -- commits <base-sha> <head-sha>` to inspect a range. Checks inspect every introduced commit, including merges and media added then deleted. Deleting historical media is allowed. Rejected media must be removed from every unpushed commit before retrying; deleting it only in the final commit does not suffice.

## Required CI

The `Media Git guard` job runs on pull requests and pushes to `main`, without credentials or dependency installation. Configure branch protection to require this check and a pull request before merging to `main`, after the media cutover and green checks. The workflow alone does not enable branch protection.

Local hooks are optional and bypassable. CI on a direct push runs after GitHub receives the objects and cannot prevent their upload. A public repository does not provide an unbypassable media push filter through this workflow; use protected PR merges for required enforcement.
