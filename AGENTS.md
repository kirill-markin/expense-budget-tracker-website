# expense-budget-tracker-website

Marketing website for Expense Budget Tracker. Static Next.js site deployed on Vercel.

**Git Workflow**: Commit directly to `main` branch (no PRs). Deploy is automatic after push.

## Rules

- Use English for code comments and documentation.
- Prefer functional programming and pure functions.
- Use classes only for connectors to external systems.
- Use strict typing across functions, variables, and collections.
- Avoid fallback logic unless explicitly requested.
- Raise explicit, actionable errors with context.
- Keep changes minimal and scoped to the current request.
- Prefer non-interactive terminal commands.
- RTL support: use CSS logical properties (`inset-inline-start`/`end`, `margin-inline-start`/`end`, `padding-inline-start`/`end`, `text-align: start`/`end`). No physical directional properties.

## Development Commands

- `npm run dev` - Development server with Turbopack
- `npm run build` - Production build
- `npm run lint` - ESLint linting

## Tech Stack

- Next.js 15 with App Router, TypeScript, React 19 Server Components
- Tailwind CSS v4 + CSS Modules
- Markdown processing: gray-matter, remark
- Path alias: `@/*` -> `./src/*`

## Core Principles

**Static Generation First**: Pre-render all content at build time. Zero server-side computation at request time.

**Server Components First**: Client components only where interactivity required (AuthButton, Header mobile menu).

**Public Content Only**: This repository contains no secret pages, no private data, and no server-side personalization. All user-visible content is public and should be safe to render and cache for everyone.

**No Request-Time HTML Rendering**: Do not introduce SSR, server-side cookie checks, or other request-time personalization for marketing HTML. If a small UI detail depends on browser state, handle it after page load in a tiny client component.

**Narrow Runtime Negotiation Layer**: The runtime proxy stays in place only for `.md` URLs, `Accept: text/markdown`, `Vary: Accept`, `Link rel="alternate"`, and existing host-level redirects. Do not use it for HTML rendering or personalization.

**Static Markdown and LLM Assets**: `.md` URLs and `Accept: text/markdown` are both required public interfaces. Generate Markdown and `llms.txt` at build time whenever possible, and use the runtime proxy only to route requests to those prebuilt assets.

**Smaller Client Islands Over Time**: Optimize by shrinking client-rendered regions, not by introducing SSR. Prefer server-rendered shells with small client islands for auth buttons and mobile navigation.

## Project Structure

- `src/app/` - Pages (landing, features, pricing, docs, blog, privacy, terms)
- `src/components/` - Shared components (Header, Footer, AuthButton)
- `src/content/pages/` - Marketing page content files (home, features, pricing, privacy, terms)
- `src/content/docs/` - Documentation markdown files
- `src/content/blog/` - Blog post markdown files
- `src/lib/` - Utilities (auth helpers)

## Auth Integration

The marketing site has zero auth logic. It only checks for the `session` cookie presence (set by `auth.expense-budget-tracker.com` on the shared `.expense-budget-tracker.com` domain) to toggle between "Log In / Sign Up" and "Open App" buttons. No JWT verification.

## Domain Layout

| Domain | What | Where |
|---|---|---|
| `expense-budget-tracker.com` | This marketing site | Vercel |
| `app.expense-budget-tracker.com` | Main app | AWS ECS |
| `auth.expense-budget-tracker.com` | Cognito auth | AWS ECS |
| `api.expense-budget-tracker.com` | SQL API | AWS API Gateway |

## Content

Composed and list pages use typed content modules:
- `src/content/pages/home.ts`
- `src/content/pages/features.ts`
- `src/content/pages/pricing.ts`

Mostly-text pages stay Markdown-backed:
- `src/content/pages/privacy/index.md`
- `src/content/pages/terms/index.md`
- `src/content/docs/*.md`
- `src/content/blog/*.md`

Keep typed content models mirrored with the other marketing website repository. Build-time generation must render both HTML and Markdown from the same source of truth.
