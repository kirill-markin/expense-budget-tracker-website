import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_VI: Omit<PageContent, "locale"> & { readonly locale: "vi" } = {
  locale: "vi",
  title: "Expense Budget Tracker - Công cụ quản lý tài chính cá nhân mã nguồn mở",
  description:
    "Công cụ mã nguồn mở để theo dõi chi tiêu và lập ngân sách, hỗ trợ nhiều loại tiền tệ, bảng tổng quan tài chính, máy chủ MCP trên đám mây và Agent API.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Theo dõi chi tiêu.",
        "Lập ngân sách.",
        "Làm chủ dữ liệu.",
      ],
      subtitle:
        "Theo dõi tài chính cá nhân bằng công cụ mã nguồn mở hỗ trợ nhiều loại tiền tệ, lập ngân sách và xem bảng tổng quan. Để kết nối Claude Code, Codex hoặc OpenClaw, bạn chỉ cần gửi URL khám phá API và cung cấp mã xác minh nhận qua email. Tác nhân xử lý các bước còn lại.",
      primaryLink: {
        label: "Bắt đầu",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "Xem trên GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "Kết nối ứng dụng khách hỗ trợ MCP từ xa và OAuth",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
      },
    },
    {
      type: "feature_list",
      title: "Tính năng",
      intro:
        "Theo dõi tài chính cá nhân và giữ quyền kiểm soát dữ liệu của bạn.",
      items: [
        {
          title: "Đa tiền tệ",
          description:
            "Theo dõi tài khoản bằng bất kỳ loại tiền tệ nào. Ứng dụng tự quy đổi theo tỷ giá từ ECB, CBR và NBS.",
        },
        {
          title: "Lập ngân sách",
          description:
            "Lập ngân sách hằng tháng theo danh mục thu nhập và chi tiêu. So sánh số tiền dự kiến với số tiền thực tế.",
        },
        {
          title: "Bảng tổng quan",
          description:
            "Xem biểu đồ chi tiêu theo nhóm, số dư theo thời gian và ảnh hưởng của tỷ giá đến danh mục tài sản của bạn.",
        },
        {
          title: "Tự lưu trữ",
          description:
            "Chạy bằng Docker Compose với Postgres. Dữ liệu nằm trên máy chủ của bạn và hệ thống không phụ thuộc vào bên thứ ba.",
        },
        {
          title: "MCP và Agent API",
          description:
            "Kết nối ứng dụng khách hỗ trợ MCP từ xa và OAuth để truy vấn dữ liệu tài chính. Quyền expenses:read là bắt buộc. Ứng dụng khách cũng có thể yêu cầu quyền expenses:write để thêm, sửa hoặc xóa dữ liệu. Quyền này sẽ hiện trên màn hình cấp quyền OAuth. Với tác nhân dùng CLI hoặc gọi HTTP trực tiếp, hãy bắt đầu với GET https://api.expense-budget-tracker.com/v1/ rồi xác thực với Agent API bằng ApiKey.",
        },
        {
          title: "Tách biệt không gian làm việc",
          description:
            "Postgres bảo vệ dữ liệu ở cấp hàng. Mỗi người dùng có một không gian làm việc riêng biệt và có thể chia sẻ qua lời mời.",
        },
      ],
    },
  ],
  body: "",
};
