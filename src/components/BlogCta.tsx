import Image from "next/image";
import Link from "next/link";
import type { AppLocale } from "@/lib/i18n/config";
import { getSiteMessages } from "@/lib/i18n/messages";
import { getLocalizedPath } from "@/lib/i18n/routing";
import styles from "./BlogCta.module.css";

interface BlogCtaProps {
  readonly locale: AppLocale;
}

export const BlogCta = ({ locale }: BlogCtaProps): React.JSX.Element => {
  const messages = getSiteMessages(locale);
  const homeHref = getLocalizedPath(locale, "/");

  return (
    <aside className={styles.cta}>
      <Image
        src="/home/budget-screenshot.jpg"
        alt={messages.home.showcaseImageAlt}
        width={3624}
        height={2030}
        sizes="(max-width: 768px) 90vw, 420px"
        className={styles.image}
      />
      <p className={styles.heading}>{messages.blogCta.heading}</p>
      <Link href={homeHref} className={styles.button}>
        {messages.blogCta.buttonLabel}
      </Link>
    </aside>
  );
};
