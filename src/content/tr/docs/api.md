---
title: API başvuru kılavuzu
description: Finansal verilerinize programatik erişim için ajan kurulum adımları ve SQL API başvuru kılavuzu.
---

## Genel bakış

Expense Budget Tracker'ın programatik istemciler için herkese açık API adresi aşağıdadır.

`https://api.expense-budget-tracker.com/v1/`

Aynı API'yi iki şekilde kullanabilirsiniz.

1. **Ajanın kendi bağlantısını kurması** için `GET /v1/` ile başlayın.
2. **Doğrudan HTTP kullanımı** için daha önce aldığınız, uzun süre geçerli bir ApiKey kullanın.

Tüm isteklerde web uygulamasıyla aynı Postgres satır düzeyinde güvenlik kuralları uygulanır.

MCP destekli bir istemciniz varsa `https://mcp.expense-budget-tracker.com/mcp` adresindeki barındırılan [MCP bağlayıcısını](/tr/docs/mcp-connector/) kullanın ve tarayıcıda OAuth üzerinden yetkilendirin. Bu sayfa, uzun süre geçerli `ApiKey` kullanan ayrı Ajan API'sinin kurulumunu ve doğrudan HTTP isteklerinin kurallarını açıklar.

## Keşif, kaynak kodu ve güncel şema

Şu adresle başlayın.

`https://api.expense-budget-tracker.com/v1/`

Keşif yanıtı, ajanlara kimlik doğrulamayı nasıl başlatacaklarını ve ardından hangi uç noktaları çağıracaklarını gösterir. README ve uygulama kaynak koduna da bağlantı verir. API şu uç noktaları sunar.

- `GET /v1/schema`
- `GET /v1/openapi.json` ve `GET /v1/swagger.json`, uyumluluk için yoklama uç noktalarıdır. OpenAPI belirtiminin sunulmadığını bildirir ve istemcileri keşif belgesine ve kaynak koda yönlendirir.

`/v1/sql/query`, `/v1/sql/execute` ve uyumluluk için sunulan `/v1/sql` üzerinden erişilebilen ilişkilerin ve sütunların tam listesi için `schema` uç noktasını kullanın.

## Ajanın kendi bağlantısını kurması

Claude Code, Codex, OpenClaw veya başka bir ajanın kendisinin bağlanmasını istiyorsanız keşif uç noktasından başlayın ve sunucunun yanıtındaki adımları izleyin.

### Kimlik doğrulama akışı

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Döndürülen `send_code` eylemini ve `bootstrapUrl` değerini okuyun.
3. Kullanıcının e-posta adresini `https://auth.expense-budget-tracker.com/api/agent/send-code` adresine `POST` ile gönderin.
4. `otpSessionToken` değerini alın.
5. Kullanıcıdan e-postadaki 8 haneli doğrulama kodunu isteyin.
6. `code`, `otpSessionToken` ve `label` değerlerini `https://auth.expense-budget-tracker.com/api/agent/verify-code` adresine `POST` ile gönderin.
7. Uzun ömürlü bir `ApiKey` alın.
8. Anahtarı sohbet belleği dışında saklayın.
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. İsteğe bağlı olarak `POST https://api.expense-budget-tracker.com/v1/workspaces` ile bir çalışma alanı oluşturun.
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. Okuma için `POST https://api.expense-budget-tracker.com/v1/sql/query`, onaylı yazma işlemleri için `POST https://api.expense-budget-tracker.com/v1/sql/execute` çağrısını kullanın.

### Kimlik doğrulama başlığı

- `Authorization: ApiKey <key>`

### Çalışma alanı seçimi

- `POST /v1/workspaces/{workspaceId}/select`, ilgili API anahtarı için varsayılan çalışma alanını kaydeder.
- Çalışma alanı kaydedildikten sonra `/v1/sql/query`, `/v1/sql/execute` ve uyumluluk için sunulan `/v1/sql` çağrılarında `X-Workspace-Id` başlığı isteğe bağlıdır.
- Tek bir istekte kayıtlı alan yerine başka bir alan kullanmak istediğinizde `X-Workspace-Id: <workspaceId>` başlığını gönderebilirsiniz.
- Kullanıcının yalnızca bir çalışma alanı varsa ve anahtar için henüz seçim kaydedilmemişse API bu alanı otomatik olarak kaydeder ve kullanır.

