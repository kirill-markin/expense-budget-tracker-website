---
title: Thiết lập tác nhân AI
description: Gửi URL khám phá API cho Claude Code, Codex hoặc OpenClaw. Tác nhân làm theo hướng dẫn trong phản hồi, dùng mã xác minh gồm 8 chữ số để xác thực, lưu ApiKey có hiệu lực lâu dài rồi truy cập không gian làm việc của bạn.
---

## Đường dẫn cần gửi cho tác nhân

Hãy gửi đúng URL này.

`https://api.expense-budget-tracker.com/v1/`

Điểm cuối này cung cấp tài liệu khám phá API công khai chính thức cho các tác nhân AI. Tài liệu hướng dẫn tác nhân cách bắt đầu xác thực, gọi điểm cuối nào tiếp theo và dùng cơ chế xác thực nào sau đó. Tài liệu cũng chỉ nơi tìm lược đồ đang dùng và mã nguồn mở triển khai API.

Hướng dẫn này dành cho tác nhân chạy qua dòng lệnh và ứng dụng khách HTTP cần thiết lập kết nối trực tiếp qua Agent API. Nếu ứng dụng khách hỗ trợ MCP, hãy dùng [trình kết nối MCP](/vi/docs/mcp-connector/) do dịch vụ vận hành. Ứng dụng khách kết nối tới `https://mcp.expense-budget-tracker.com/mcp` rồi mở trình duyệt để bạn cấp quyền qua OAuth mà không cần thực hiện quy trình cấp ApiKey này.

## Các bước dành cho người dùng

1. Mở Claude Code, Codex, OpenClaw hoặc tác nhân khác có thể gửi yêu cầu HTTP.
2. Yêu cầu tác nhân kết nối với Expense Budget Tracker qua `https://api.expense-budget-tracker.com/v1/`.
3. Khi tác nhân hỏi địa chỉ email, hãy cung cấp email bạn dùng cho Expense Budget Tracker.
4. Kiểm tra hộp thư đến để lấy mã xác minh 8 chữ số.
5. Gửi lại mã đó cho tác nhân.
6. Để tác nhân lưu ApiKey nhận được bên ngoài bộ nhớ cuộc trò chuyện, rồi tiếp tục nhập dữ liệu, truy vấn hoặc lập ngân sách.

Bạn không cần sao chép và dán khóa khi đăng nhập. Sau khi mã gửi qua email được xác minh, tác nhân tự thiết lập kết nối.

## Các bước dành cho tác nhân

Thực hiện lần lượt các bước sau.

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Đọc phản hồi từ điểm cuối khám phá API và làm theo các thao tác được chỉ dẫn để tránh cố định sẵn các bước tiếp theo
3. Dùng `POST` để gửi email của người dùng tới `bootstrapUrl` được trả về
4. Nhận `otpSessionToken` và hành động `verify_code`
5. Hỏi người dùng mã xác minh 8 chữ số trong email
6. Dùng `POST` để gửi `code`, `otpSessionToken` và `label` của kết nối tới `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Nhận `ApiKey` mới
8. Lưu khóa bên ngoài bộ nhớ cuộc trò chuyện, ưu tiên tên `EXPENSE_BUDGET_TRACKER_API_KEY`
9. `GET https://api.expense-budget-tracker.com/v1/me` với `Authorization: ApiKey <key>`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Nếu cần, tạo không gian làm việc bằng `POST /v1/workspaces`
12. Lưu không gian làm việc mặc định bằng `POST /v1/workspaces/{workspaceId}/select`
13. Kiểm tra các quan hệ được phép truy cập bằng `GET https://api.expense-budget-tracker.com/v1/schema`
14. Đọc dữ liệu qua `POST https://api.expense-budget-tracker.com/v1/sql/query` và gửi thao tác ghi đã được chấp thuận qua `POST https://api.expense-budget-tracker.com/v1/sql/execute`

Tác nhân chỉ định không gian làm việc và máy chủ lưu lựa chọn đó. Sau `POST /v1/workspaces/{workspaceId}/select`, không gian làm việc được lưu cho khóa API đó, nên các lệnh gọi `/v1/sql/query` và `/v1/sql/execute` sau này có thể bỏ qua `X-Workspace-Id`. Bạn vẫn có thể gửi `X-Workspace-Id` để chọn không gian làm việc khác cho một yêu cầu cụ thể. Điểm cuối tương thích `POST /v1/sql` chỉ dành cho tập lệnh gồm nhiều câu lệnh cần chạy trong cùng một giao dịch nguyên tử. Các thao tác đọc hoặc ghi thông thường dùng điểm cuối riêng.

Nếu người dùng chỉ có đúng một không gian làm việc và khóa chưa có lựa chọn đã lưu, máy chủ tự lưu và dùng không gian đó.

## Thông tin tác nhân cần lưu

Khóa do `verify-code` trả về có hiệu lực lâu dài. Hãy lưu khóa ở nơi có thể dùng lại mà không phụ thuộc vào bộ nhớ cuộc trò chuyện.

- Nếu người dùng đồng ý cho ghi tệp, lưu khóa trong tệp `.env` cục bộ dưới dạng `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'`
- Nếu người dùng chưa đồng ý, xuất biến môi trường `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` trong phiên shell hiện tại rồi đề nghị người dùng lưu khóa ở nơi có thể dùng lại sau khi đóng phiên

Dùng các header HTTP sau để gửi yêu cầu có xác thực.

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` chỉ khi cần chọn không gian làm việc khác với lựa chọn đã lưu hoặc khi chưa có lựa chọn đã lưu

## Nếu bạn là tác nhân AI

Hãy bắt đầu bằng lệnh sau.

```bash
curl https://api.expense-budget-tracker.com/v1/
```

Sau đó làm theo chỉ dẫn trong phản hồi của máy chủ. Nếu tài liệu khám phá API đã chỉ rõ các bước tiếp theo, hãy dùng thông tin đó và tránh ghi cứng các bước.

Sau `verify-code`, hãy lưu `ApiKey` nhận được ở nơi an toàn. Sau đó, gọi các điểm cuối sau.

- `/v1/me` để lấy thông tin về tài khoản đăng nhập
- `/v1/workspaces` để lấy các không gian làm việc hiện có
- `/v1/schema` để biết các quan hệ và cột SQL được phép truy cập
- `/v1/openapi.json` hoặc `/v1/swagger.json` chỉ khi ứng dụng khách thăm dò các URL đặc tả theo quy ước. Các điểm cuối này trả về thông tin khám phá API và đường dẫn đến mã nguồn. Chúng không trả về bản đặc tả API

## Ví dụ câu lệnh dành cho người dùng

### Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Use my account email when needed, ask me for the 8-digit code, save the returned ApiKey outside chat memory, then import my latest bank statement from ~/Downloads.
```

### Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
Ask for my email, wait for the email code, save the key, inspect /schema, and then show my latest transactions.
```

### OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, list my workspaces, save one as the default for this key, and import the new CSV I uploaded.
```

## Việc bạn có thể làm sau khi thiết lập

- Nhập sao kê ngân hàng hoặc dữ liệu xuất từ thẻ
- Phân loại giao dịch theo các danh mục hiện có
- Đối soát số dư tài khoản với ngân hàng
- Truy vấn chi tiêu theo danh mục, giai đoạn, bên bán hoặc tài khoản
- Cập nhật các dòng ngân sách cho tháng sau

Xem [tài liệu tham chiếu API](/vi/docs/api/) để biết thêm về từng điểm cuối và cách xác thực.
