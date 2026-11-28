import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_KO = {
  locale: "ko",
  title: "Expense Budget Tracker - 오픈 소스 개인 재무 관리",
  description:
    "여러 통화와 재무 대시보드를 지원하는 오픈 소스 지출·예산 관리 도구입니다. 호스팅형 MCP 서버와 에이전트 API를 제공합니다.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "지출을 기록하세요.",
        "예산을 세우세요.",
        "데이터는 직접 관리하세요.",
      ],
      subtitle:
        "여러 통화로 지출을 기록하고 예산을 세울 수 있는 오픈 소스 재무 관리 도구입니다. 재무 현황은 대시보드에서 확인하세요. Claude Code, Codex 또는 OpenClaw에 API 안내 URL을 알려 주고 이메일 인증 코드를 확인하면 나머지 설정은 에이전트가 처리합니다.",
      primaryLink: {
        label: "시작하기",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "GitHub에서 보기",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "OAuth를 지원하는 원격 MCP 클라이언트에서 이 주소에 연결하세요.",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
      },
    },
    {
      type: "feature_list",
      title: "기능",
      intro: "개인 재무를 관리하면서 데이터도 직접 통제할 수 있습니다.",
      items: [
        {
          title: "여러 통화 지원",
          description:
            "어떤 통화든 계좌의 원래 통화로 기록할 수 있습니다. ECB, CBR, NBS 환율로 금액을 자동 환산합니다.",
        },
        {
          title: "예산 계획",
          description:
            "월별 예산표에서 수입과 지출을 카테고리별로 나누고 계획 금액과 실제 금액을 비교하세요.",
        },
        {
          title: "대시보드",
          description:
            "어디에 돈을 썼는지, 잔액이 어떻게 바뀌었는지, 환율이 전체 자산에 어떤 영향을 줬는지 차트로 확인하세요.",
        },
        {
          title: "자체 호스팅",
          description:
            "Docker Compose와 Postgres로 실행합니다. 데이터는 자체 서버에 보관되며 외부 서비스에 의존하지 않습니다.",
        },
        {
          title: "MCP 및 에이전트 API",
          description:
            "OAuth를 지원하는 원격 MCP 클라이언트에서 필수 권한인 expenses:read로 재무 데이터를 조회할 수 있습니다. 클라이언트는 선택 권한인 expenses:write도 요청할 수 있습니다. 이 권한은 OAuth 동의 화면에 표시되며 데이터를 추가, 수정 또는 삭제할 때 필요합니다. CLI에서 실행하거나 HTTP를 직접 호출하는 에이전트는 GET https://api.expense-budget-tracker.com/v1/ 요청으로 시작한 뒤 ApiKey로 에이전트 API를 사용합니다.",
        },
        {
          title: "워크스페이스 격리",
          description:
            "Postgres의 행 수준 보안으로 사용자마다 별도의 워크스페이스가 제공됩니다. 다른 사람을 초대해 공유할 수 있습니다.",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "ko" };
