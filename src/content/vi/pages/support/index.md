---
title: Hỗ trợ
description: Hướng dẫn nhận hỗ trợ và báo cáo vấn đề bảo mật cho Expense Budget Tracker, bao gồm dịch vụ MCP do chúng tôi vận hành.
slug: support
sections:
  - type: simple_markdown_page
---

## Hỗ trợ dịch vụ đám mây và MCP

Nếu cần trợ giúp về ứng dụng đám mây, tài khoản đăng nhập, cấp quyền OAuth hoặc máy chủ MCP công khai, hãy gửi email đến [markinkirill@gmail.com](mailto:markinkirill@gmail.com). Chúng tôi hỗ trợ trong khả năng của mình và không cam kết thời gian phản hồi.

Chỉ gửi thông tin cần thiết để chẩn đoán sự cố, gồm các mục sau.

- Tên và phiên bản của ứng dụng khách
- Ngày, giờ và múi giờ khi xảy ra lỗi
- Điểm cuối hoặc trang liên quan
- Bước OAuth hoặc tên công cụ MCP
- Nguyên văn thông báo lỗi đã loại bỏ thông tin nhạy cảm và mã yêu cầu nếu có hiển thị
- Kết quả bạn mong đợi và điều thực tế đã xảy ra

Tuyệt đối không gửi mật khẩu, cookie phiên, mã OAuth, mã thông báo truy cập hoặc mã thông báo làm mới, khóa API, bản ghi tài chính thô hoặc nội dung yêu cầu chưa được loại bỏ thông tin nhạy cảm.

## Báo cáo vấn đề bảo mật

Nếu nghi có lỗ hổng, đừng đăng lên mục Issues công khai của GitHub. Hãy gửi email đến [markinkirill@gmail.com](mailto:markinkirill@gmail.com) với tiêu đề **Expense Budget Tracker security report** và các bước tối thiểu để tái hiện lỗi, sau khi loại bỏ thông tin nhạy cảm. Đừng gửi thông tin xác thực còn hiệu lực hay dữ liệu tài chính. Nếu quyền truy cập có thể đã bị lộ, hãy thu hồi kết nối trong **Cài đặt > Quyền truy cập của tác nhân và chương trình** trước, rồi thay mới các thông tin xác thực khác bị ảnh hưởng.

## Lỗi, tự lưu trữ và câu hỏi cho cộng đồng

Dùng [mục Issues trên GitHub](https://github.com/kirill-markin/expense-budget-tracker/issues) để báo lỗi sản phẩm có thể tái hiện, hỏi về tự lưu trữ hoặc tham gia thảo luận công khai với cộng đồng. Hãy tìm xem đã có bài đăng nào về vấn đề đó chưa và xóa thông tin riêng tư khỏi nhật ký và ảnh chụp màn hình. Bạn có thể tìm thông tin về triển khai và phát triển trong [hướng dẫn tự lưu trữ](/vi/docs/self-hosting/) và [kho mã nguồn](https://github.com/kirill-markin/expense-budget-tracker).

## Trước khi báo sự cố MCP

Hãy xác nhận ứng dụng khách hỗ trợ MCP từ xa qua Streamable HTTP, luồng mã cấp quyền OAuth 2.1 với PKCE và Dynamic Client Registration. Dùng đúng điểm cuối chung trong [hướng dẫn MCP](/vi/docs/mcp-connector/), sau đó kết nối lại và thử thêm một lần. Nếu sự cố vẫn tiếp diễn, hãy gửi thông tin đã loại bỏ dữ liệu nhạy cảm theo danh sách trên.
