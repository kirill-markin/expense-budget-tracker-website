import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_ZH: PageContent = {
  locale: "zh",
  title: "功能",
  description:
    "支持多币种记账、预算规划、财务看板、智能体接入、API 访问、自托管与工作区隔离。",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "功能",
      intro: "个人财务管理需要的核心能力都在这里，同时数据控制权始终掌握在你手中。",
      items: [
        {
          title: "多币种账户",
          description:
            "每笔交易都按原始币种保存。系统会在读取时使用 ECB、CBR 和 NBS 的每日汇率换算为你的报表币种，避免提前换算带来的信息损失。",
        },
        {
          title: "预算网格",
          description:
            "按月规划收入和支出分类预算，设置目标值、对照实际发生额，并持续跟踪差额。每次调整都会留下只追加的审计记录。",
        },
        {
          title: "余额跟踪",
          description:
            "每个账户的滚动余额都会根据总账自动计算。你可以按任意币种查看汇总，自己账户之间的转账也会被完整建模和追踪。",
        },
        {
          title: "仪表盘",
          description:
            "内置支出结构、余额走势和汇率影响分析等可视化内容，无需再接入第三方 BI 工具。",
        },
        {
          title: "SQL API",
          description:
            "通过 API Gateway 暴露 SQL API，并使用 `ApiKey` 完成鉴权。你可以执行受限 SQL，同时继续受完整的 RLS 约束保护；默认沿用已保存的工作区，也可通过 `X-Workspace-Id` 临时覆盖，并保留速率限制与完整审计记录。",
        },
        {
          title: "智能体接入",
          description:
            "把 https://api.expense-budget-tracker.com/v1/ 交给 Claude Code、Codex 或 OpenClaw 即可开始。智能体会读取发现文档，向你确认邮箱和 8 位验证码，为自己建立连接、保存返回的 API 密钥、选定默认工作区，然后继续通过该 API 自主完成后续操作。",
        },
        {
          title: "AI 聊天",
          description:
            "内置 AI 对话界面能够直接理解你的财务数据。你可以询问支出情况、比较不同时间段，或基于真实总账记录获得可追溯的洞察。",
        },
        {
          title: "工作区隔离",
          description:
            "Postgres 行级安全（RLS）会在数据库层强制执行数据隔离。每位用户默认拥有独立工作区，也可以邀请他人加入共享工作区，并按权限进行访问控制。",
        },
        {
          title: "自托管",
          description:
            "基于 Docker Compose 和 Postgres，可在本地运行，也可部署到你自己的服务器上。没有供应商锁定，财务数据始终由你掌控。",
        },
        {
          title: "无密码认证",
          description:
            "通过 AWS Cognito 提供邮箱一次性验证码登录，无需记住密码，也不必承担密码泄露风险。开放注册，并自动为新用户创建工作区。",
        },
      ],
    },
  ],
  body: "",
};
