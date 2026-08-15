export const DOC_SLUGS = [
  "getting-started",
  "agent-setup",
  "mcp",
  "self-hosting",
  "api",
  "architecture",
] as const;

export type DocSlug = (typeof DOC_SLUGS)[number];
