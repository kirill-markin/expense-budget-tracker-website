---
title: "Claude Code ile gider takibi, ekstre aktarımı ve mutabakat"
description: "Claude Code'u tek bağlantıyla Expense Budget Tracker'a bağlayın. Ekstreyi aktarmadan önce önerilen kayıtları inceleyip onaylayın, bakiye mutabakatı yapın ve banka bağlantısı kurmadan bütçenizi güncelleyin."
date: "2026-03-05"
updated: "2026-09-11"
image: "/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png"
keywords:
  - "Claude Code gider takibi"
  - "Claude gider takip aracı"
  - "Claude için harcama takibi"
  - "Claude Code bütçe takibi"
  - "Claude ile gider takip aracını bağlama"
  - "Claude Code ile banka ekstresi içe aktarma"
---

Dört satırlık bir ekstreyi aktarırken bakiye farkı `€0.00` çıkabilir ve bütçeniz yine de hatalı olabilir. €54.20 tutarındaki bir süpermarket alışverişini yanlışlıkla Seyahat kategorisine yazdığınızı düşünün. Hesap bakiyesi doğru kalır, ancak Market alışverişi ve Seyahat toplamlarında €54.20 sapma olur.

Claude Code ile gider takibi yaparken iki ayrı kontrol gerekir. Hesap kayıtlarının toplamı banka bakiyesini açıklamalı. Her işlemin kategorisi de incelediğiniz ekstreyle uyuşmalı. Claude Code dosyayı okuyup ayrıştırabilir, hesaplamaları yapabilir ve API'yi çağırabilir. Hesabı ve kategorileri siz seçin. Önerilen kayıtları inceleyip yazılacak değişikliklerin tamamını onaylayın.

Expense Budget Tracker bu kurulumda bankayla kalıcı bir bağlantı kurmaz ve ekstre yüklemek için bir ekran sunmaz. Ekstreyi kendiniz dışa aktarın, Claude Code'un okuyabileceği bir yere koyun ve yönetilen Ajan API'si üzerinden yalnızca onayladığınız kayıtları gönderin. Kalıcı banka erişiminden kaçınmak önceliğinizse [banka bağlantısı olmadan bütçe takibi yazısında](/blog/budget-app-without-bank-linking/) (İngilizce) bu seçimin getirdiklerini ayrıntılı inceleyebilirsiniz.

![Bir mozaik restoratörü, dengedeki pirinç terazinin yanında, pişmiş toprak şeride yanlış yerleştirilmiş mavi bir parçayı kaldırıyor.](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png)

## Claude Code'u tek bir keşif bağlantısıyla bağlayın

