import type { getSiteMessages } from "../messages";

export const messages = {
  auth: {
    login: "ログイン",
    signup: "無料でアカウントを作成",
    openApp: "アプリを開く",
  },
  header: {
    features: "機能",
    pricing: "料金",
    docs: "ドキュメント",
    blog: "ブログ",
    toggleMenu: "メニューの開閉",
  },
  footer: {
    productTitle: "プロダクト",
    openSourceTitle: "オープンソース",
    legalTitle: "規約とポリシー",
    documentation: "ドキュメント",
    selfHostingGuide: "セルフホスティングガイド",
    support: "サポート",
    privacyPolicy: "プライバシーポリシー",
    termsOfService: "利用規約",
    builtBy: "開発 Kirill Markin",
    localeSwitcherAriaLabel: "言語を選択",
    localeSearchLabel: "言語を検索",
    localeSearchEmpty: "該当する言語がありません",
    operatedBy: "運営 SAMO DANNI EOOD（ブルガリア） · VAT 登録番号 BG207395566",
  },
  breadcrumbs: {
    ariaLabel: "パンくずリスト",
    home: "ホーム",
    docs: "ドキュメント",
    blog: "ブログ",
  },
  home: {
    copyCode: {
      idle: "コピー",
      copied: "コピーしました",
      failed: "コピーできませんでした",
    },
    humanTitle: "自分で操作する",
    humanWebApp: "Web アプリ",
    agentTitle: "AI エージェント向け",
    agentDescription:
      "MCP に対応するクライアントに Expense Budget Tracker のサーバーを追加すると、付与した権限に応じて AI エージェントが家計データを読み取ったり、更新したりできます。",
    showcaseEyebrow: "アプリ画面",
    showcaseTitle: "機能一覧の前に、予算管理の画面を見てみましょう",
    showcaseImageAlt:
      "Expense Budget Tracker の画面。AI チャットと、予算表のカテゴリ、支出の実績額、今月の予算、翌月以降の予定額が表示されています。",
  },
  docs: {
    title: "ドキュメント",
    description:
      "使い始める手順、AI エージェントと MCP の設定、セルフホスティング、API リファレンス、アーキテクチャの概要。",
  },
  blogIndex: {
    title: "ブログ",
    description: "Expense Budget Tracker の最新情報、使い方、家計管理のヒントを紹介します。",
    empty: "記事は近日公開予定です。",
  },
  blogPost: {
    publishedLabel: "公開日",
    bylinePrefix: "著者",
    relatedHeading: "関連記事",
  },
  blogCta: {
    heading: "Expense Budget Tracker を使ってみる",
    buttonLabel: "試してみる",
  },
  legal: {
    lastUpdated: "最終更新日：",
  },
} satisfies ReturnType<typeof getSiteMessages>;
