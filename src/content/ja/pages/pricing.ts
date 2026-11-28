import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_JA = {
  locale: "ja",
  title: "料金",
  description:
    "無料のセルフホスト版と、運用を任せられるクラウド版を選べます。オープンソースで、どちらもすべての機能を使えます。",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "料金",
      intro: "どのプランでも、すべての機能を利用できます。",
      tiers: [
        {
          type: "link_tier",
          name: "セルフホスト版",
          price: "無料",
          highlighted: false,
          bullets: [
            "全ソースコードを GitHub で公開",
            "Docker Compose + Postgres",
            "すべての機能を利用可能",
            "自分のサーバーでデータを管理",
            "コミュニティのサポート",
          ],
          cta: {
            label: "GitHub で見る",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "クラウド版",
          price: "ベータ期間中は無料",
          highlighted: true,
          bullets: [
            "AWS 上でのマネージドホスティング",
            "自動バックアップ",
            "すべての機能を利用可能",
            "メールで届くワンタイムの確認コードでログイン",
            "為替レートを毎日更新",
          ],
          cta: {
            label: "使い始める",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "ja" };
