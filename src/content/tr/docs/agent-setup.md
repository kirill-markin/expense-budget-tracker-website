---
title: Yapay zekâ ajanı kurulumu
description: Claude Code, Codex veya OpenClaw ile tek bir keşif adresi paylaşın. Ajan yanıttaki adımları izler, e-postadaki 8 haneli kodla doğrulamayı tamamlar ve uzun süre geçerli ApiKey anahtarını saklayıp çalışma alanınızda işlem yapmaya başlar.
---

## Ajanınıza vereceğiniz bağlantı

Şu adresi aynen paylaşın.

`https://api.expense-budget-tracker.com/v1/`

Bu uç nokta, yapay zekâ ajanları için herkese açık resmî keşif belgesidir. Ajan bu belgeden kimlik doğrulamayı nasıl başlatacağını, ardından hangi uç noktaları hangi kimlik doğrulama yöntemiyle çağıracağını öğrenir. Güncel şema ile açık kaynak uygulama kodunun bağlantıları da belgede yer alır.

Bu rehber, terminal ajanlarının ve HTTP istemcilerinin doğrudan Ajan API'sine bağlanmasını anlatır. MCP destekli bir istemciniz varsa barındırılan [MCP bağlayıcısını](/tr/docs/mcp-connector/) kullanın. İstemci `https://mcp.expense-budget-tracker.com/mcp` adresine bağlanır. Erişimi tarayıcıda OAuth üzerinden onaylarsınız. Bu bağlantı için ApiKey kurulumu gerekmez.

## Sizin yapacağınız adımlar

1. Claude Code, Codex, OpenClaw veya HTTP isteği gönderebilen başka bir ajanı açın.
2. Ajandan `https://api.expense-budget-tracker.com/v1/` adresini kullanarak Expense Budget Tracker'a bağlanmasını isteyin.
3. Ajan e-posta adresinizi sorduğunda Expense Budget Tracker'da kullandığınız adresi verin.
4. Gelen kutunuzdaki 8 haneli doğrulama kodunu bulun.
5. Kodu ajana gönderin.
6. Ajanın döndürülen ApiKey anahtarını sohbet belleği dışında saklamasına izin verin. Ardından içe aktarma, sorgulama veya bütçe işinize devam edin.

Oturum açarken anahtarı kopyalayıp yapıştırmanız gerekmez. Ajan, e-postadaki kod doğrulandıktan sonra bağlantısını kendi kurar.

## Ajanın izleyeceği adımlar

Akış şu adımlardan oluşur.

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Keşif yanıtını oku ve yanıtta belirtilen eylemleri izle. Sonraki adımları sabit kodlama.
3. Kullanıcının e-posta adresini döndürülen `bootstrapUrl` adresine `POST` ile gönder.
4. `otpSessionToken` değerini ve `verify_code` eylemini al.
5. Kullanıcıdan e-postadaki 8 haneli doğrulama kodunu iste.
6. `code`, `otpSessionToken` ve bağlantı için `label` değerini `https://auth.expense-budget-tracker.com/api/agent/verify-code` adresine `POST` ile gönder.
7. Yeni `ApiKey` değerini al.
8. Anahtarı sohbet belleği dışında, tercihen `EXPENSE_BUDGET_TRACKER_API_KEY` adıyla sakla.
9. `Authorization: ApiKey <key>` başlığıyla `GET https://api.expense-budget-tracker.com/v1/me` çağrısını yap.
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Gerekirse `POST /v1/workspaces` ile bir çalışma alanı oluştur.
12. `POST /v1/workspaces/{workspaceId}/select` ile varsayılan çalışma alanını kaydet.
13. `GET https://api.expense-budget-tracker.com/v1/schema` ile erişime açık ilişkileri incele.
14. Okuma için `POST https://api.expense-budget-tracker.com/v1/sql/query`, onaylı yazma işlemleri için `POST https://api.expense-budget-tracker.com/v1/sql/execute` çağrısını kullan.

Çalışma alanını açıkça seçersiniz. `POST /v1/workspaces/{workspaceId}/select` çağrısından sonra seçili çalışma alanı bu API anahtarı için kaydedilir. Sonraki `/v1/sql/query` ve `/v1/sql/execute` çağrılarında `X-Workspace-Id` başlığı isteğe bağlıdır. Belirli bir istekte kayıtlı çalışma alanı yerine başka bir alan kullanmak için `X-Workspace-Id` gönderebilirsiniz. Uyumluluk için sunulan `POST /v1/sql` yalnızca birden fazla deyimin atomik biçimde çalıştırıldığı betikler içindir. Normal okuma ve yazma işlemlerinde ilgili uç noktaları kullanın.

Kullanıcının yalnızca bir çalışma alanı varsa ve anahtar için henüz seçim kaydedilmemişse sunucu bu alanı otomatik olarak kaydeder ve kullanır.

## Ajanın saklaması gereken anahtar

`verify-code` uzun süre geçerli bir anahtar döndürür. Yalnızca sohbet belleğine güvenmeyin.

- Kullanıcı dosyaya yazmayı onaylarsa anahtarı yerel bir `.env` dosyasında `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` olarak saklayın.
- Dosyaya yazma onayı yoksa anahtarı geçerli kabukta `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` olarak dışa aktarın ve kullanıcıdan kalıcı bir yerde saklamasını isteyin.

Kimliği doğrulanmış isteklerde şu başlıklar kullanılır.

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>`, yalnızca istek için başka bir çalışma alanı seçmek istediğinizde veya henüz bir alan kaydedilmediğinde

## Yapay zekâ ajanları için

Şu komutla başlayın.

```bash
curl https://api.expense-budget-tracker.com/v1/
```

Ardından sunucunun döndürdüğü eylemleri izleyin. Keşif belgesi sonraki adımları veriyorsa bunları sabit kodlamayın.

`verify-code` çağrısından sonra döndürülen `ApiKey` değerini güvenli biçimde saklayın. Ardından şu uç noktaları kullanın.

- Hesap bilgileri için `/v1/me`
- Kullanılabilir çalışma alanları için `/v1/workspaces`
- İzin verilen SQL ilişkileri ve sütunları için `/v1/schema`
- `/v1/openapi.json` veya `/v1/swagger.json` yalnızca istemci bilinen belirtim adreslerini yokluyorsa kullanılır. API belirtimi yerine keşif adresini ve kaynak kod bağlantılarını döndürürler.

## Kullanıcılar için örnek istemler

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

## Kurulumdan sonra yapabilecekleriniz

- Banka ekstrelerini veya dışa aktarılan kart hareketlerini içe aktarın.
- İşlemleri mevcut kategorilerinize göre sınıflandırın.
- Hesap bakiyelerini bankadaki bakiyelerle karşılaştırıp doğrulayın.
- Harcamaları kategoriye, döneme, harcamanın yapıldığı işletmeye veya hesaba göre sorgulayın.
- Gelecek ayın bütçe satırlarını güncelleyin.

Uç noktalar ve kimlik doğrulama ayrıntıları için [API başvuru kılavuzuna](/tr/docs/api/) bakın.
