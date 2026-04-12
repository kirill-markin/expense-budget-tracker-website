import type { AppLocale } from "@/lib/i18n/config";
import { getHtmlLang } from "@/lib/i18n/config";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface SiteFrameProps {
  readonly availableLocales: ReadonlyArray<AppLocale>;
  readonly children: React.ReactNode;
  readonly locale: AppLocale;
  readonly routePath: string;
}

export function SiteFrame(props: SiteFrameProps): React.JSX.Element {
  return (
    <>
      <Header locale={props.locale} />
      <main lang={getHtmlLang(props.locale)}>
        {props.children}
      </main>
      <Footer
        locale={props.locale}
        routePath={props.routePath}
        availableLocales={props.availableLocales}
      />
    </>
  );
}
