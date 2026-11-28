---
title: Hướng dẫn tự lưu trữ
description: Chạy Expense Budget Tracker trên máy chủ riêng bằng Docker Compose và Postgres.
---

## Yêu cầu

- Docker và Docker Compose
- Postgres 18 (đã có trong tệp Compose)

## Thiết lập nhanh

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

Lệnh này khởi động Postgres, chạy các bước nâng cấp cơ sở dữ liệu, rồi khởi động các thành phần sau.

- Ứng dụng web tại `http://localhost:3000`
- Dịch vụ xác thực tại `http://localhost:8081`
- Tiến trình lấy tỷ giá trong Docker Compose

## Cấu hình

Sao chép `.env.example` sang `.env` rồi điều chỉnh các biến sau.

- `MIGRATION_DATABASE_URL` — Vai trò chủ sở hữu dùng để chạy các bước nâng cấp cơ sở dữ liệu
- `DATABASE_URL` — Vai trò ứng dụng dùng cho tiến trình web
- `AUTH_DATABASE_URL` — Vai trò dành cho lược đồ xác thực của dịch vụ xác thực
- `AUTH_MODE` — Dùng `none` khi chạy cục bộ và `cognito` khi cần xác thực bằng mã dùng một lần qua email
- `AUTH_DOMAIN`, `COOKIE_DOMAIN` và `ALLOWED_REDIRECT_URIS` — Định tuyến xác thực và cookie

Khi đặt `AUTH_MODE=cognito`, bạn cũng cần các thiết lập Cognito và `SESSION_ENCRYPTION_KEY` trong `.env.example`.

## Cập nhật

```bash
git pull
make up
```

Docker Compose dựng lại các dịch vụ và chạy lại các bước nâng cấp cơ sở dữ liệu qua container `migrate`.

## Triển khai trên AWS

CDK stack dùng trong môi trường triển khai chính thức sử dụng ECS Fargate, RDS, ALB, Cognito, API Gateway và Lambda. Ứng dụng có các tên miền công khai sau.

- `app.<domain>` — Ứng dụng web chạy trên ECS Fargate, đứng sau ALB
- `auth.<domain>` — Dịch vụ OTP và OAuth đứng sau ALB
- `api.<domain>/v1/*` — REST API cho phép các chương trình chạy SQL qua API Gateway và Lambda
- `mcp.<domain>/mcp` — Dịch vụ MCP chạy qua HTTP API riêng trên API Gateway và MCP Lambda

Tên miền tùy chỉnh của MCP cần chứng chỉ ACM công khai khớp chính xác với tên `mcp.<domain>`. Giữ bản ghi CNAME xác thực DNS để gia hạn, cung cấp ARN của chứng chỉ cho quy trình triển khai CDK và CI, đồng thời tạo bản ghi DNS `mcp.*` cùng các tên miền công khai khác.

Để biết thứ tự triển khai được hỗ trợ và các tập lệnh dùng để thiết lập, hãy đọc [tổng quan triển khai bằng tiếng Anh](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) và [hướng dẫn AWS CDK bằng tiếng Anh](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) của kho mã nguồn.
