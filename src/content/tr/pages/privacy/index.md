---
title: Gizlilik Politikası
description: Expense Budget Tracker gizlilik politikası.
slug: privacy
sections:
  - type: legal_page
    lastUpdated: Ağustos 2026
---
## Topladığımız veriler

Bulut sürümünü kullandığınızda girdiğiniz finansal verileri (işlemler, bütçeler, hesap adları) ve kimlik doğrulama için e-posta adresinizi saklarız. Kendi sunucunuzda barındırdığınız kurulumlar bize veri göndermez.

## İşletmeci

Barındırılan Expense Budget Tracker hizmetini SAMO DANNI EOOD (KDV No BG207395566) işletir. [kirill-markin.com](https://kirill-markin.com/), Expense Budget Tracker'ı geliştiren Kirill Markin'in ürünle bağlantılı kişisel sitesidir.

Bu politika, barındırıp işlettiğimiz web sitesi, uygulama, API ve uzak MCP hizmeti için geçerlidir. Uygulamayı kendi sunucusunda barındıranlar kurulumlarını kendileri yönetir.

## Verilerinizi nasıl kullanıyoruz?

Finansal verilerinizi yalnızca hizmeti sunmak için kullanırız. Verilerinizi satmayız ve reklam amacıyla kullanmayız. Yalnızca sizin talimatınızla üçüncü taraf bir istemciyle veri paylaşırız. Bir MCP bağlantısına erişim izni vermeniz buna bir örnektir. Postgres'in satır düzeyinde güvenliği her çalışma alanını ayrı tutar.

## MCP ve üçüncü taraf yapay zekâ istemcileri

Barındırılan MCP hizmetine bir yapay zekâ istemcisi bağladığınızda Expense Budget Tracker, OAuth yetkilendirme isteğini, istenen aracı ve araca gönderilen parametreleri, seçili çalışma alanını ve okuma isteğini karşılamak veya onaylanan yazma işlemini gerçekleştirmek için gereken finansal kayıtları işler. MCP üzerinden yaptığınız değişiklikler, web uygulamasında yaptığınız değişikliklerle aynı bulut verilerine işlenir.

Hizmet, kayıtlı istemcinin adını ve yönlendirme URL'lerini, bağlantıya ve izin kapsamına ait meta verileri, oluşturma, etkinlik ve iptal zamanlarını saklar. OAuth yetkilendirme kodlarını ve erişim ile yenileme belirteçlerini tek yönlü özet olarak saklar. Ham OAuth belirteçlerini saklamaz. MCP hizmeti her araç isteğini alır ve istenen sonucu döndürür. İstemcide geçen konuşmayı uygulamanın sohbet geçmişine kaydetmez.

Yapay zekâ istemcisi ayrı bir üçüncü taraf hizmetidir. İstemlerinizi, araç parametrelerini ve döndürülen finansal verileri kendi koşulları ve gizlilik politikası uyarınca işleyebilir veya saklayabilir. Bağlanmadan önce istemcinin politikasını inceleyin. MCP bağlantısını **Ayarlar → Yapay zekâ ajanı ve program erişimi** bölümünden dilediğiniz zaman iptal edebilirsiniz. Aşağıda açıklandığı gibi, hesabınızı ve hesabınıza bağlı bulut verilerini **Ayarlar** bölümünden silebilirsiniz.

## Verilerin saklanması

Bulut verilerini AWS RDS (Postgres) üzerinde eu-central-1 bölgesinde saklarız ve her gün otomatik olarak yedekleriz. Veriler depolanırken ve aktarım sırasında şifrelenir.

## Çerezler

Kimlik doğrulama için bir `session` çerezi kullanırız (HttpOnly, Secure, SameSite=Lax). İzleme çerezleri veya üçüncü taraf analiz araçları kullanmayız.

## Verilerin silinmesi

Uygulamadaki **Ayarlar** bölümünden hesabınızı ve hesabınızla ilişkili tüm verileri dilediğiniz zaman silebilirsiniz. Kendi sunucunuzda barındırdığınız kurulumlarda veritabanını doğrudan siz yönetirsiniz.

## Açık kaynak

Kodun tamamı açık kaynaklıdır. Uygulamanın verilerinizle tam olarak ne yaptığını inceleyebilirsiniz.