Anthropic'in [resmî hızlı başlangıç kılavuzunu](https://code.claude.com/docs/en/quickstart) izleyerek Claude Code'u kurun ve oturum açın. Çalışma dizinlerini ve başka dosyalara nasıl erişim vereceğinizi [CLI başvuru kılavuzu](https://code.claude.com/docs/en/cli-reference) açıklar.

Ekstrenin bulunduğu dizinde `claude` komutunu çalıştırın veya kurulumunuzun desteklediği bir yöntemle bu dizine erişim verin. Ardından aşağıdaki istemi yapıştırın.

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

[Ajanlar için uygulama bağlantısı](https://app.expense-budget-tracker.com/api/agent) güncel keşif belgesini döndürür. Belgede şu anda API taban adresi olarak `https://api.expense-budget-tracker.com/v1/` ve kimlik doğrulama ile SQL işlemlerinin adresleri bulunur. Uygulama alan adındaki bağlantıyı yapıştırın. Claude Code buradan hizmetin döndürdüğü adresleri izleyerek ilerlemeli.

E-postayla doğrulama adımları hem kayıt hem de oturum açma için aynıdır. 8 haneli doğrulama kodunu verdiğinizde Claude Code uzun süre geçerli bir `ApiKey` alır. Anahtarın nerede saklanacağını siz onaylayın. Örneğin sürüm kontrolü dışında tutulan bir gizli bilgi dosyası kullanabilirsiniz. Anahtarı asla `CLAUDE.md` dosyasına yazmayın veya sürüm kontrolüne eklemeyin. [Yapay zekâ ajanı kurulum rehberi](/tr/docs/agent-setup/) kimlik doğrulama ve çalışma alanı seçiminin ayrıntılarını açıklar.

## Ajan API'si ve MCP arasındaki fark

“Claude ile gider takibi” iki farklı entegrasyon anlamına gelebilir. Bu yazıda Claude Code'u terminalde Ajan API'siyle kullanıyoruz. Claude ve Claude Desktop ise barındırılan uzak MCP bağlayıcısıyla çalışabilir.

| | Ajan API'si ile Claude Code | MCP ile Claude veya Claude Desktop |
|---|---|---|
| Uygun kullanım | Erişilebilir yerel dosyalarla terminalde ve doğrudan HTTP üzerinden çalışma | MCP destekli Claude istemcisinde sohbet |
| Başlangıç noktası | `https://app.expense-budget-tracker.com/api/agent` | `https://mcp.expense-budget-tracker.com/mcp` |
| Kimlik doğrulama | E-postayla tek kullanımlık doğrulama kodu, ardından uzun süre geçerli `ApiKey` | Tarayıcıda OAuth |
| Veri erişimi | Sorgu ve yazma uç noktalarına yönlendiren keşif adresleri | `sql_query` ve isteğe bağlı `sql_execute` araçları |
| Ekstreye erişim | Claude Code oturumunun erişebildiği dosya ve dizinler | Uzak bağlayıcı yerel dosyalara erişim sağlamaz |

Her entegrasyonun kendi kimlik bilgileri vardır. Claude web veya masaüstü uygulaması için [Claude ile gider takibinde MCP kullanımını anlatan rehberi](/blog/claude-expense-tracker-mcp-connector/) (İngilizce) izleyin. Başlangıç noktanız Claude Code'un erişebildiği bir dosyaysa aşağıdaki Ajan API'si akışını kullanın.

Veri paylaşımı ve kendi sunucunuzda barındırma da kuruluma göre değişir.

- Model sağlayıcısı verileri, Expense Budget Tracker'ın API'sinden ve depolama sisteminden ayrı işler. Ekstre verilerini paylaşmadan önce [Claude Code veri kullanımı belgelerini](https://code.claude.com/docs/en/data-usage) ve kurulumunuzda seçili sağlayıcının koşullarını inceleyin.
- [Kendi sunucunuzda barındırma rehberindeki](/tr/docs/self-hosting/) Docker Compose ile yerel kurulum web uygulamasını, kimlik doğrulama hizmetini, veritabanını ve döviz kurlarını alan arka plan sürecini başlatır. Burada kullanılan yönetilen Ajan API'si bu kuruluma dahil değildir. Depoda açıklanan ayrı AWS dağıtımı, programatik istemcilere açık API'yi de içerir.

## İçe aktarmanın kapsamını belirleyin

İlk denemede tek bir hesap, tek bir para birimi ve kapanmış tek bir ekstre dönemi seçin. CSV kullanışlıdır çünkü satırlarını incelemek kolaydır. Başka bir dışa aktarma biçimi kullanacaksanız önce Claude Code'un dosyayı sizin ortamınızda okuyabildiğini doğrulatın ve ayrıştırdığı satırları göstermesini isteyin. Yalnızca dosya adına bakarak biçimin desteklendiğini varsaymayın.

Claude Code'a şu altı bilgiyi verin.

1. Ekstrenin yerel dosya yolu.
2. Banka hesabı ve takip aracındaki karşılığı.
3. Hesabın para birimi.
4. Bankanın hesaba işlediği ilk ve son hareketin tarihi.
5. Açılış bakiyesi veya doğruluğundan emin olduğunuz önceki bakiye.
6. Ekstrenin kapanış bakiyesi.

Bekleyen işlemleri ancak banka hesaba işledikten sonra aktarın. Kaynak dosyayı değiştirmeden Claude Code'dan ayrı bir önizleme hazırlamasını isteyin.

Finans dosyalarının bulunduğu dizinde kullanabileceğiniz aşağıdaki kuralları `CLAUDE.md` dosyasına ekleyebilirsiniz.

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

Gerçek hesap adlarınız, kategori kurallarınız, transferleri nasıl kaydettiğiniz ve raporlama para biriminiz gibi kalıcı bilgileri ekleyin. Bu yazıdaki örnek kategorileri yalnızca hesap defterinizle uyuşuyorsa kullanın.

## Ekstreyi içe aktarmadan önce tüm satırları inceleyin

Bağlantı çalışınca aşağıdaki istemi yapıştırıp köşeli parantezlerdeki değerleri değiştirin.

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

Siz bir değişikliği onaylayana kadar veritabanında yalnızca okuma yapılır. Claude Code sütun adlarını güncel şemadan doğrulamalı, eşleşen hesabı bulmalı ve aynı döneme ait mevcut hesap kayıtlarını sorgulamalı. Tarih ve tutar eşleşmesi yalnızca olası bir yinelenen kayda işaret eder. İki ayrı alışverişin tarihi de tutarı da aynı olabilir.

### Dört satırlık bir örnek

Bir vadesiz hesap ekstresinde açılış bakiyesi €1,250.00 ve hesaba işlenmiş dört hareket olsun.

| Satır | İşlenme tarihi | Açıklama | İşaretli tutar | Önerilen tür | Önerilen kategori | İnceleme notu |
|---|---|---|---:|---|---|---|
| 1 | 2026-08-31 | Maaş | +€2,000.00 | Gelir | Maaş | Belirsizlik yok |
| 2 | 2026-09-02 | Süpermarket | −€54.20 | Harcama | Market alışverişi | İşletmeyi tanımıyorsanız kontrol edin |
| 3 | 2026-09-03 | Tasarruf hesabına transfer | −€300.00 | Transfer | — | Diğer hesabı doğrulayın |
| 4 | 2026-09-04 | Kafe | −€8.40 | Harcama | Dışarıda yemek | Belirsizlik yok |

Dört hareketin işaretli toplamı `+€1,637.40`. Bunu `€1,250.00` açılış bakiyesine eklediğinizde beklenen kapanış bakiyesi `€2,887.40` olur. Bu örnek bir ekrana sığıyor. Daha uzun bir ekstrede de her kaynak satırı önizlemeye girmeli ve her belirsizlik işaretlenmeli.

Kendi hesaplarınız arasında para taşımak gider sayılmadığı için transferin diğer hesabını doğrulayın. İadeleri ve masraf geri ödemelerini de kendi işlem türleriyle kaydedin. Kategoriden emin değilseniz satırı işaretleyip kararı açık bırakın.

### Önizlemedeki değişiklikleri onaylayın

Çalışma alanını, hesabı, tarih aralığını, satır sayısını, işaretli toplamı, olası yinelenen kayıtları ve sınıflandırmaları inceleyin. Onayınızı yalnızca incelediğiniz önizleme ve SQL için verin.

Ajan API'si okuma ve yazma işlemlerini ayırır. Claude Code, keşif belgesindeki okuma eylemini tek bir `SELECT` veya `WITH ... SELECT` için kullanır. Yazma eylemini yalnızca açıkça onaylanan bir `INSERT`, `UPDATE` veya `DELETE` için çağırır. Tablo ve sütunlar için güncel şemayı esas alın. SQL kuralları ve sınırları [API başvuru kılavuzunda](/tr/docs/api/) açıklanır.

### Büyük ekleme ve güncellemeleri önce küçük bir örnekle deneyin

Güncel keşif talimatlarına göre ajan, uzun bir `INSERT` veya `UPDATE` öncesinde aynı SQL yapısını kullanan küçük bir deneme isteği gönderir. `INSERT` için değerleri doğrudan yazılmış 1–3 satır, `UPDATE` için hedefi belirli tek bir satır kullanılır. Onayınız, incelediğiniz değişiklik kümesindeki deneme satırlarını ve kalan satırları kapsar.

Deneme başarılıysa Claude Code hemen, her biri en fazla 100 kayıt içeren gruplarla sırayla ilerlemeli ve her grubun sonucunu doğrulamalı. Örneğin onaylanmış 247 satırdan 3'üyle deneme yapıldığında 100, 100 ve 44 satırlık üç grup kalır. Kapsam değişirse, yeni bir belirsizlik çıkarsa veya işlem hata verirse yeniden onay gerekir. Önceden onayladığınız diğer gruplar için aynı onay geçerlidir.

Kısıtlı SQL `ON CONFLICT` desteği sunmadığı için yinelenen kayıtları açıkça ele alın. Okuma sonuçları 100 satırla sınırlıdır. Claude Code yanıttaki satır sayısı ve sonucun kesilip kesilmediğiyle ilgili meta verileri kontrol etmeli, toplamları SQL'de hesaplamalı ve ayrıntılı doğrulamayı dar kapsamlı, sıralı sorgulara bölmeli. Kesilmiş bir sonuçla içe aktarmanın tamamı doğrulanamaz.

### Saklanan kayıtları yeniden sorgulayın

Başarılı bir API yanıtı isteğin çalıştığını gösterir. Her değerin önizlemeyle uyuştuğunu görmek için ilgili hesabı ve dönemi yeniden sorgulayıp şu bilgileri karşılaştırın.

- Eklenen satır sayısı
- Tarihler, işaretli tutarlar ve para birimleri
- Kayıtların bağlı olduğu hesaplar
- İşlem türleri ve kategoriler
- Olası yinelenen kayıtlar
- Grup toplamları ve ekstrenin genel toplamı

Bir fark varsa sorunu salt okunur sorgularla inceleyin. Yeniden yazmadan önce tam olarak hangi düzeltmenin yapılacağını gözden geçirin. [Banka ekstresi içe aktarma rehberi](/blog/how-to-import-bank-statements-into-an-expense-tracker/) (İngilizce), örtüşen dönemleri, iadeleri ve transferleri daha ayrıntılı ele alır.

## Bakiye mutabakatını ve kategori kontrolünü ayrı yapın

Bakiye mutabakatında, aynı tarih aralığında hesaba işlenmiş ve kayda alınmış hareketlerin bankanın kapanış bakiyesini açıklayıp açıklamadığına bakarsınız.

Standart bir mevduat hesabı için denklem şöyledir.

**beklenen kapanış bakiyesi = açılış bakiyesi + hesaba işlenen girişler − hesaba işlenen çıkışlar**

Hareketleri artı veya eksi işaretleriyle kaydediyorsanız şu denklemi kullanın.

**beklenen kapanış bakiyesi = açılış bakiyesi + hesaba işlenen hareketlerin işaretli toplamı**

Kredi kartı gibi borç hesaplarında işaret kuralı farklı olabilir. Claude Code karşılaştırmayı hesaplamadan önce gördüğü kuralı belirtmeli.

Aşağıdaki istemle devam edin.

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

Dört satırlık örnekte `€1,250.00 + €1,637.40 = €2,887.40`. Bankanın kapanış bakiyesi de €2,887.40 ise bakiye farkı `€0.00` olur.

Farkın sıfır olması, seçtiğiniz dönemdeki hareketlerin hesap bakiyesiyle uyuştuğunu gösterir. €54.20 tutarındaki süpermarket işlemini Market alışverişi kategorisinden Seyahat kategorisine taşırsanız bakiye farkı sıfır kalır, toplamlar arasında €54.20 yer değiştirir. İçe aktarmayı kabul etmeden önce kategorileri ayrıca kontrol edin.

Fark sıfır çıkmazsa açılış bakiyesini, eksik veya yinelenen satırları, transferleri, bekleyen işlemleri, işaretleri, tarihleri ve para birimlerini inceleyin. Farkı kapatmak için hayalî bir dengeleme işlemi eklemeyin. [Bakiye mutabakatı rehberi](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) (İngilizce) bu incelemenin ayrıntılarını açıklar.

## Bütçeyi mutabakattan sonra güncelleyin

Saklanan satırlar önizlemeyle uyuşunca, bakiye mutabakatı tamamlanınca ve kategori toplamları anlamlı görünüyorsa bütçeye geçin. Claude Code gerçekleşen hareketleri `budget_lines` kayıtlarıyla karşılaştırabilir ve değişiklik önerileri hazırlayabilir. Olağandışı bir ayın tutarlarını gelecek aya otomatik taşımayın.

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

Büyük bir gider tek seferlik olabilir. Bütçeyi aşmış gibi görünen bir harcamanın yanlış sınıflandırılmış bir transfer veya iade olduğu da ortaya çıkabilir. Claude Code farkları hesaplayıp SQL'i hazırlayabilir. Gelecek ayın tutarlarına siz karar verirsiniz.

## Her ekstrede aynı sırayı izleyin

Her ekstreyi şu sırayla işleyin.

1. `https://app.expense-budget-tracker.com/api/agent` adresinden başlayın ve keşif yanıtını izleyin.
2. Hesap bilgilerini alın, çalışma alanını doğrulayın ve güncel şemayı inceleyin.
3. Claude Code'a erişebildiği tek bir ekstre dosyası verin ve bakiye karşılaştırmasının sınırlarını açıkça belirtin.
4. Aynı döneme ait hesap kayıtlarını okuyun ve eksiksiz bir içe aktarma önizlemesi hazırlayın.
5. Belirli bir değişiklik kümesini onaylayın.
6. Uzun bir ekleme işleminde önce 1–3 satırla deneyin, sonra sırayla en fazla 100 satırlık gruplarla ilerleyin.
7. Saklanan her grubu yeniden sorgulayın ve önizlemeyle karşılaştırın.
8. Dengeleme kaydı eklemeden hesap bakiyesini bankanın kapanış bakiyesiyle karşılaştırıp mutabakatı tamamlayın.
9. Bakiye farkı sıfır olsa bile kategori toplamlarını inceleyin.
10. Bütçe satırlarındaki değişiklikleri ayrı ayrı hazırlayın, onaylayın ve doğrulayın.

Tek bir hesap ve kapanmış tek bir dönemle başlayın. Ekstreyi hesap kayıtlarıyla karşılaştırıp mutabakatı tamamlayın. Bütçeyi de gözden geçirdikten sonra aynı adımları diğer hesap için uygulayın. Tekrarlanan dosya ve API işlerini Claude Code yapar. Kayıtlarınızı etkileyen her finansal kararı uygulamadan önce inceleyebilirsiniz.
