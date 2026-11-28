import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_VI: Omit<PageContent, "locale"> & { readonly locale: "vi" } = {
  locale: "vi",
  title: "Tính năng",
  description:
    "Theo dõi nhiều loại tiền tệ, lập ngân sách, xem bảng tổng quan, kết nối qua máy chủ MCP trên đám mây, dùng Agent API, tự lưu trữ và tách biệt dữ liệu theo không gian làm việc.",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "Tính năng",
      intro:
        "Theo dõi tài chính cá nhân và giữ quyền kiểm soát dữ liệu của bạn.",
      items: [
        {
          title: "Tài khoản đa tiền tệ",
          description:
            "Lưu mỗi giao dịch bằng đồng tiền gốc. Khi bạn xem dữ liệu, ứng dụng dùng tỷ giá hằng ngày từ ECB, CBR và NBS để quy đổi sang đồng tiền báo cáo. Dữ liệu gốc được giữ nguyên, tránh mất độ chính xác do quy đổi trước.",
        },
        {
          title: "Bảng ngân sách",
          description:
            "Lập ngân sách hằng tháng theo danh mục thu nhập và chi tiêu. Đặt số tiền dự kiến, đối chiếu với số tiền thực tế và theo dõi chênh lệch. Mỗi thay đổi được ghi thêm vào nhật ký kiểm toán, nên các bản ghi trước đó vẫn được giữ lại.",
        },
        {
          title: "Theo dõi số dư",
          description:
            "Ứng dụng tự tính số dư của từng tài khoản theo thời gian từ các bút toán trong sổ giao dịch. Bạn có thể xem tổng số dư theo bất kỳ loại tiền tệ nào. Các khoản chuyển giữa tài khoản của bạn có loại giao dịch riêng.",
        },
        {
          title: "Bảng tổng quan",
          description:
            "Xem cơ cấu chi tiêu, biểu đồ số dư theo thời gian và ảnh hưởng của biến động tỷ giá ngay trong ứng dụng. Không cần dùng công cụ BI riêng.",
        },
        {
          title: "Agent API",
          description:
            "Một cách truy cập riêng cho tác nhân dùng CLI hoặc gọi HTTP trực tiếp. Bắt đầu với GET https://api.expense-budget-tracker.com/v1/, sau đó xác thực bằng ApiKey để chạy SQL trong phạm vi cho phép. Agent API áp dụng đầy đủ RLS, cho phép chọn không gian làm việc, giới hạn tần suất yêu cầu và hỗ trợ kiểm toán.",
        },
        {
          title: "Máy chủ MCP trên đám mây",
          description:
            "Ứng dụng khách hỗ trợ MCP từ xa và OAuth có thể kết nối qua https://mcp.expense-budget-tracker.com/mcp. Để truy vấn dữ liệu tài chính, ứng dụng khách cần quyền expenses:read. Ứng dụng khách cũng có thể yêu cầu quyền expenses:write để thêm, sửa hoặc xóa dữ liệu. Quyền này sẽ hiện trên màn hình cấp quyền OAuth.",
        },
        {
          title: "Trò chuyện với AI",
          description:
            "Bạn có thể hỏi AI ngay trong ứng dụng về chi tiêu, so sánh các giai đoạn hoặc tìm hiểu biến động. AI trả lời dựa trên các bút toán của bạn.",
        },
        {
          title: "Tách biệt không gian làm việc",
          description:
            "Postgres dùng bảo mật cấp hàng để tách biệt dữ liệu. Mỗi người dùng có một không gian làm việc. Bạn có thể mời người khác vào không gian làm việc dùng chung và kiểm soát đầy đủ quyền truy cập.",
        },
        {
          title: "Tự lưu trữ",
          description:
            "Dùng Docker Compose với Postgres để chạy trên máy của bạn hoặc máy chủ riêng. Bạn toàn quyền kiểm soát dữ liệu tài chính và không bị ràng buộc với nhà cung cấp nào.",
        },
        {
          title: "Đăng nhập không cần mật khẩu",
          description:
            "AWS Cognito gửi mã dùng một lần qua email, nên bạn không cần nhớ mật khẩu hay lo mật khẩu bị lộ. Ai cũng có thể đăng ký và được tự động cấp một không gian làm việc.",
        },
      ],
    },
  ],
  body: "",
};
