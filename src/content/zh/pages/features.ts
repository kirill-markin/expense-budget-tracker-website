import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_ZH: PageContent = {
  locale: "zh",
  title: "功能",
  description:
    "多币种追踪、预算规划、仪表盘、智能体接入、API 访问、自托管和工作区隔离。",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "功能",
      intro: "追踪个人财务所需的一切能力，同时不必放弃对自己数据的控制权。",
      items: [
        {
          title: "多币种账户",
          description:
            "每笔交易都以原始币种保存。来自 ECB、CBR 和 NBS 的每日汇率会在查询时把所有数据换算为你的报表币种，而不是预先做有损转换。",
        },
        {
          title: "预算网格",
          description:
            "按月管理收入和支出分类预算。你可以设置计划值、对比实际结果并跟踪差额。每一次变更都会保留追加式审计记录。",
        },
        {
          title: "余额跟踪",
          description:
            "每个账户的滚动余额都会从总账自动推导出来。你可以用任意币种查看总额，自己账户之间的转账也被当作一等操作来处理。",
        },
        {
          title: "仪表盘",
          description:
            "内置支出结构可视化、余额随时间变化图表，以及汇率影响分析。不需要额外接入外部 BI 工具。",
        },
        {
          title: "SQL API",
          description:
            "通过 API Gateway 和 ApiKey 以编程方式访问系统。你可以执行受限 SQL，并且始终启用完整的 RLS 约束、已保存的默认工作区选择、可选的 `X-Workspace-Id` 覆盖、速率限制和审计能力。",
        },
        {
          title: "智能体接入",
          description:
            "把 https://api.expense-budget-tracker.com/v1/ 提供给 Claude Code、Codex 或 OpenClaw。智能体会按照 discovery 文档引导流程，询问你的邮箱和 8 位验证码，创建自己的连接，保存返回的 key，选择默认工作区，并继续通过机器 API 工作。",
        },
        {
          title: "AI 聊天",
          description:
            "内置聊天界面能够理解你的财务数据。你可以直接询问支出情况、比较不同时间段，或获取基于真实总账记录的洞察。",
        },
        {
          title: "工作区隔离",
          description:
            "Postgres 行级安全会强制执行数据隔离。每位用户都会拥有一个工作区，你也可以邀请其他人加入共享工作区，并通过完整的访问控制来管理权限。",
        },
        {
          title: "自托管",
          description:
            "基于 Docker Compose 和 Postgres，可在本地运行，也可以部署到你自己的服务器上。没有厂商锁定，你可以完全掌控自己的财务数据。",
        },
        {
          title: "无密码认证",
          description:
            "通过 AWS Cognito 提供邮箱 OTP 登录。不需要记住密码，也不会因为密码泄露而出问题。开放注册，并自动创建工作区。",
        },
      ],
    },
  ],
  body: "",
};
