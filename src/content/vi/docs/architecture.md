---
title: Kiến trúc
description: Tổng quan hệ thống, mô hình dữ liệu, thiết kế đa tiền tệ và cơ chế xác thực.
---

## Tổng quan hệ thống

```
Browser UI      --> Next.js web app --------------------> Postgres (RLS)
Machine clients --> API Gateway (REST) --> SQL Lambda ------^
MCP clients     --> API Gateway (HTTP) --> MCP Lambda ------^
Auth service (OTP + OAuth) --------------------------------^
Worker (FX fetchers) ---------------------------------------^
```

Sáu thành phần dùng chung một cơ sở dữ liệu.

1. **web** — Ứng dụng Next.js cung cấp bảng tổng quan và các tuyến API
2. **auth** — Đăng nhập bằng mã dùng một lần qua email và thiết lập kết nối ban đầu cho tác nhân trên tên miền xác thực
3. **sql-api** — AWS Lambda đứng sau API Gateway, phục vụ các ứng dụng khách truy cập qua chương trình
4. **mcp** — AWS Lambda và HTTP API riêng trên API Gateway cho điểm cuối MCP do dịch vụ vận hành
5. **worker** — Lấy tỷ giá hằng ngày từ ECB, CBR và NBS
6. **Postgres** — Nơi lưu dữ liệu chuẩn duy nhất, áp dụng bảo mật cấp hàng

## Mô hình dữ liệu

- **ledger_entries** — Mỗi dòng là một bút toán ghi lại biến động của tài khoản (thu nhập, chi tiêu hoặc chuyển tiền)
- **budget_lines** — Mỗi thay đổi ở một ô ngân sách được ghi thêm thành một dòng. Giá trị ghi sau cùng có hiệu lực
- **budget_comments** — Ghi chú gắn với ô ngân sách, chỉ ghi thêm
- **workspace_settings** — Đồng tiền báo cáo và cài đặt của không gian làm việc
- **account_metadata** — Siêu dữ liệu của từng tài khoản, ví dụ như phân loại theo tính thanh khoản
- **exchange_rates** — Tỷ giá hằng ngày dùng để quy đổi khi truy vấn
- **workspaces** / **workspace_members** — Tách biệt dữ liệu giữa các nhóm người dùng
- **accounts** — Khung nhìn được tạo từ các bút toán

## Đa tiền tệ

Mọi số tiền được lưu theo đồng tiền gốc. Khi đọc dữ liệu, hệ thống dùng phép nối SQL với `exchange_rates` để quy đổi sang đồng tiền báo cáo. Dữ liệu gốc được giữ nguyên, tránh mất độ chính xác do quy đổi trước.

## Xác thực

Biến môi trường `AUTH_MODE` có hai chế độ.

- `none` — Không xác thực, chỉ có một không gian làm việc cục bộ
- `cognito` — Đăng nhập không cần mật khẩu, dùng mã một lần AWS Cognito gửi qua email, cho phép đăng ký tự do

Các chương trình bắt đầu kết nối từ điểm cuối khám phá API công khai `GET /v1/`. Khi thiết lập kết nối, tác nhân dùng mã gửi qua email trên tên miền xác thực, nhận ApiKey có hiệu lực lâu dài rồi chạy SQL thông qua API trên API Gateway.

Ứng dụng khách hỗ trợ MCP kết nối riêng đến `https://mcp.expense-budget-tracker.com/mcp`. HTTP API riêng trên API Gateway và MCP Lambda xử lý đường dẫn này. Người dùng cấp quyền OAuth ngay trong trình duyệt trên tên miền xác thực.

Mỗi người dùng có một không gian làm việc riêng biệt. Chính sách RLS kiểm tra quyền thành viên của không gian làm việc ở mỗi truy vấn, kể cả các yêu cầu SQL gửi từ chương trình.
