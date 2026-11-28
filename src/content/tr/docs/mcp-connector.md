---
title: MCP bağlayıcısı
description: Bir MCP istemcisini OAuth ile Expense Budget Tracker'a bağlayın ve finansal verileri güvenle sorgulayın veya güncelleyin.
---

## Genel bakış

Expense Budget Tracker, şu adreste barındırılan bir Model Context Protocol (MCP) bağlayıcısı sunar.

`https://mcp.expense-budget-tracker.com/mcp`

Uç nokta Streamable HTTP ve OAuth kullanır. Bu adresi, Streamable HTTP üzerinden uzak sunuculara bağlanmayı ve OAuth keşfini destekleyen bir MCP istemcisine verin. Oturum açıp erişimi onaylayabilmeniz için yetkilendirme sırasında tarayıcı açılır.

Bağlayıcı, kimlik bilgisi olarak OAuth erişim ve yenileme belirteçlerini kullanır. [API başvuru kılavuzunda](/tr/docs/api/) açıklanan uzun süre geçerli `ApiKey`, ayrı bir doğrudan HTTP entegrasyonuna aittir. MCP uç noktası API anahtarlarını kabul etmez.

## OAuth keşfi ve bağlantı

Barındırılan bağlayıcı, korumalı kaynak meta verilerini şu adreste yayımlar.

`https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp`

Bu meta veriler istemcileri yetkilendirme sunucusuna yönlendirir. Sunucunun meta verileri şu adreste bulunur.

`https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server`

Uyumlu istemci şu adımları izler.

1. `https://mcp.expense-budget-tracker.com/mcp` adresine bağlanır ve korumalı kaynak meta verilerini bulur.
2. İstemci sırrı gerektirmeyen bir OAuth istemcisi (public client) olarak dinamik biçimde kaydolur.
3. Yetkilendirme Kodu (Authorization Code) akışını başlatır ve yetkilendirme adresini kullanıcının tarayıcısında açar.
4. Her yetkilendirme isteğinde PKCE kullanır. PKCE kod sorgusunu (code challenge) oluşturmak için desteklenen tek yöntem `S256`'dır.
5. `expenses:read` kapsamını ister. Yalnızca `sql_execute` çağrısı gerektiğinde `expenses:write` kapsamını ekler.
6. Yetkilendirme kodu karşılığında erişim ve yenileme belirteçlerini alır. Ardından gerektiğinde erişimi yeniler.

Belirteçleri istemlere, sohbet geçmişine, kaynak dosyalara veya günlüklere kopyalamayın. Yalnızca MCP istemcisinin kimlik bilgisi deposunda saklayın.

## Erişim kapsamları

- `expenses:read` zorunludur. Çalışma alanlarını bulmaya, şemayı incelemeye ve salt okunur sorgular çalıştırmaya izin verir.
- `expenses:write` isteğe bağlıdır. Veri oluşturabilen, değiştirebilen veya silebilen `sql_execute` aracını kullanmak için ayrıca izin verir.

Görev için gereken en dar kapsamı kullanın. Yalnızca veri analizi yapan veya rapor hazırlayan istemciler `expenses:read` kapsamını istemeli ve `expenses:write` kapsamını eklememelidir.

## Araçlar

### `list_workspaces`

Oturum açan kullanıcının erişebildiği çalışma alanlarını listeler. Veri okumadan veya değiştirmeden önce hedefi açıkça belirtmek için döndürülen çalışma alanı kimliğini kullanın.

### `get_schema`

Seçili çalışma alanı için MCP üzerinden erişilebilen ilişkileri ve sütunları döndürür. SQL yazmadan önce bu aracı çağırarak tablo ve sütun adlarını doğrulayın.

### `sql_query`

Seçili çalışma alanında kısıtlı, salt okunur tek bir SQL sorgusu çalıştırır. Salt okunur erişim veritabanı düzeyinde de uygulanır. Sonuçlar 100 satırla, sorgu süresi 20 saniyeyle sınırlıdır.

### `sql_execute`

Seçili çalışma alanında verileri değiştiren kısıtlı SQL çalıştırır. Veri kaybına yol açabilecek bu araç için ayrıca `expenses:write` kapsamı gerekir. Çağrıyı onaylamadan önce hedef çalışma alanını doğrulayın ve çalıştırılacak deyimi inceleyin.

MCP sunucusu `sql_execute` aracını da sunduğu için bütünüyle salt okunur değildir. Salt okunur erişim güvencesi `sql_query` ve onu veritabanı düzeyinde kısıtlayan kurallar için geçerlidir.

## Güvenli kullanım

1. `list_workspaces` aracını çağırın ve hedef çalışma alanını kullanıcıyla doğrulayın.
2. SQL oluşturmadan önce `get_schema` aracını çağırın.
3. İnceleme, toplam hesaplama, mutabakat ve raporlar için `sql_query` kullanın.
4. Yalnızca verileri değiştirmesi gereken bir görev için `expenses:write` kapsamını isteyin.
5. `sql_execute` öncesinde çalıştırılacak deyimi ve beklenen etkisini gösterin, ardından çalışma alanını tekrar doğrulayın.
6. Yazma işleminden sonra sonucu `sql_query` ile doğrulayın.

Sunucu, kullanılabilen SQL komutlarını ve erişime açık ilişkileri sınırlar. Bu önlemlere ek olarak üretilen SQL'i dikkatle inceleyin.

## Sınırlar

- SQL sonuçlarında en fazla 100 satır
- 20 saniyelik yürütme sınırı
- Yalnızca oturum açan kullanıcının erişebildiği çalışma alanlarına erişim
- `sql_query` için kısıtlı SQL ve veritabanı düzeyinde salt okunur erişim
- `sql_execute` için zorunlu okuma kapsamına ek olarak `expenses:write` kapsamı

## Gizlilik ve kendi sunucunuzda barındırma

Yetkili bir MCP istemcisi finansal verileri okuyabilir ve `expenses:write` kapsamıyla değiştirebilir. Bağlanmadan önce [gizlilik politikasını](/tr/privacy/) ve istemcinin kendi veri işleme politikasını inceleyin.

Yukarıdaki barındırılan adresler yalnızca yönetilen Expense Budget Tracker hizmeti için geçerlidir. Kendi kurulumunuz için [kendi sunucunuzda barındırma rehberiyle](/tr/docs/self-hosting/) başlayın ve kendi alan adlarınız için MCP uç noktasını ve OAuth meta verilerini yapılandırın. Uygulama kodu [kaynak kod deposunda](https://github.com/kirill-markin/expense-budget-tracker) bulunur.
