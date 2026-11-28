---
title: "Theo dõi chi tiêu với Claude Code: Kết nối, nhập sao kê và đối soát"
description: "Kết nối Claude Code với Expense Budget Tracker qua một đường dẫn, kiểm tra và duyệt các giao dịch trước khi nhập sao kê, đối soát số dư và cập nhật ngân sách mà không cần liên kết ngân hàng."
date: "2026-03-05"
updated: "2026-09-11"
image: "/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png"
keywords:
  - "theo dõi chi tiêu với Claude Code"
  - "theo dõi chi tiêu với Claude"
  - "công cụ theo dõi chi tiêu cho Claude"
  - "quản lý ngân sách với Claude Code"
  - "kết nối Claude với công cụ theo dõi chi tiêu"
  - "nhập sao kê ngân hàng bằng Claude Code"
---

Đối soát một bản sao kê chỉ có bốn dòng có thể cho chênh lệch `€0.00` mà ngân sách vẫn sai. Nếu xếp khoản mua đồ ở siêu thị trị giá €54.20 vào danh mục Du lịch thay vì Thực phẩm, số dư tài khoản vẫn khớp, còn báo cáo theo danh mục lệch €54.20.

Khi dùng Claude Code để theo dõi chi tiêu, bạn cần kiểm tra hai việc. Cộng các khoản đã ghi phải ra đúng số dư ngân hàng, và danh mục của từng giao dịch phải khớp với sao kê bạn đã kiểm tra. Claude Code có thể đọc tệp, tính toán và gọi API. Bạn chọn tài khoản và danh mục, kiểm tra các bản ghi đề xuất rồi duyệt đúng những thay đổi sẽ được ghi.

Expense Budget Tracker không duy trì kết nối trực tiếp với ngân hàng và không có bước tải sao kê lên trong quy trình này. Hãy tự xuất sao kê, đặt tệp ở nơi Claude Code có quyền đọc và chỉ gửi các bản ghi đã duyệt qua Agent API của dịch vụ đám mây. Nếu ưu tiên của bạn là tránh cấp quyền truy cập ngân hàng lâu dài, xem thêm [cách dùng ứng dụng ngân sách không liên kết ngân hàng (tiếng Anh)](/blog/budget-app-without-bank-linking/).

![Người phục chế tranh khảm nhấc một miếng ghép xanh đặt sai chỗ ra khỏi dải đất nung, cạnh chiếc cân đồng đang thăng bằng](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png)

## Kết nối Claude Code qua một đường dẫn khám phá API

