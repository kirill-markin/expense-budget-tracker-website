import { Source_Serif_4 } from "next/font/google";
import type { TextDirection } from "@/lib/i18n/config";

const sourceSerif = Source_Serif_4({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-source-serif",
});

interface RootDocumentProps {
  readonly children: React.ReactNode;
  readonly dir: TextDirection;
  readonly lang: string;
}

export function RootDocument(
  props: RootDocumentProps
): React.JSX.Element {
  return (
    <html
      lang={props.lang}
      dir={props.dir}
      className={sourceSerif.variable}
    >
      <body>{props.children}</body>
    </html>
  );
}
