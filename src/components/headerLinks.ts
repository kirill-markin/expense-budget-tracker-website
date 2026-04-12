import { getAvailableBlogIndexLocales } from "@/lib/blog";
import { getAvailableDocIndexLocales } from "@/lib/docs";
import type { AppLocale } from "@/lib/i18n/config";
import { getSiteMessages } from "@/lib/i18n/messages";
import { getLocalizedPath } from "@/lib/i18n/routing";

export interface HeaderLink {
  readonly href: string;
  readonly label: string;
}

export function getHeaderLinks(locale: AppLocale): ReadonlyArray<HeaderLink> {
  const messages = getSiteMessages(locale);
  const links: HeaderLink[] = [
    {
      href: getLocalizedPath(locale, "/features/"),
      label: messages.header.features,
    },
    {
      href: getLocalizedPath(locale, "/pricing/"),
      label: messages.header.pricing,
    },
  ];

  if (getAvailableDocIndexLocales().includes(locale)) {
    links.push({
      href: getLocalizedPath(locale, "/docs/"),
      label: messages.header.docs,
    });
  }

  if (getAvailableBlogIndexLocales().includes(locale)) {
    links.push({
      href: getLocalizedPath(locale, "/blog/"),
      label: messages.header.blog,
    });
  }

  return links;
}
