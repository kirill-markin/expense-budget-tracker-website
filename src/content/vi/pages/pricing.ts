import type { PageContent } from "@/lib/content/types";

export const PRICING_PAGE_CONTENT_VI: Omit<PageContent, "locale"> & { readonly locale: "vi" } = {
  locale: "vi",
  title: "Bảng giá",
  description:
    "Tự lưu trữ miễn phí hoặc dùng dịch vụ đám mây do Expense Budget Tracker vận hành. Mã nguồn mở, đầy đủ tính năng ở mọi gói.",
  slug: "pricing",
  sections: [
    {
      type: "pricing_tiers",
      title: "Bảng giá",
      intro: "Mọi gói đều có đầy đủ tính năng.",
      tiers: [
        {
          type: "link_tier",
          name: "Tự lưu trữ",
          price: "Miễn phí",
          highlighted: false,
          bullets: [
            "Toàn bộ mã nguồn trên GitHub",
            "Docker Compose + Postgres",
            "Đầy đủ tính năng",
            "Máy chủ của bạn, dữ liệu của bạn",
            "Hỗ trợ từ cộng đồng",
          ],
          cta: {
            label: "Xem trên GitHub",
            href: "https://github.com/kirill-markin/expense-budget-tracker",
          },
        },
        {
          type: "auth_tier",
          name: "Đám mây",
          price: "Miễn phí trong giai đoạn beta",
          highlighted: true,
          bullets: [
            "Dịch vụ đám mây vận hành trên AWS",
            "Sao lưu tự động",
            "Đầy đủ tính năng",
            "Xác thực bằng mã dùng một lần qua email",
            "Cập nhật tỷ giá hằng ngày",
          ],
          cta: {
            label: "Bắt đầu",
            href: "https://app.expense-budget-tracker.com",
          },
        },
      ],
    },
  ],
  body: "",
};
