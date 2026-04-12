import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_ZH: PageContent = {
  locale: "zh",
  title: "功能",
  description:
    "多币种追踪、预算规划、仪表盘、智能体接入、SQL API、自托管和 workspace 隔离。",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "功能",
      intro: "管理个人财务所需的核心能力，同时保留对自己数据的控制权。",
      items: [
        {
          title: "多币种账户",
          description: "每笔交易以原始币种保存，仅在查询时换算到报告币种。",
        },
        {
          title: "预算网格",
          description: "以月为单位管理收入和支出预算，并持续比较计划与实际。",
        },
        {
          title: "余额跟踪",
          description: "账户余额从账本自动推导，账户间转账被视为一等操作。",
        },
        {
          title: "仪表盘",
          description: "内置支出分布、余额趋势和汇率影响分析，无需外部 BI 工具。",
        },
        {
          title: "SQL API",
          description: "通过 API Gateway 和 ApiKey 访问受限 SQL，并始终应用 RLS。",
        },
        {
          title: "智能体接入",
          description: "把 discovery URL 交给智能体，确认邮件验证码后即可完成连接。",
        },
        {
          title: "AI 聊天",
          description: "内置聊天界面理解你的财务数据，可直接回答支出与预算相关问题。",
        },
      ],
    },
  ],
  body: "",
};