Cài đặt và đăng nhập Claude Code theo [hướng dẫn bắt đầu chính thức của Anthropic (tiếng Anh)](https://code.claude.com/docs/en/quickstart). [Tài liệu tham chiếu CLI (tiếng Anh)](https://code.claude.com/docs/en/cli-reference) giải thích cách dùng thư mục làm việc và cấp quyền truy cập thêm tệp.

Chạy `claude` trong thư mục chứa sao kê hoặc cấp quyền truy cập thư mục đó theo cách môi trường của bạn hỗ trợ. Sau đó dán câu lệnh sau.

```text
Connect to Expense Budget Tracker from this discovery link:
https://app.expense-budget-tracker.com/api/agent

Fetch it with GET, read the returned JSON, and follow the current action URLs. Do not
guess or hardcode the API flow. Ask me for my Expense Budget Tracker email and start
the email OTP flow.
After that request succeeds, tell me to check spam or junk if the message is not
visible, ask me for the 8-digit code, and follow the returned verification action.

After verification, ask me to approve a persistent storage location for the returned
ApiKey outside chat memory and source control. Load my account context, list my
workspaces, ask me to confirm the target workspace, save it as the default for this
key, and inspect the live schema. Run one small read-only query to confirm the selected
workspace. Do not write financial data.
```

[Đường dẫn dành cho tác nhân trên tên miền ứng dụng](https://app.expense-budget-tracker.com/api/agent) trả về tài liệu khám phá API đang dùng. Hiện tại, tài liệu trả về `https://api.expense-budget-tracker.com/v1/` làm địa chỉ gốc của API, cùng với URL cho các bước xác thực và thao tác SQL. Chỉ cần dán đường dẫn trên tên miền ứng dụng để Claude Code làm theo các URL mà dịch vụ trả về.

Cùng một quy trình xác thực qua email dùng cho cả đăng ký và đăng nhập. Khi bạn cung cấp mã xác minh 8 chữ số, Claude Code nhận được `ApiKey` có hiệu lực lâu dài. Hãy duyệt một nơi lưu cụ thể, chẳng hạn tệp lưu thông tin bí mật nằm ngoài phạm vi theo dõi của hệ thống quản lý mã nguồn. Tuyệt đối không đưa khóa vào `CLAUDE.md` hay commit vào kho mã nguồn. [Hướng dẫn thiết lập tác nhân AI](/vi/docs/agent-setup/) mô tả các bước xác thực và chọn không gian làm việc.

## Khi nào dùng Agent API và khi nào dùng MCP?

Tìm kiếm cách theo dõi chi tiêu với Claude có thể dẫn bạn đến hai cách tích hợp. Bài này dùng Claude Code trong terminal với Agent API. Claude và Claude Desktop có thể dùng trình kết nối MCP từ xa do dịch vụ vận hành.

| | Claude Code với Agent API | Claude hoặc Claude Desktop với MCP |
|---|---|---|
| Phù hợp khi | Làm việc trong terminal với tệp cục bộ có thể truy cập và gọi HTTP trực tiếp | Trò chuyện trong ứng dụng khách Claude hỗ trợ MCP |
| Điểm bắt đầu | `https://app.expense-budget-tracker.com/api/agent` | `https://mcp.expense-budget-tracker.com/mcp` |
| Xác thực | Mã dùng một lần qua email, sau đó dùng `ApiKey` có hiệu lực lâu dài | OAuth trong trình duyệt |
| Cách truy cập dữ liệu | URL khám phá API dẫn đến các điểm cuối truy vấn và thực thi | Công cụ `sql_query` và công cụ tùy chọn `sql_execute` |
| Truy cập sao kê | Tệp và thư mục mà phiên Claude Code đó có quyền truy cập | Trình kết nối từ xa không cấp quyền truy cập tệp cục bộ |

Mỗi cách dùng thông tin xác thực riêng. Với Claude trên web hoặc máy tính, hãy làm theo [hướng dẫn kết nối Claude qua MCP (tiếng Anh)](/blog/claude-expense-tracker-mcp-connector/). Dùng quy trình Agent API bên dưới nếu công việc bắt đầu từ một tệp Claude Code có thể đọc.

Việc xử lý dữ liệu và cách tự triển khai cũng có những giới hạn riêng.

- Nhà cung cấp mô hình xử lý dữ liệu độc lập với API và hệ thống lưu trữ của Expense Budget Tracker. Hãy đọc [tài liệu về cách Claude Code sử dụng dữ liệu (tiếng Anh)](https://code.claude.com/docs/en/data-usage) và điều khoản của nhà cung cấp được cấu hình trong bản cài đặt của bạn trước khi chia sẻ sao kê.
- Cấu hình Docker Compose cục bộ trong [hướng dẫn tự lưu trữ](/vi/docs/self-hosting/) khởi động ứng dụng web, dịch vụ xác thực, cơ sở dữ liệu và tiến trình lấy tỷ giá. Cấu hình này không cung cấp Agent API được quản lý dùng trong bài. Kho mã nguồn có cấu hình triển khai AWS riêng, bao gồm API công khai cho chương trình.

## Xác định phạm vi nhập sao kê

Lần đầu, hãy dùng một tài khoản, một loại tiền tệ và một kỳ sao kê đã chốt. CSV tiện vì dễ kiểm tra từng dòng. Với định dạng khác, hãy yêu cầu Claude Code xác nhận rằng nó đọc được tệp trong môi trường của bạn và hiển thị các dòng đã đọc. Phần mở rộng của tệp chưa đủ để xác nhận khả năng đọc.

Cung cấp cho Claude Code sáu thông tin sau.

1. Đường dẫn cục bộ đến tệp sao kê.
2. Tài khoản ngân hàng và tài khoản tương ứng trong ứng dụng.
3. Loại tiền tệ của tài khoản.
4. Ngày hạch toán đầu tiên và cuối cùng.
5. Số dư đầu kỳ hoặc số dư gần nhất đã được xác nhận là đúng.
6. Số dư cuối kỳ trên sao kê.

Bỏ qua các giao dịch đang chờ cho đến khi ngân hàng hạch toán. Giữ nguyên tệp gốc và yêu cầu Claude Code tạo bản xem trước riêng.

Bạn có thể đặt các quy tắc sau trong tệp `CLAUDE.md` cục bộ của thư mục tài chính.

```markdown
# Expense Budget Tracker workflow

- Start from https://app.expense-budget-tracker.com/api/agent and follow discovery.
- Confirm the target workspace and inspect the live schema before writing SQL.
- Use the read action for all inspection and reconciliation.
- Before a write, show the source totals, possible duplicates, exact SQL, and expected rows.
- Wait for my explicit approval of the complete change set.
- Use the write action only for the approved INSERT, UPDATE, or DELETE.
- Verify every write with a fresh read.
- Never invent a balancing entry or silently resolve an uncertain category.
- Keep the ApiKey outside this file and outside source control.
```

Bổ sung những thông tin ít thay đổi như tên tài khoản thực tế, quy tắc phân loại, quy ước chuyển tiền và đồng tiền báo cáo. Chỉ dùng các danh mục ví dụ trong bài nếu chúng khớp với sổ giao dịch của bạn.

## Xem trước toàn bộ dữ liệu trước khi nhập sao kê

Khi kết nối đã hoạt động, dán câu lệnh sau và thay các giá trị trong ngoặc vuông.

```text
Import [local statement path] into [tracker account] for [posted start date] through
[posted end date] in [currency]. The opening balance is [amount] and the bank's closing
balance is [amount].

First confirm the selected workspace and inspect the live schema. Use only the read
action to inspect the target account, existing categories, and ledger rows that overlap
the statement period. Confirm that you can read the local file, parse it, and prepare a
complete preview without writing anything.

For every source row, show its source identifier or row number, posted date, signed
amount, currency, target account, proposed transaction type, proposed category, and
duplicate status. Flag transfers, refunds, reimbursements, fees, foreign-currency rows,
unfamiliar counterparties, and uncertain classifications.

Then show the source row count and signed total, all proposed ledger rows, possible
duplicates, the exact SQL you would send, and the expected affected-row count. Stop
and wait for my explicit approval of the complete change set.
```

Mọi thao tác với cơ sở dữ liệu đều chỉ đọc cho đến khi bạn duyệt một thay đổi. Claude Code cần kiểm tra lược đồ đang dùng để lấy tên cột, tìm đúng tài khoản và truy vấn các dòng hiện có trong cùng khoảng thời gian. Trùng ngày và số tiền chỉ là dấu hiệu cần kiểm tra. Hai khoản mua riêng biệt vẫn có thể trùng cả ngày lẫn số tiền.

### Ví dụ với sao kê bốn dòng

Giả sử sao kê tài khoản thanh toán có số dư đầu kỳ €1,250.00 và bốn dòng đã hạch toán sau.

| Dòng | Ngày hạch toán | Mô tả | Số tiền có dấu | Loại đề xuất | Danh mục đề xuất | Ghi chú kiểm tra |
|---|---|---|---:|---|---|---|
| 1 | 2026-08-31 | Lương | +€2,000.00 | Thu nhập | Lương | Rõ ràng |
| 2 | 2026-09-02 | Mua ở siêu thị | −€54.20 | Chi tiêu | Thực phẩm | Kiểm tra nơi bán nếu thấy lạ |
| 3 | 2026-09-03 | Chuyển vào tài khoản tiết kiệm | −€300.00 | Chuyển tiền | — | Xác nhận tài khoản còn lại |
| 4 | 2026-09-04 | Quán cà phê | −€8.40 | Chi tiêu | Ăn uống | Rõ ràng |

Tổng bốn khoản, tính cả dấu cộng hoặc trừ, là `+€1,637.40`. Cộng vào số dư đầu kỳ `€1,250.00` thì số dư cuối kỳ dự kiến là `€2,887.40`. Ví dụ này vừa trên một màn hình. Với sao kê dài hơn, bản xem trước vẫn phải có đủ từng dòng nguồn và đánh dấu mọi điểm chưa rõ.

Hãy xác nhận tài khoản còn lại của giao dịch chuyển tiền. Chuyển tiền giữa hai tài khoản của bạn không tính là chi tiêu. Giữ đúng loại giao dịch cho khoản hoàn tiền và khoản được hoàn lại sau khi đã ứng trước. Nếu chưa chắc nên phân loại thế nào, hãy đánh dấu giao dịch để bạn quyết định sau.

### Duyệt các thay đổi cụ thể trước khi ghi

Kiểm tra không gian làm việc, tài khoản, khoảng ngày, số dòng, tổng số tiền theo dấu, các dòng có thể trùng và cách phân loại. Hãy duyệt bản xem trước và câu lệnh SQL cụ thể. Một yêu cầu chung như “nhập hết” không xác định được những gì bạn đã chấp thuận.

Agent API tách thao tác đọc và ghi. Claude Code dùng thao tác đọc do điểm cuối khám phá API chỉ định để chạy một câu lệnh `SELECT` hoặc `WITH ... SELECT`. Tác nhân chỉ dùng thao tác ghi cho câu lệnh `INSERT`, `UPDATE` hoặc `DELETE` đã được duyệt rõ ràng. Lược đồ đang dùng xác định các bảng và cột. [Tài liệu tham chiếu API](/vi/docs/api/) giải thích các quy tắc và giới hạn của SQL.

### Thử lệnh chèn hoặc cập nhật lớn trước khi chia lô

Trước một lệnh `INSERT` hoặc `UPDATE` lớn, tài liệu khám phá API yêu cầu tác nhân gửi lệnh thử có cùng cấu trúc SQL. Với `INSERT`, dùng 1–3 dòng có giá trị ghi trực tiếp trong câu lệnh. Với `UPDATE`, chọn đúng một dòng để thử. Phê duyệt của bạn bao gồm cả lượt thử lẫn các dòng còn lại trong tập hợp thay đổi đã kiểm tra.

Nếu lượt thử thành công, Claude Code nên tiếp tục ngay, xử lý tuần tự từng lô tối đa 100 bản ghi và kiểm tra kết quả sau mỗi lô. Với 247 dòng đã duyệt, thử trước 3 dòng thì còn các lô 100, 100 và 44 dòng. Nếu phạm vi thay đổi, có điểm chưa rõ mới hoặc thực thi gặp lỗi, hãy xin duyệt lại. Các lô tiếp theo thuộc đúng tập hợp đã duyệt có thể chạy tiếp.

SQL bị giới hạn nên không hỗ trợ `ON CONFLICT`. Vì vậy cần xác định rõ cách xử lý dòng trùng. Mỗi lần đọc trả về tối đa 100 dòng. Claude Code cần kiểm tra siêu dữ liệu về số dòng và việc cắt bớt kết quả, tính tổng bằng SQL và chia phần kiểm tra chi tiết thành các truy vấn phạm vi nhỏ, có thứ tự rõ ràng. Nếu kết quả bị cắt bớt, bước kiểm tra lượt nhập vẫn chưa xong.

### Đọc lại các dòng đã lưu

Phản hồi thành công chỉ cho biết API đã thực thi yêu cầu. Hãy truy vấn lại đúng tài khoản và kỳ sao kê để đối chiếu dữ liệu đã lưu với bản xem trước.

- Số dòng đã chèn
- Ngày, số tiền có dấu và loại tiền tệ
- Tài khoản được gán
- Loại giao dịch và danh mục
- Các dòng có thể trùng
- Tổng từng lô và tổng của toàn bộ sao kê

Nếu có chênh lệch, hãy quay lại kiểm tra ở chế độ chỉ đọc. Xem xét một điều chỉnh cụ thể trước khi ghi tiếp. [Hướng dẫn nhập sao kê ngân hàng (tiếng Anh)](/blog/how-to-import-bank-statements-into-an-expense-tracker/) giải thích kỹ hơn cách xử lý kỳ trùng nhau, hoàn tiền và chuyển tiền.

## Đối soát số dư và kiểm tra danh mục riêng

Khi đối soát số dư, hãy lấy số dư đầu kỳ cộng các khoản biến động đã ghi trong đúng khoảng ngày hạch toán rồi đối chiếu với số dư cuối kỳ trên sao kê.

Với tài khoản tiền gửi thông thường, dùng công thức sau.

**số dư cuối kỳ dự kiến = số dư đầu kỳ + tiền vào đã hạch toán − tiền ra đã hạch toán**

Nếu các khoản tiền đã có dấu cộng hoặc trừ, bạn có thể dùng công thức sau.

**số dư cuối kỳ dự kiến = số dư đầu kỳ + tổng các khoản biến động đã hạch toán theo dấu**

Tài khoản công nợ như thẻ tín dụng có thể dùng quy ước dấu khác. Claude Code cần nêu rõ quy ước tìm được trước khi tính để đối chiếu.

Tiếp tục với câu lệnh sau.

```text
Use the read action only. Reconcile [account] for [posted start date] through [posted
end date] against the bank closing balance of [amount and currency]. State the opening
boundary, the sign convention, the stored row count, and the signed movement total.

Show expected closing balance, bank closing balance, and the exact difference. If the
difference is not zero, list candidate missing, duplicated, excluded, wrong-date, or
mis-signed rows. Do not insert a balancing entry and do not change any data.

After the balance check, review category totals separately. List uncategorized rows,
transfer rows counted as spending, and categories that differ from the approved preview.
```

Trong ví dụ bốn dòng, `€1,250.00 + €1,637.40 = €2,887.40`. Nếu số dư cuối kỳ trên sao kê cũng là €2,887.40 thì chênh lệch số dư là `€0.00`.

Chênh lệch bằng không cho thấy phép tính số dư khớp trong kỳ đã chọn. Nếu chuyển dòng mua ở siêu thị trị giá €54.20 từ Thực phẩm sang Du lịch, chênh lệch số dư vẫn bằng không, còn tổng của hai danh mục thay đổi €54.20. Vì vậy hãy kiểm tra danh mục riêng trước khi chấp nhận kết quả.

Nếu chênh lệch khác không, hãy kiểm tra số dư đầu kỳ, dòng thiếu hoặc trùng, chuyển tiền, giao dịch đang chờ, dấu, ngày và loại tiền tệ. Tuyệt đối không thêm giao dịch giả để xóa chênh lệch. [Hướng dẫn đối soát (tiếng Anh)](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) giải thích chi tiết hơn quy trình tìm nguyên nhân.

## Chỉ cập nhật ngân sách sau khi đối soát

Chỉ cập nhật ngân sách khi các bút toán đã lưu khớp bản xem trước, số dư đã đối soát và tổng theo danh mục hợp lý. Claude Code có thể đối chiếu thu chi thực tế với `budget_lines` rồi đề xuất thay đổi. Một tháng bất thường chưa đủ để quyết định kế hoạch tháng tới.

```text
Confirm the workspace and inspect the current schema. Use the read action to compare
actual income and spending for [complete period] with the matching budget lines. Exclude
transfers using the stored transaction type and show uncategorized activity separately.

For each proposed budget change, show the category, current amount, actual amount,
proposed amount, difference, and reason. Then show the exact SQL and expected affected
rows. Do not write until I approve specific lines.

After approval, use the write action only for those lines and verify them with a fresh
read. Report any stored value that differs from the approved proposal.
```

Một khoản chi lớn có thể chỉ phát sinh một lần. Một khoản có vẻ vượt ngân sách có thể là khoản chuyển tiền hoặc hoàn tiền bị phân loại sai. Claude Code có thể tính chênh lệch và chuẩn bị SQL. Bạn quyết định số tiền cho tháng tới.

## Giữ nguyên thứ tự cho mỗi sao kê

Làm theo thứ tự sau với từng sao kê.

1. Bắt đầu từ `https://app.expense-budget-tracker.com/api/agent` và làm theo tài liệu khám phá API.
2. Lấy thông tin tài khoản đăng nhập, xác nhận không gian làm việc và kiểm tra lược đồ đang dùng.
3. Cung cấp cho Claude Code một tệp sao kê có thể đọc và nêu rõ số dư đầu kỳ, cuối kỳ.
4. Đọc các bút toán trong khoảng thời gian trùng với sao kê và chuẩn bị bản xem trước đầy đủ.
5. Duyệt các thay đổi cụ thể trước khi ghi.
6. Với lệnh chèn lớn, thử 1–3 dòng rồi xử lý tuần tự các lô tối đa 100 dòng.
7. Đọc lại từng lô đã lưu và đối chiếu với bản xem trước.
8. Đối soát tài khoản với số dư cuối kỳ của ngân hàng mà không thêm bút toán để cân bằng.
9. Kiểm tra tổng theo danh mục ngay cả khi chênh lệch số dư bằng không.
10. Chuẩn bị, duyệt và kiểm tra các thay đổi đối với dòng ngân sách trong một bước riêng.

Hãy bắt đầu với một tài khoản và một kỳ đã chốt. Khi đã đối soát các bút toán với sao kê và kiểm tra ngân sách, bạn có thể lặp lại quy trình cho tài khoản tiếp theo. Claude Code xử lý các thao tác lặp lại với tệp và API. Mọi quyết định tài chính đều hiện rõ để bạn xem xét trước khi thay đổi dữ liệu.
