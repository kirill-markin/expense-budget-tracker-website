---
title: Trình kết nối MCP
description: Kết nối ứng dụng khách MCP với Expense Budget Tracker qua OAuth để truy vấn hoặc cập nhật dữ liệu tài chính một cách an toàn.
---

## Tổng quan

Trình kết nối Model Context Protocol (MCP) trên đám mây của Expense Budget Tracker có tại địa chỉ sau.

`https://mcp.expense-budget-tracker.com/mcp`

Điểm cuối này dùng Streamable HTTP và OAuth. Hãy gửi URL trên cho ứng dụng khách MCP có hỗ trợ máy chủ Streamable HTTP từ xa và cơ chế khám phá OAuth. Quy trình cấp quyền sẽ mở trình duyệt để bạn đăng nhập và chấp thuận quyền truy cập.

Ứng dụng khách gửi mã thông báo truy cập OAuth đến điểm cuối MCP. Khi cần gia hạn quyền truy cập, ứng dụng khách gửi mã thông báo làm mới đến máy chủ cấp quyền. `ApiKey` có hiệu lực lâu dài trong [tài liệu tham chiếu Agent API](/vi/docs/api/) dùng cho một cách tích hợp riêng qua HTTP trực tiếp. Điểm cuối MCP không chấp nhận khóa đó.

## Khám phá OAuth và kết nối

Siêu dữ liệu về tài nguyên được bảo vệ của trình kết nối có tại địa chỉ sau.

`https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp`

Thông tin này cho ứng dụng khách biết cần liên hệ máy chủ cấp quyền nào. Siêu dữ liệu của máy chủ cấp quyền có tại địa chỉ sau.

`https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server`

Ứng dụng khách tương thích thực hiện các bước sau.

1. Kết nối tới `https://mcp.expense-budget-tracker.com/mcp` và tìm siêu dữ liệu tài nguyên được bảo vệ.
2. Đăng ký động dưới dạng ứng dụng khách OAuth công khai. Luồng này không dùng khóa bí mật của ứng dụng khách.
3. Bắt đầu luồng mã cấp quyền và mở URL cấp quyền trong trình duyệt của người dùng.
4. Dùng PKCE cho mọi yêu cầu cấp quyền. Phương thức duy nhất được hỗ trợ để tạo mã thử thách PKCE là `S256`.
5. Yêu cầu `expenses:read`. Chỉ thêm `expenses:write` khi ứng dụng khách cần gọi `sql_execute`.
6. Đổi mã cấp quyền lấy mã thông báo truy cập và mã thông báo làm mới. Sau đó, ứng dụng khách tự làm mới mã truy cập khi cần.

Đừng sao chép mã thông báo vào câu lệnh, lịch sử trò chuyện, tệp mã nguồn hay nhật ký. Chỉ lưu chúng trong kho thông tin xác thực của ứng dụng khách MCP.

## Phạm vi quyền

- `expenses:read` là quyền bắt buộc. Quyền này cho phép tìm các không gian làm việc, xem lược đồ và chạy truy vấn chỉ đọc.
- `expenses:write` là quyền tùy chọn. Quyền này được cấp riêng để dùng công cụ `sql_execute`, có thể thêm, sửa hoặc xóa dữ liệu.

Chỉ yêu cầu những quyền cần thiết để thực hiện công việc. Nếu chỉ cần phân tích dữ liệu hoặc lập báo cáo, ứng dụng khách nên yêu cầu `expenses:read`. Không cần `expenses:write` cho các tác vụ đó.

## Công cụ

### `list_workspaces`

Liệt kê các không gian làm việc mà người dùng đã đăng nhập có thể truy cập. Dùng mã định danh không gian làm việc trả về để chỉ rõ nơi cần đọc hoặc thay đổi dữ liệu.

### `get_schema`

Trả về các quan hệ và cột mà MCP cho phép truy cập trong không gian làm việc đã chọn. Hãy gọi công cụ này trước khi viết SQL để lấy đúng tên bảng và cột.

### `sql_query`

Chạy một truy vấn SQL chỉ đọc trong phạm vi cho phép ở không gian làm việc đã chọn. Cơ sở dữ liệu cũng buộc truy vấn này chạy ở chế độ chỉ đọc. Kết quả tối đa 100 dòng và thời hạn thực thi là 20 giây.

### `sql_execute`

Chạy SQL trong phạm vi cho phép để thay đổi dữ liệu ở không gian làm việc đã chọn. Công cụ này có thể thêm, sửa hoặc xóa dữ liệu và yêu cầu quyền riêng `expenses:write`. Hãy xác nhận không gian làm việc và kiểm tra nguyên văn câu lệnh trước khi chấp thuận thực thi.

Máy chủ MCP cung cấp `sql_execute` để thay đổi dữ liệu. Với `sql_query`, cơ sở dữ liệu bảo đảm truy vấn chỉ có quyền đọc.

## Cách dùng an toàn

1. Gọi `list_workspaces` và xác nhận với người dùng không gian làm việc cần dùng.
2. Gọi `get_schema` trước khi tạo câu lệnh SQL.
3. Dùng `sql_query` để kiểm tra dữ liệu, tính tổng, đối soát và lập báo cáo.
4. Chỉ yêu cầu `expenses:write` cho việc cần thay đổi dữ liệu.
5. Trước khi gọi `sql_execute`, hiển thị nguyên văn câu lệnh và tác động dự kiến, rồi xác nhận lại không gian làm việc.
6. Sau thao tác ghi, dùng `sql_query` để kiểm tra kết quả.

Máy chủ giới hạn các câu lệnh SQL được chấp nhận và những quan hệ có thể truy cập. Bạn vẫn cần kiểm tra kỹ câu lệnh SQL được tạo.

## Giới hạn

- Kết quả SQL tối đa 100 dòng
- Thời hạn thực thi 20 giây
- Chỉ được truy cập các không gian làm việc mà người dùng đã đăng nhập có quyền sử dụng
- `sql_query` giới hạn SQL được chấp nhận và áp dụng chế độ chỉ đọc ở cấp cơ sở dữ liệu
- `sql_execute` yêu cầu `expenses:write` ngoài quyền đọc bắt buộc

## Quyền riêng tư và tự lưu trữ

Ứng dụng khách MCP đã được cấp quyền có thể đọc dữ liệu tài chính. Với `expenses:write`, ứng dụng khách cũng có thể thay đổi dữ liệu đó. Hãy xem [chính sách quyền riêng tư](/vi/privacy/) và chính sách xử lý dữ liệu của ứng dụng khách trước khi kết nối.

Các URL trên chỉ áp dụng cho dịch vụ đám mây của Expense Budget Tracker. Để tự triển khai, hãy bắt đầu với [hướng dẫn tự lưu trữ](/vi/docs/self-hosting/) rồi cấu hình điểm cuối MCP và siêu dữ liệu OAuth cho các tên miền của bạn. Bạn có thể xem phần triển khai trong [kho mã nguồn](https://github.com/kirill-markin/expense-budget-tracker).
