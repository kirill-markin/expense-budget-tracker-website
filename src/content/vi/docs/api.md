---
title: Tài liệu tham chiếu API
description: Hướng dẫn kết nối tác nhân và tài liệu tham chiếu API SQL để các chương trình có thể truy cập dữ liệu tài chính.
---

## Tổng quan

Expense Budget Tracker cung cấp một API công khai mà các chương trình có thể gọi tại địa chỉ sau.

`https://api.expense-budget-tracker.com/v1/`

Bạn có thể dùng API này theo hai cách.

1. **Thiết lập kết nối cho tác nhân**, bắt đầu với `GET /v1/`
2. **Gọi HTTP trực tiếp** bằng ApiKey có hiệu lực lâu dài mà bạn đã có

Mọi yêu cầu đều tuân theo cơ chế bảo mật cấp hàng của Postgres như trong ứng dụng web.

Nếu ứng dụng khách hỗ trợ MCP, hãy dùng [trình kết nối MCP](/vi/docs/mcp-connector/) do dịch vụ vận hành tại `https://mcp.expense-budget-tracker.com/mcp` rồi cấp quyền qua OAuth trong trình duyệt. Trang này trình bày cách kết nối qua Agent API và cách gọi HTTP trực tiếp bằng `ApiKey` có hiệu lực lâu dài.

## Khám phá API, mã nguồn và lược đồ đang dùng

Hãy bắt đầu tại địa chỉ sau.

`https://api.expense-budget-tracker.com/v1/`

Phản hồi từ điểm cuối khám phá API hướng dẫn tác nhân cách bắt đầu xác thực và gọi điểm cuối tiếp theo. Phản hồi cũng có đường dẫn tới README và mã nguồn triển khai. API cung cấp các điểm cuối sau.

- `GET /v1/schema`
- `GET /v1/openapi.json` và `GET /v1/swagger.json` là các điểm cuối thăm dò tương thích. Các điểm cuối này báo rằng không có đặc tả OpenAPI và cung cấp đường dẫn đến tài liệu khám phá API và mã nguồn

Dùng `schema` khi cần danh sách chính xác các quan hệ và cột được phép truy cập qua `/v1/sql/query`, `/v1/sql/execute` và điểm cuối tương thích `/v1/sql`.

## Thiết lập kết nối cho tác nhân

Để Claude Code, Codex, OpenClaw hoặc tác nhân khác tự kết nối, hãy bắt đầu từ điểm cuối khám phá API rồi làm theo các hành động máy chủ trả về.

### Quy trình xác thực

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Đọc hành động `send_code` và `bootstrapUrl` được trả về
3. Dùng `POST` để gửi email của người dùng tới `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. Nhận `otpSessionToken`
5. Hỏi người dùng mã xác minh 8 chữ số trong email
6. Dùng `POST` để gửi `code`, `otpSessionToken` và `label` tới `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Nhận `ApiKey` có hiệu lực lâu dài
8. Lưu khóa bên ngoài bộ nhớ cuộc trò chuyện
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Nếu cần, dùng `POST https://api.expense-budget-tracker.com/v1/workspaces` để tạo không gian làm việc
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. Đọc dữ liệu bằng `POST https://api.expense-budget-tracker.com/v1/sql/query` và gửi thao tác ghi đã được chấp thuận bằng `POST https://api.expense-budget-tracker.com/v1/sql/execute`

### Header xác thực

- `Authorization: ApiKey <key>`

### Chọn không gian làm việc

- `POST /v1/workspaces/{workspaceId}/select` lưu không gian làm việc mặc định cho khóa API đó
- Sau khi lưu không gian làm việc, các lệnh gọi `/v1/sql/query`, `/v1/sql/execute` và điểm cuối tương thích `/v1/sql` có thể bỏ qua `X-Workspace-Id`
- Vẫn có thể dùng `X-Workspace-Id: <workspaceId>` để chọn không gian làm việc khác cho riêng một yêu cầu
- Nếu người dùng chỉ có đúng một không gian làm việc và khóa chưa có lựa chọn đã lưu, API tự lưu và dùng không gian đó

Xem [hướng dẫn thiết lập tác nhân AI](/vi/docs/agent-setup/) để biết từng bước dành cho người dùng.

## Gọi HTTP trực tiếp bằng khóa có sẵn

