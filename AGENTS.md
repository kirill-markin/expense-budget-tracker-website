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

## Project Structure

- `src/app/` - Pages (landing, features, pricing, docs, blog, privacy, terms)
- `src/components/` - Shared components (Header, Footer, AuthButton)
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

Add docs: create a `.md` file in `src/content/docs/` with frontmatter (`title`, `description`), then add the slug to `generateStaticParams` in `src/app/docs/[slug]/page.tsx`.

Add blog posts: create a `.md` file in `src/content/blog/` with frontmatter (`title`, `description`, `date`). Posts are auto-discovered and sorted by date.
