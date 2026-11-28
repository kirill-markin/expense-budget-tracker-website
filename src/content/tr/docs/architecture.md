---
title: Mimari
description: Sistemin bileşenleri, veri modeli, çoklu para birimi desteği ve kimlik doğrulama yöntemleri.
---

## Sisteme genel bakış

```
Browser UI      --> Next.js web app --------------------> Postgres (RLS)
Machine clients --> API Gateway (REST) --> SQL Lambda ------^
MCP clients     --> API Gateway (HTTP) --> MCP Lambda ------^
Auth service (OTP + OAuth) --------------------------------^
Worker (FX fetchers) ---------------------------------------^
```

Altı bileşen aynı veritabanını kullanır.

1. **web** – Gösterge panellerini ve API rotalarını içeren Next.js uygulaması
2. **auth** – Kimlik doğrulama alan adında e-postadaki tek kullanımlık kodla oturum açma ve ajanların ilk bağlantısını kurma
3. **sql-api** – Programatik istemciler için API Gateway arkasında çalışan AWS Lambda
4. **mcp** – Barındırılan MCP uç noktasına ayrılmış AWS Lambda ve API Gateway HTTP API'si
5. **worker** – ECB, CBR ve NBS'den günlük döviz kurlarını alır
6. **Postgres** – Satır düzeyinde güvenlik uygulayan, sistemin esas aldığı tek veri kaynağı

## Veri modeli

- **ledger_entries** – Her hesap hareketi (gelir, gider, transfer) için tek satır
- **budget_lines** – Bütçe hücrelerinin değerleri yeni kayıtlar olarak eklenir. Son yazılan değer geçerlidir.
- **budget_comments** – Bütçe hücrelerine bağlı notlar. Mevcut kayıtlar değiştirilmez, yalnızca yeni kayıt eklenir.
- **workspace_settings** – Raporlama para birimi ve çalışma alanı ayarları
- **account_metadata** – Likidite sınıflandırması gibi hesaba özel meta veriler
- **exchange_rates** – Sorgu sırasında dönüşüm için kullanılan günlük döviz kurları
- **workspaces** / **workspace_members** – Birbirinden ayrı çalışma alanları ve üyelikleri
- **accounts** – Hesap kayıtlarından türetilen görünüm

## Çoklu para birimi

Her tutar kendi para biriminde saklanır. Veriler okunurken SQL, `exchange_rates` tablosuyla birleştirme yaparak tutarları raporlama para birimine çevirir. Önceden dönüşüm yapılmadığı için bilgi kaybı olmaz.

## Kimlik doğrulama

`AUTH_MODE` ortam değişkeni iki moddan birini seçer.

- `none` – Kimlik doğrulama yok, tek bir yerel çalışma alanı var
- `cognito` – AWS Cognito ile herkese açık kayıt ve e-postadaki tek kullanımlık kodla parolasız oturum açma

Programatik istemciler için herkese açık keşif uç noktası `GET /v1/` adresidir. Ajan, kimlik doğrulama alan adında e-postadaki tek kullanımlık kodla oturum açar ve uzun süre geçerli bir ApiKey alır. Ardından API Gateway arkasındaki programatik API üzerinden SQL çalıştırır.

MCP destekli istemciler `https://mcp.expense-budget-tracker.com/mcp` adresine ayrı olarak bağlanır. Bu bağlantıyı ayrı bir API Gateway HTTP API'si ve MCP Lambda işlevi yönetir. Kullanıcı, kimlik doğrulama alan adını tarayıcıda açarak OAuth üzerinden erişimi onaylar.

Her kullanıcının ayrı bir çalışma alanı vardır. RLS politikaları, programatik SQL istekleri dahil her sorguda üyeliği denetler.
