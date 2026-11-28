---
title: Destek
description: Expense Budget Tracker ve barındırılan MCP hizmeti için destek alma ve güvenlik sorunu bildirme rehberi.
slug: support
sections:
  - type: simple_markdown_page
---

## Bulut hizmeti ve MCP desteği

Bulut uygulaması, hesabınız, OAuth yetkilendirmesi veya herkese açık MCP sunucusuyla ilgili yardım almak için [markinkirill@gmail.com](mailto:markinkirill@gmail.com) adresine yazın. İmkânlarımız ölçüsünde yardımcı oluruz. Yanıt süresi garanti edilmez.

Yalnızca sorunu incelemek için gereken bilgileri paylaşın.

- İstemcinin adı ve sürümü
- Sorunun yaşandığı tarih, saat ve saat dilimi
- İlgili uç nokta veya sayfa
- OAuth adımı veya MCP aracının adı
- Varsa hassas bilgilerden arındırılmış hata mesajının tam metni ve istek kimliği
- Beklediğiniz ve gerçekleşen davranış

Parolaları, oturum çerezlerini, OAuth kodlarını, erişim veya yenileme belirteçlerini, API anahtarlarını, ham finansal kayıtları veya hassas bilgilerden arındırılmamış istek gövdelerini asla göndermeyin.

## Güvenlik bildirimleri

Olası bir güvenlik açığını herkese açık bir GitHub kaydıyla bildirmeyin. [markinkirill@gmail.com](mailto:markinkirill@gmail.com) adresine **Expense Budget Tracker security report** konusuyla e-posta gönderin. Sorunu yeniden gözlemlemek için gereken en kısa adım dizisini, hassas bilgileri çıkararak yazın. Geçerli kimlik bilgilerini veya finansal verileri paylaşmayın. Erişim bilgilerinin açığa çıkmış olabileceğini düşünüyorsanız önce **Ayarlar → Yapay zekâ ajanı ve program erişimi** bölümünden bağlantıyı iptal edin ve etkilenen diğer kimlik bilgilerini yenileyin.

## Hatalar, kendi sunucunuzda barındırma ve topluluk soruları

Tekrar karşılaşılabilen ürün hatalarını bildirmek, kendi sunucunuzda barındırma hakkında soru sormak veya toplulukla açıkça tartışmak için [GitHub sorun takip sistemini](https://github.com/kirill-markin/expense-budget-tracker/issues) kullanın. Önce mevcut kayıtları arayın. Günlüklerden ve ekran görüntülerinden özel verileri çıkarın. Kurulum ve geliştirme hakkında [kendi sunucunuzda barındırma rehberine](/tr/docs/self-hosting/) ve [kaynak kod deposuna](https://github.com/kirill-markin/expense-budget-tracker) bakın.

## MCP sorunu bildirmeden önce

İstemcinizin Streamable HTTP üzerinden uzak MCP bağlantılarını, PKCE kullanan OAuth 2.1 yetkilendirme kodu akışını ve dinamik istemci kaydını (Dynamic Client Registration) desteklediğini doğrulayın. [MCP rehberindeki](/tr/docs/mcp-connector/) ortak uç noktayı aynen kullanın ve yeniden bağlandıktan sonra bir kez daha deneyin. Sorun sürerse yukarıda belirtilen bilgileri hassas verilerden arındırarak gönderin.
