---
title: Bắt đầu
description: Đăng ký dùng phiên bản đám mây hoặc thiết lập một bản riêng trong vài phút.
---

## Phiên bản đám mây

Cách nhanh nhất là dùng phiên bản đám mây có sẵn.

1. Truy cập [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. Đăng ký bằng email với mã dùng một lần, không cần mật khẩu
3. Bắt đầu theo dõi chi tiêu trong ứng dụng web
4. Nếu dùng ứng dụng khách hỗ trợ MCP, hãy thêm `https://mcp.expense-budget-tracker.com/mcp` rồi cấp quyền truy cập trong trình duyệt
5. Nếu dùng tác nhân qua dòng lệnh hoặc ứng dụng khách gọi HTTP trực tiếp, hãy bắt đầu với `GET https://api.expense-budget-tracker.com/v1/`

Bạn có thể dùng ngay mà không cần cài đặt hay thiết lập máy chủ. Postgres dùng bảo mật cấp hàng để tách biệt dữ liệu theo từng không gian làm việc.

## Truy cập từ tác nhân và chương trình

Bạn có thể dùng cùng một tài khoản đăng nhập trên đám mây cho cả ba cách truy cập sau.

- Giao diện web tại `https://app.expense-budget-tracker.com`
- [Trình kết nối MCP](/vi/docs/mcp-connector/) do dịch vụ vận hành tại `https://mcp.expense-budget-tracker.com/mcp`, với bước cấp quyền OAuth trong trình duyệt
- [Thiết lập Agent API](/vi/docs/agent-setup/) từ `GET https://api.expense-budget-tracker.com/v1/`, sau đó gửi yêu cầu HTTP trực tiếp với `Authorization: ApiKey <key>`

## Tự lưu trữ

Nếu muốn tự vận hành một bản riêng, hãy xem [hướng dẫn tự lưu trữ](/vi/docs/self-hosting/).

## Chế độ dùng thử

Ứng dụng có sẵn chế độ dùng thử. Dùng nút chuyển **Tất cả / Demo** ở đầu trang để xem giao diện với dữ liệu mẫu mà không cần cơ sở dữ liệu.
