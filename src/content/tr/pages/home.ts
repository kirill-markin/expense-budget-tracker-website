import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_TR = {
  locale: "tr",
  title: "Expense Budget Tracker – Açık kaynak kişisel finans aracı",
  description:
    "Birden fazla para birimini destekleyen açık kaynak gider ve bütçe takip aracı. Gösterge panelleri, barındırılan MCP sunucusu ve Ajan API'si içerir.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Giderlerinizi takip edin.",
        "Bütçenizi planlayın.",
        "Verilerinizin kontrolü sizde olsun.",
      ],
      subtitle:
        "Açık kaynak kişisel finans aracıyla giderlerinizi farklı para birimlerinde takip edin, bütçe planlayın ve mali durumunuzu gösterge panellerinde inceleyin. Claude Code, Codex veya OpenClaw'a tek bir API keşif adresi verin ve e-postadaki doğrulama kodunu girin. Bağlantının kalan adımlarını ajan sizin için tamamlar.",
      primaryLink: {
        label: "Başlayın",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "GitHub'da görüntüleyin",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "OAuth destekli uzak MCP istemcinizi bağlayın:",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
      },
    },
    {
      type: "feature_list",
      title: "Özellikler",
      intro:
        "Verilerinizin kontrolünü elinizde tutarak kişisel mali durumunuzu takip edin.",
      items: [
        {
          title: "Çoklu para birimi",
          description:
            "Hesaplarınızı dilediğiniz para biriminde takip edin. Tutarlar ECB, CBR ve NBS kurlarıyla otomatik olarak dönüştürülür.",
        },
        {
          title: "Bütçe planlama",
          description:
            "Gelir ve gider kategorileri içeren aylık bütçe tablosunda planlanan ve gerçekleşen tutarları karşılaştırın.",
        },
        {
          title: "Gösterge panelleri",
          description:
            "Harcama dağılımını, bakiyelerin zaman içindeki değişimini ve döviz kurlarının portföyünüze etkisini grafiklerle görün.",
        },
        {
          title: "Kendi sunucunuzda barındırma",
          description:
            "Docker Compose ve Postgres ile çalışır. Verileriniz kendi sunucunuzda kalır. Üçüncü taraf bağımlılığı yoktur.",
        },
        {
          title: "MCP ve Ajan API'si",
          description:
            "OAuth destekli uzak bir MCP istemcisi bağlayıp zorunlu expenses:read kapsamıyla finansal verilerinizi sorgulayın. İstemci isteğe bağlı expenses:write kapsamını da talep edebilir. Bu kapsam OAuth onay ekranında gösterilir ve veri değişiklikleri için gereklidir. Terminal veya doğrudan HTTP kullanan ajanlar için GET https://api.expense-budget-tracker.com/v1/ ile başlayın ve Ajan API'sine bir ApiKey ile bağlanın.",
        },
        {
          title: "Ayrı çalışma alanları",
          description:
            "Postgres satır düzeyinde güvenlik uygular. Her kullanıcının ayrı bir çalışma alanı vardır. Çalışma alanınızı paylaşmak için davet gönderin.",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "tr" };
