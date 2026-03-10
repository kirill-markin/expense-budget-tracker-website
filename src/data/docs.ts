interface DocEntry {
  readonly slug: string;
  readonly title: string;
  readonly description: string;
}

export const DOCS: ReadonlyArray<DocEntry> = [
  {
    slug: "getting-started",
    title: "Getting Started",
    description:
      "Sign up for the cloud version or set up your own instance in minutes.",
  },
  {
    slug: "agent-setup",
    title: "AI Agent Setup",
    description:
      "Share one discovery URL with Claude Code, Codex, or OpenClaw and let the agent connect itself.",
  },
  {
    slug: "self-hosting",
    title: "Self-Hosting Guide",
    description:
      "Run Expense Budget Tracker on your own server with Docker Compose and Postgres.",
  },
  {
    slug: "api",
    title: "API Reference",
    description:
      "SQL API with bearer token auth. Query your data from scripts, LLM agents, or dashboards.",
  },
  {
    slug: "architecture",
    title: "Architecture",
    description:
      "System overview, data model, multi-currency design, and auth model.",
  },
] as const;