Tập lệnh, tác vụ cron, bảng tổng quan và ứng dụng tùy chỉnh có thể gọi trực tiếp API này nếu đã có ApiKey có hiệu lực lâu dài.

### Xác thực

Gửi khóa theo dạng ApiKey trong header xác thực như ví dụ sau.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

Chỉ cần `X-Workspace-Id` khi khóa chưa có không gian làm việc mặc định đã lưu hoặc khi muốn chọn không gian làm việc khác cho yêu cầu đó.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` khi cần

## Tóm tắt các điểm cuối

- `GET /v1/` — Tài liệu khám phá API công khai
- `GET /v1/openapi.json` và `GET /v1/swagger.json` — Điểm cuối thăm dò tương thích để tìm tài liệu khám phá API và mã nguồn, không trả về đặc tả API
- `GET /v1/me` — Thông tin về tài khoản đăng nhập đã xác thực
- `GET /v1/workspaces` — Liệt kê các không gian làm việc mà chủ sở hữu khóa có thể truy cập
- `POST /v1/workspaces` — Tạo không gian làm việc
- `POST /v1/workspaces/{workspaceId}/select` — Lưu không gian làm việc mặc định cho khóa này
- `GET /v1/schema` — Xem các quan hệ và cột SQL được phép truy cập
- `POST /v1/sql/query` — Chạy một câu lệnh chỉ đọc `SELECT` hoặc `WITH ... SELECT`
- `POST /v1/sql/execute` — Chạy một câu lệnh `INSERT`, `UPDATE` hoặc `DELETE` đã được chấp thuận
- `POST /v1/sql` — Điểm cuối tương thích chạy nhiều câu lệnh trong cùng một giao dịch nguyên tử

## Quy tắc SQL

Các điểm cuối chính tách riêng thao tác đọc và ghi.

- `POST /v1/sql/query` chỉ nhận đúng một câu lệnh chỉ đọc `SELECT` hoặc `WITH ... SELECT`
- `POST /v1/sql/execute` chỉ nhận đúng một câu lệnh thay đổi dữ liệu `INSERT`, `UPDATE` hoặc `DELETE`, bao gồm các dạng `WITH` được hỗ trợ
- Điểm cuối tương thích `POST /v1/sql` nhận tập lệnh gồm nhiều câu lệnh trong phạm vi cho phép. Hoặc tất cả các câu lệnh có hiệu lực, hoặc không câu lệnh nào có hiệu lực. Chỉ dùng điểm cuối này khi cần tính nguyên tử đó

API chặn hoặc từ chối các trường hợp sau.

- Nhiều câu lệnh trên các điểm cuối chính `/v1/sql/query` và `/v1/sql/execute`
- DDL như `CREATE`, `DROP` và `ALTER`
- Câu lệnh bao quanh giao dịch SQL như `BEGIN`, `COMMIT` và `ROLLBACK`
- `set_config()`
- Chú thích SQL
- Định danh đặt trong dấu ngoặc kép
- Chuỗi được bao bằng dấu đô la

Máy chủ cũng giới hạn các quan hệ có thể truy vấn. Dùng `/v1/schema` để xem các quan hệ và cột được cung cấp trước khi tạo SQL.

Các quan hệ hiện có thể truy cập gồm những mục sau.

- `ledger_entries`
- `budget_lines`
- `workspace_settings`
- `account_metadata`
- `accounts` (chỉ đọc)
- `fx_rates_raw` (chỉ đọc)
- `fx_rates_daily` (chỉ đọc)

## Giới hạn

- Tối đa 100 dòng trả về mỗi yêu cầu
- Tối đa 100 dòng có thể bị thay đổi, tính theo từng câu lệnh ghi và theo từng yêu cầu
- Toàn bộ yêu cầu SQL có thời hạn 25 giây
- Mỗi khóa được gửi tối đa 10 yêu cầu mỗi giây và 10.000 yêu cầu mỗi ngày

## Bảo mật

- Hệ thống chỉ lưu khóa API dưới dạng giá trị băm SHA-256 và không lưu khóa ở dạng nguyên văn
- RLS tách biệt không gian làm việc ở cấp cơ sở dữ liệu
- Có thể thu hồi khóa trong ứng dụng bất kỳ lúc nào
- Khi một thành viên bị xóa khỏi không gian làm việc, mọi khóa của người đó tự động bị thu hồi
