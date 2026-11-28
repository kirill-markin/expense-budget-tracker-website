---
title: Başlangıç
description: Bulut sürümüne kaydolun veya uygulamayı dakikalar içinde kendi sunucunuzda çalıştırın.
---

## Bulut sürümü

Başlamanın en hızlı yolu yönetilen bulut sürümünü kullanmaktır.

1. [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com) adresine gidin.
2. E-posta adresinizle kaydolun. E-postanıza gelen tek kullanımlık doğrulama koduyla (OTP) oturum açın.
3. Web uygulamasında giderlerinizi takip etmeye başlayın.
4. MCP destekli bir istemciye `https://mcp.expense-budget-tracker.com/mcp` adresini ekleyin ve tarayıcınızda erişimi yetkilendirin.
5. Terminalde çalışan bir ajan veya doğrudan HTTP istemcisi kullanıyorsanız `GET https://api.expense-budget-tracker.com/v1/` ile başlayın.

Uygulama yüklemeniz veya sunucu kurmanız gerekmez. Postgres, satır düzeyinde güvenlikle her çalışma alanının verilerini ayrı tutar.

## Ajan ve program erişimi

Aynı bulut hesabına web arayüzünden, MCP üzerinden veya Ajan API'siyle erişebilirsiniz.

- `https://app.expense-budget-tracker.com` adresindeki web arayüzü
- `https://mcp.expense-budget-tracker.com/mcp` adresinde sunulan [MCP bağlayıcısı](/tr/docs/mcp-connector/) ve tarayıcı üzerinden OAuth yetkilendirmesi
- `GET https://api.expense-budget-tracker.com/v1/` ile başlayan [Ajan API'si kurulumu](/tr/docs/agent-setup/) ve ardından `Authorization: ApiKey <key>` başlığıyla doğrudan HTTP istekleri

## Kendi sunucunuzda barındırma

Uygulamayı kendiniz çalıştırmayı tercih ederseniz [kendi sunucunuzda barındırma rehberine](/tr/docs/self-hosting/) bakın.

## Demo modu

Uygulamanın kendi demo modu var. Örnek verilerle arayüzü incelemek için üst çubukta **Tümü** seçeneğinden **Demo** seçeneğine geçin. Bunun için veritabanı gerekmez.
