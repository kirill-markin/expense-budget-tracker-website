import type { AppLocale } from "@/lib/i18n/config";
import { getSiteMessages } from "@/lib/i18n/messages";
import { getLocalizedPath } from "@/lib/i18n/routing";

export interface HeaderLink {
  readonly href: string;
  readonly label: string;
}

export function getHeaderLinks(locale: AppLocale): ReadonlyArray<HeaderLink> {
  const messages = getSiteMessages(locale);

  return [
    {
      href: getLocalizedPath(locale, "/features/"),
      label: messages.header.features,
    },
    {
      href: getLocalizedPath(locale, "/pricing/"),
      label: messages.header.pricing,
    },
    {
      href: getLocalizedPath(locale, "/docs/"),
      label: messages.header.docs,
    },
    {
      href: getLocalizedPath(locale, "/blog/"),
      label: messages.header.blog,
    },
  ];
}
