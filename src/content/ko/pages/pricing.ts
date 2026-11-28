import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_KO = {
  locale: "ko",
  title: "요금",
  description:
    "무료로 직접 호스팅하거나 관리형 클라우드를 이용할 수 있습니다. 오픈 소스이며 모든 요금제에서 전체 기능을 제공합니다.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "요금",
      intro: "모든 요금제에서 전체 기능을 이용할 수 있습니다.",
      tiers: [
        {
          type: "link_tier",
          name: "자체 호스팅",
          price: "무료",
          highlighted: false,
          bullets: [
            "GitHub에 전체 소스 코드 공개",
            "Docker Compose + Postgres",
            "전체 기능 포함",
            "자체 서버에서 데이터 직접 관리",
            "커뮤니티 지원",
          ],
          cta: {
            label: "GitHub에서 보기",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "클라우드",
          price: "베타 기간 무료",
          highlighted: true,
          bullets: [
            "AWS 관리형 호스팅",
            "자동 백업",
            "전체 기능 포함",
            "이메일 일회용 인증 코드",
            "일별 환율 업데이트",
          ],
          cta: {
            label: "시작하기",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "ko" };
