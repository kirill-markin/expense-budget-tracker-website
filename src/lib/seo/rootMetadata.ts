import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/i18n/config";

export const ROOT_LAYOUT_METADATA: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
};
