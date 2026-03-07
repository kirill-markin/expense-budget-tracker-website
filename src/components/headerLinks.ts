export interface HeaderLink {
  readonly href: string;
  readonly label: string;
}

export const HEADER_LINKS: ReadonlyArray<HeaderLink> = [
  { href: "/features/", label: "Features" },
  { href: "/pricing/", label: "Pricing" },
  { href: "/docs/", label: "Docs" },
  { href: "/blog/", label: "Blog" },
];
