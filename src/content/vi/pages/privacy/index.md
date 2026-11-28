---
title: Chính sách quyền riêng tư
description: Chính sách quyền riêng tư của Expense Budget Tracker.
slug: privacy
sections:
  - type: legal_page
    lastUpdated: Tháng 8 năm 2026
---
## Dữ liệu chúng tôi thu thập

Khi bạn dùng phiên bản đám mây, chúng tôi lưu dữ liệu tài chính bạn nhập (giao dịch, ngân sách, tên tài khoản) và địa chỉ email của bạn để xác thực. Các bản tự lưu trữ không gửi dữ liệu về cho chúng tôi.

## Đơn vị vận hành

SAMO DANNI EOOD (VAT: BG207395566) vận hành dịch vụ Expense Budget Tracker trên đám mây. Kirill Markin phát triển Expense Budget Tracker. [kirill-markin.com](https://kirill-markin.com/) là trang web cá nhân của Kirill Markin, gắn với hệ sinh thái sản phẩm này.

Chính sách này áp dụng cho trang web, ứng dụng, API và dịch vụ MCP từ xa do chúng tôi vận hành. Các bản tự lưu trữ thuộc quyền kiểm soát của đơn vị vận hành tương ứng.

## Cách chúng tôi sử dụng dữ liệu của bạn

Chúng tôi chỉ dùng dữ liệu tài chính của bạn để cung cấp dịch vụ. Chúng tôi không bán dữ liệu hoặc dùng dữ liệu cho quảng cáo. Chúng tôi chỉ cung cấp dữ liệu cho ứng dụng khách bên thứ ba khi bạn yêu cầu dịch vụ làm vậy, ví dụ khi bạn cấp quyền cho một kết nối MCP. Postgres dùng bảo mật cấp hàng để tách biệt từng không gian làm việc.

## MCP và ứng dụng khách AI của bên thứ ba

Khi bạn kết nối ứng dụng khách AI với dịch vụ MCP do chúng tôi vận hành, Expense Budget Tracker xử lý yêu cầu cấp quyền OAuth, yêu cầu gọi công cụ và các đối số đi kèm, không gian làm việc được chọn và các bản ghi tài chính cần thiết để đáp ứng yêu cầu đọc hoặc thực hiện thao tác ghi đã được chấp thuận. Các thay đổi qua MCP và qua ứng dụng web đều được ghi vào cùng bộ dữ liệu tài chính trên đám mây.

Dịch vụ lưu tên và các URL chuyển hướng của ứng dụng khách đã đăng ký, siêu dữ liệu về kết nối và phạm vi quyền, các mốc thời gian tạo kết nối, hoạt động và thu hồi, cùng các giá trị băm một chiều của mã cấp quyền OAuth, mã thông báo truy cập và mã thông báo làm mới. Dịch vụ không lưu mã thông báo OAuth ở dạng gốc. Dịch vụ MCP nhận từng yêu cầu gọi công cụ và trả về kết quả được yêu cầu. Dịch vụ không ghi cuộc trò chuyện trong ứng dụng khách AI vào lịch sử trò chuyện của Expense Budget Tracker.

Ứng dụng khách AI do một bên thứ ba độc lập cung cấp. Bên đó có thể xử lý hoặc lưu câu lệnh, đối số công cụ và dữ liệu tài chính trả về theo điều khoản và chính sách quyền riêng tư của họ. Hãy xem chính sách của bên cung cấp ứng dụng khách trước khi kết nối. Bạn có thể thu hồi kết nối MCP bất kỳ lúc nào trong **Cài đặt > Quyền truy cập của tác nhân và chương trình**. Bạn có thể xóa tài khoản đăng nhập và dữ liệu liên quan trên đám mây trong Cài đặt như mô tả bên dưới.

## Lưu trữ dữ liệu

Chúng tôi lưu dữ liệu đám mây trên AWS RDS (Postgres) ở khu vực eu-central-1 và sao lưu tự động hằng ngày. Dữ liệu được mã hóa khi lưu trữ và khi truyền đi.

## Cookie

Chúng tôi dùng cookie `session` để xác thực (HttpOnly, Secure, SameSite=Lax). Chúng tôi không dùng cookie theo dõi hay công cụ phân tích của bên thứ ba.

## Xóa dữ liệu

Bạn có thể xóa tài khoản đăng nhập và toàn bộ dữ liệu liên quan bất kỳ lúc nào trong phần Cài đặt của ứng dụng. Với bản tự lưu trữ, bạn trực tiếp kiểm soát cơ sở dữ liệu.

## Mã nguồn mở

Toàn bộ mã nguồn đều mở. Bạn có thể kiểm tra cụ thể ứng dụng xử lý dữ liệu của mình như thế nào.
