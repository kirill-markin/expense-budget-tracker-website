import type { getSiteMessages } from "@/lib/i18n/messages";

export const messages = {
  auth: {
    login: "로그인",
    signup: "무료 가입",
    openApp: "앱 열기",
  },
  header: {
    features: "기능",
    pricing: "요금",
    docs: "문서",
    blog: "블로그",
    toggleMenu: "메뉴 전환",
  },
  footer: {
    productTitle: "제품",
    openSourceTitle: "오픈 소스",
    legalTitle: "법률 정보",
    documentation: "문서",
    selfHostingGuide: "자체 호스팅 가이드",
    support: "지원",
    privacyPolicy: "개인정보 처리방침",
    termsOfService: "서비스 이용약관",
    builtBy: "제작: Kirill Markin",
    localeSwitcherAriaLabel: "언어 선택",
    localeSearchLabel: "언어 검색",
    localeSearchEmpty: "일치하는 언어가 없습니다.",
    operatedBy: "운영: SAMO DANNI EOOD · VAT: BG207395566 · 국가: 불가리아",
  },
  breadcrumbs: {
    home: "홈",
    docs: "문서",
    blog: "블로그",
  },
  home: {
    humanTitle: "직접 사용",
    humanWebApp: "웹 앱",
    agentTitle: "AI 에이전트 연동",
    agentDescription:
      "MCP로 AI 에이전트를 연결하세요. 호환되는 MCP 클라이언트에 Expense Budget Tracker 서버를 추가하면 에이전트가 재무 데이터를 조회하고 변경할 수 있습니다.",
    showcaseEyebrow: "실제 앱 화면",
    showcaseTitle: "기능을 살펴보기 전에 예산 관리 화면부터 보세요",
    showcaseImageAlt:
      "AI 채팅, 예산 카테고리, 실제 지출액, 이번 달 내역, 앞으로의 예산 계획이 표시된 Expense Budget Tracker 화면.",
  },
  docs: {
    title: "문서",
    description:
      "시작하기, AI 에이전트와 MCP 설정, 자체 호스팅, API 레퍼런스, 아키텍처 개요를 확인하세요.",
  },
  blogIndex: {
    title: "블로그",
    description: "Expense Budget Tracker의 소식, 사용법, 재무 관리 팁을 확인하세요.",
    empty: "곧 새 글을 올립니다.",
  },
  blogPost: {
    publishedLabel: "게시일",
    bylinePrefix: "작성자",
    relatedHeading: "함께 읽을 글",
  },
  blogCta: {
    heading: "Expense Budget Tracker를 사용해 보세요",
    buttonLabel: "사용해 보기",
  },
  legal: {
    lastUpdated: "마지막 업데이트:",
  },
} satisfies ReturnType<typeof getSiteMessages>;