Bağlantıyı adım adım kurmak için [yapay zekâ ajanı kurulum rehberine](/tr/docs/agent-setup/) bakın.

## Mevcut anahtarla doğrudan HTTP kullanımı

Betikler, cron görevleri, gösterge panelleri ve özel uygulamalar, uzun süre geçerli bir ApiKey edindikten sonra aynı API'yi doğrudan çağırabilir.

### Kimlik doğrulama

Anahtarı kimlik doğrulama başlığında ApiKey yöntemiyle gönderin.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id` başlığı yalnızca anahtar için henüz varsayılan bir çalışma alanı kaydedilmediyse veya o istek için kayıtlı alan yerine başka bir alan kullanmak istiyorsanız gerekir.

- `Authorization: ApiKey ebta_your_key_here`
- Gerektiğinde `X-Workspace-Id: <workspaceId>`

## Uç noktaların özeti

- `GET /v1/` – Herkese açık keşif belgesi
- `GET /v1/openapi.json` ve `GET /v1/swagger.json` – Uyumluluk için keşfe ve kaynak koda yönlendiren uç noktalar. API belirtimi sunmazlar.
- `GET /v1/me` – Oturum açan kullanıcının hesap bilgileri
- `GET /v1/workspaces` – Anahtar sahibinin erişebildiği çalışma alanlarını listeler
- `POST /v1/workspaces` – Çalışma alanı oluşturur
- `POST /v1/workspaces/{workspaceId}/select` – Bu anahtarın varsayılan çalışma alanını kaydeder
- `GET /v1/schema` – SQL için izin verilen ilişkileri ve sütunları gösterir
- `POST /v1/sql/query` – Salt okunur tek bir `SELECT` veya `WITH ... SELECT` deyimi çalıştırır
- `POST /v1/sql/execute` – Onaylanmış tek bir `INSERT`, `UPDATE` veya `DELETE` deyimi çalıştırır
- `POST /v1/sql` – Birden çok deyimi atomik biçimde çalıştıran betikler için uyumluluk uç noktası

## SQL kuralları

Birincil uç noktalar okuma ve yazma işlemlerini ayrı tutar.

- `POST /v1/sql/query`, salt okunur tek bir `SELECT` veya `WITH ... SELECT` deyimi kabul eder.
- `POST /v1/sql/execute`, desteklenen `WITH` biçimleri dahil tam olarak bir `INSERT`, `UPDATE` veya `DELETE` deyimini kabul eder.
- Uyumluluk için sunulan `POST /v1/sql`, kısıtlı, birden çok deyim içeren betikleri kabul eder ve bunları atomik olarak uygular. Yalnızca bu atomik davranış gerektiğinde kullanın.

Engellenen veya reddedilen kalıplar aşağıdadır.

- Birincil `/v1/sql/query` ve `/v1/sql/execute` uç noktalarında birden fazla deyim
- `CREATE`, `DROP` ve `ALTER` gibi DDL deyimleri
- `BEGIN`, `COMMIT` ve `ROLLBACK` gibi SQL işlemini başlatan ve sonlandıran komutlar
- `set_config()`
- SQL yorumları
- Tırnak içine alınmış tanımlayıcılar
- Dolar işaretleriyle sınırlandırılmış dizeler

Sunucu sorgulanabilecek ilişkileri de kısıtlar. SQL oluşturmadan önce erişime açık ilişkileri ve sütunları `/v1/schema` üzerinden inceleyin.

Şu anda erişime açık ilişkiler aşağıdadır.

- `ledger_entries`
- `budget_lines`
- `workspace_settings`
- `account_metadata`
- `accounts` (salt okunur)
- `fx_rates_raw` (salt okunur)
- `fx_rates_daily` (salt okunur)

## Sınırlar

- İstek başına en fazla 100 satır döndürülür.
- Her değişiklik deyimi ve her istek en fazla 100 satırı etkileyebilir.
- SQL isteğinin toplam süre sınırı 25 saniyedir.
- Anahtar başına saniyede 10, günde 10.000 istek gönderilebilir.

## Güvenlik

- API anahtarlarının yalnızca SHA-256 özetleri kalıcı olarak saklanır.
- RLS, çalışma alanlarını veritabanı düzeyinde birbirinden ayırır.
- Anahtarları dilediğiniz zaman uygulama içinden iptal edebilirsiniz.
- Bir üyeyi çalışma alanından çıkardığınızda üyenin tüm anahtarları otomatik olarak iptal edilir.
