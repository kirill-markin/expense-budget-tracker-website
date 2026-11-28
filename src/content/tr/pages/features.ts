import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_TR = {
  locale: "tr",
  title: "Özellikler",
  description:
    "Çoklu para birimi desteği, bütçe planlama, gösterge panelleri, barındırılan MCP sunucusu, Ajan API'si, kendi sunucunuzda barındırma ve ayrı çalışma alanları.",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "Özellikler",
      intro:
        "Verilerinizin kontrolünü elinizde tutarak kişisel mali durumunuzu takip edin.",
      items: [
        {
          title: "Farklı para birimlerinde hesaplar",
          description:
            "Her işlemi kendi para biriminde saklayın. ECB, CBR ve NBS'nin günlük döviz kurlarıyla tutarlar veriler okunurken raporlama para biriminize çevrilir. Önceden dönüşüm yapılmadığı için bilgi kaybı olmaz.",
        },
        {
          title: "Bütçe tablosu",
          description:
            "Gelir ve gider kategorileriyle aylık bütçe oluşturun. Planlanan tutarları belirleyin, gerçekleşen tutarlarla karşılaştırın ve farkı takip edin. Her değişiklik, yalnızca yeni kayıt eklenebilen denetim geçmişine yazılır.",
        },
        {
          title: "Bakiye takibi",
          description:
            "Her hesabın güncel bakiyesi hesap kayıtlarından otomatik olarak hesaplanır. Toplamları dilediğiniz para biriminde görün. Kendi hesaplarınız arasındaki transferler ayrı bir işlem türü olarak izlenir.",
        },
        {
          title: "Gösterge panelleri",
          description:
            "Harcama dağılımını, bakiyelerin zaman içindeki değişimini ve döviz kurlarının etkisini grafiklerle inceleyin. Bu araçlar uygulamaya dahildir ve ayrı bir iş zekâsı aracı gerektirmez.",
        },
        {
          title: "Ajan API'si",
          description:
            "Terminal ve doğrudan HTTP kullanan ajanlar için ayrı bir erişim yolu. GET https://api.expense-budget-tracker.com/v1/ ile başlayın. Ardından Ajan API'sine ApiKey ile bağlanıp izin verilen SQL deyimlerini çalıştırın. Satır düzeyinde güvenlik (RLS) tüm sorgularda uygulanır. Çalışma alanını seçebilirsiniz. İstek sayısı sınırlıdır ve işlemler denetlenebilir.",
        },
        {
          title: "Barındırılan MCP sunucusu",
          description:
            "OAuth destekli uzak MCP istemcileri https://mcp.expense-budget-tracker.com/mcp adresine bağlanıp zorunlu expenses:read kapsamıyla finansal verilerinizi sorgulayabilir. İstemci isteğe bağlı expenses:write kapsamını da talep edebilir. Bu kapsam OAuth onay ekranında gösterilir ve veri değişiklikleri için gereklidir.",
        },
        {
          title: "Yapay zekâ sohbeti",
          description:
            "Uygulama içindeki sohbet, finansal verilerinizi kullanır. Harcamalar hakkında soru sorun, dönemleri karşılaştırın veya hesap kayıtlarınıza dayalı yanıtlar alın.",
        },
        {
          title: "Ayrı çalışma alanları",
          description:
            "Postgres'in satır düzeyinde güvenliği verileri birbirinden ayırır. Her kullanıcının bir çalışma alanı vardır. Başkalarını ortak çalışma alanlarına davet edin ve erişimlerini yönetin.",
        },
        {
          title: "Kendi sunucunuzda barındırma",
          description:
            "Docker Compose ve Postgres ile bilgisayarınızda veya kendi sunucunuzda çalıştırın. Bir sağlayıcıya bağımlı kalmadan finansal verileriniz üzerinde tam denetim sağlayın.",
        },
        {
          title: "Parolasız oturum açma",
          description:
            "AWS Cognito, oturum açmanız için e-postayla tek kullanımlık bir doğrulama kodu gönderir. Hatırlamanız gereken veya sızabilecek bir parola yok. Herkes kaydolabilir. Çalışma alanınız otomatik olarak oluşturulur.",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "tr" };
