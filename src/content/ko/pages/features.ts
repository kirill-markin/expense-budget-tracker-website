import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_KO = {
  locale: "ko",
  title: "기능",
  description:
    "여러 통화로 거래를 기록하고 예산을 세우세요. 대시보드, 호스팅형 MCP, 에이전트 API, 자체 호스팅, 워크스페이스 격리도 지원합니다.",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "기능",
      intro: "개인 재무를 관리하면서 데이터도 직접 통제할 수 있습니다.",
      items: [
        {
          title: "여러 통화의 계좌 관리",
          description:
            "모든 거래를 원래 통화로 저장합니다. 조회할 때 ECB, CBR, NBS의 일별 환율을 적용해 보고 기준 통화로 환산하므로 원래 금액 정보가 그대로 남습니다.",
        },
        {
          title: "예산표",
          description:
            "수입과 지출을 카테고리별로 나눠 월별 예산을 세우세요. 계획 금액과 실제 금액의 차이를 확인할 수 있습니다. 변경할 때마다 감사 로그에 새 항목이 쌓입니다.",
        },
        {
          title: "잔액 추적",
          description:
            "장부 항목을 바탕으로 계좌별 잔액을 자동으로 계산합니다. 합계는 원하는 통화로 확인할 수 있고, 내 계좌 사이의 이체는 별도 거래 유형으로 기록합니다.",
        },
        {
          title: "대시보드",
          description:
            "지출 내역을 항목별로 살펴보고 잔액 추이와 환율의 영향을 차트로 확인하세요. 앱에서 바로 볼 수 있어 별도의 BI 도구가 필요 없습니다.",
        },
        {
          title: "에이전트 API",
          description:
            "CLI에서 실행하거나 HTTP를 직접 호출하는 에이전트를 위한 별도 경로입니다. GET https://api.expense-budget-tracker.com/v1/ 요청으로 시작한 뒤 ApiKey로 인증해 제한된 SQL을 실행합니다. 이 경로에도 행 수준 보안(RLS)이 적용됩니다. 워크스페이스를 선택할 수 있고, 요청 횟수 제한과 감사 기능이 제공됩니다.",
        },
        {
          title: "호스팅형 MCP 서버",
          description:
            "OAuth를 지원하는 원격 MCP 클라이언트는 https://mcp.expense-budget-tracker.com/mcp 주소에 연결해 필수 권한인 expenses:read로 재무 데이터를 조회할 수 있습니다. 클라이언트는 선택 권한인 expenses:write도 요청할 수 있습니다. 이 권한은 OAuth 동의 화면에 표시되며 데이터를 추가, 수정 또는 삭제할 때 필요합니다.",
        },
        {
          title: "AI 채팅",
          description:
            "앱에서 AI 채팅으로 실제 장부 항목을 살펴보세요. 지출에 관해 질문하고, 기간별로 지출을 비교하거나 재무 현황을 분석할 수 있습니다.",
        },
        {
          title: "워크스페이스 격리",
          description:
            "Postgres의 행 수준 보안으로 데이터를 격리합니다. 사용자마다 워크스페이스가 제공되며, 공유 워크스페이스에 다른 사람을 초대하고 접근 권한을 관리할 수 있습니다.",
        },
        {
          title: "자체 호스팅",
          description:
            "Docker Compose와 Postgres로 로컬이나 자체 서버에서 실행하세요. 특정 업체에 종속되지 않고 재무 데이터를 전부 직접 관리할 수 있습니다.",
        },
        {
          title: "비밀번호 없는 인증",
          description:
            "AWS Cognito를 통해 이메일로 일회용 인증 코드를 받습니다. 비밀번호를 기억할 필요도, 유출을 걱정할 필요도 없습니다. 누구나 가입할 수 있으며 가입하면 워크스페이스가 자동으로 만들어집니다.",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "ko" };
