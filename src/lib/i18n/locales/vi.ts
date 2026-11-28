import type { getSiteMessages } from "@/lib/i18n/messages";

export const messages: ReturnType<typeof getSiteMessages> = {
  auth: {
    login: "Đăng nhập",
    signup: "Đăng ký miễn phí",
    openApp: "Mở ứng dụng",
  },
  header: {
    features: "Tính năng",
    pricing: "Bảng giá",
    docs: "Tài liệu",
    blog: "Blog",
    toggleMenu: "Mở hoặc đóng menu",
  },
  footer: {
    productTitle: "Sản phẩm",
    openSourceTitle: "Mã nguồn mở",
    legalTitle: "Pháp lý",
    documentation: "Tài liệu",
    selfHostingGuide: "Hướng dẫn tự lưu trữ",
    support: "Hỗ trợ",
    privacyPolicy: "Chính sách quyền riêng tư",
    termsOfService: "Điều khoản dịch vụ",
    builtBy: "Do Kirill Markin phát triển",
    localeSwitcherAriaLabel: "Chọn ngôn ngữ",
    localeSearchLabel: "Tìm ngôn ngữ",
    localeSearchEmpty: "Không tìm thấy ngôn ngữ nào.",
    operatedBy: "Đơn vị vận hành: SAMO DANNI EOOD · VAT: BG207395566 · Quốc gia: Bulgaria",
  },
  breadcrumbs: {
    home: "Trang chủ",
    docs: "Tài liệu",
    blog: "Blog",
  },
  home: {
    humanTitle: "Dành cho người dùng",
    humanWebApp: "Ứng dụng web",
    agentTitle: "Dành cho tác nhân AI",
    agentDescription:
      "Kết nối tác nhân AI qua MCP. Thêm máy chủ Expense Budget Tracker vào ứng dụng khách MCP tương thích để tác nhân có thể đọc và cập nhật dữ liệu tài chính của bạn.",
    showcaseEyebrow: "Giao diện thực tế",
    showcaseTitle: "Xem cách quản lý ngân sách trong ứng dụng",
    showcaseImageAlt:
      "Giao diện Expense Budget Tracker hiển thị phần trò chuyện với AI, danh mục ngân sách, chi tiêu thực tế, tháng hiện tại và kế hoạch các tháng tới.",
  },
  docs: {
    title: "Tài liệu",
    description:
      "Hướng dẫn bắt đầu, kết nối tác nhân AI qua API hoặc MCP, tự lưu trữ, tra cứu API và tìm hiểu kiến trúc hệ thống.",
  },
  blogIndex: {
    title: "Blog",
    description: "Tin mới, hướng dẫn và kinh nghiệm sử dụng Expense Budget Tracker.",
    empty: "Sắp có bài viết.",
  },
  blogPost: {
    publishedLabel: "Ngày đăng",
    bylinePrefix: "Tác giả",
    relatedHeading: "Đọc tiếp",
  },
  blogCta: {
    heading: "Dùng thử Expense Budget Tracker",
    buttonLabel: "Dùng thử",
  },
  legal: {
    lastUpdated: "Cập nhật lần cuối:",
  },
};
