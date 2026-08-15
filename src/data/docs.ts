export const DOC_SLUGS = [
  "getting-started",
  "agent-setup",
  "mcp-connector",
  "self-hosting",
  "api",
  "architecture",
] as const;

export type DocSlug = (typeof DOC_SLUGS)[number];
