import type { getSiteMessages } from "@/lib/i18n/messages";

export const messages = {
  auth: {
    login: "Oturum aç",
    signup: "Ücretsiz kaydol",
    openApp: "Uygulamayı aç",
  },
  header: {
    features: "Özellikler",
    pricing: "Fiyatlandırma",
    docs: "Belgeler",
    blog: "Blog",
    toggleMenu: "Menüyü aç veya kapat",
  },
  footer: {
    productTitle: "Ürün",
    openSourceTitle: "Açık kaynak",
    legalTitle: "Yasal bilgiler",
    documentation: "Belgeler",
    selfHostingGuide: "Kendi sunucunuzda barındırma rehberi",
    support: "Destek",
    privacyPolicy: "Gizlilik Politikası",
    termsOfService: "Hizmet Koşulları",
    builtBy: "Kirill Markin geliştirdi",
    localeSwitcherAriaLabel: "Dil seç",
    localeSearchLabel: "Dil ara",
    localeSearchEmpty: "Aramanıza uygun dil bulunamadı",
    operatedBy: "İşletmeci SAMO DANNI EOOD · KDV No BG207395566 · Bulgaristan",
  },
  breadcrumbs: {
    ariaLabel: "Gezinti yolu",
    home: "Ana sayfa",
    docs: "Belgeler",
    blog: "Blog",
  },
  home: {
    copyCode: {
      idle: "Kopyala",
      copied: "Kopyalandı",
      failed: "Kopyalanamadı",
    },
    humanTitle: "Kullanıcılar için",
    humanWebApp: "Web uygulaması",
    agentTitle: "Yapay zekâ ajanları için",
    agentDescription:
      "Yapay zekâ ajanınızı MCP üzerinden bağlayın. Expense Budget Tracker sunucusunu uyumlu bir MCP istemcisine eklediğinizde istemci finansal verilerinizi okuyabilir ve güncelleyebilir.",
    showcaseEyebrow: "Uygulamadan bir ekran",
    showcaseTitle: "Bütçe çalışma alanına göz atın",
    showcaseImageAlt:
      "Expense Budget Tracker arayüzünde yapay zekâ sohbeti, bütçe kategorileri, gerçekleşen harcamalar, bu ayın görünümü ve gelecek aylara ait planlar.",
  },
  docs: {
    title: "Belgeler",
    description:
      "Başlangıç rehberi, yapay zekâ ajanı ve MCP kurulumu, kendi sunucunuzda barındırma, API başvuru kılavuzu ve sisteme genel bakış.",
  },
  blogIndex: {
    title: "Blog",
    description: "Expense Budget Tracker hakkında haberler, rehberler ve bilgiler.",
    empty: "Yazılar yakında yayımlanacak.",
  },
  blogPost: {
    publishedLabel: "Yayım tarihi",
    bylinePrefix: "Yazar:",
    relatedHeading: "Sonraki yazılar",
  },
  blogCta: {
    heading: "Expense Budget Tracker'ı deneyin",
    buttonLabel: "Deneyin",
  },
  legal: {
    lastUpdated: "Son güncelleme:",
  },
} satisfies ReturnType<typeof getSiteMessages>;
