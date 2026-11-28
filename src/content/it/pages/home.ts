import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_IT = {
  locale: "it",
  title: "Expense Budget Tracker - App open source per le finanze",
  description:
    "Strumento open source per monitorare le spese e pianificare il budget, con supporto multivaluta, dashboard finanziarie, un server MCP gestito e un’API per agenti.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Tieni traccia delle spese.",
        "Pianifica il budget.",
        "Mantieni il controllo dei tuoi dati.",
      ],
      subtitle:
        "Gestisci le finanze personali con uno strumento open source che offre supporto multivaluta, pianificazione del budget e dashboard finanziarie. Per iniziare con Claude Code, Codex o OpenClaw, passa all’agente l’URL da cui partire per configurare l’API e conferma il codice di verifica ricevuto via email. Al resto pensa l’agente.",
      primaryLink: {
        label: "Inizia",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "Vai su GitHub",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "Collega un client che supporta MCP remoto e OAuth",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
      },
    },
    {
      type: "feature_list",
      title: "Funzionalità",
      intro:
        "Tieni sotto controllo le tue finanze personali e i tuoi dati.",
      items: [
        {
          title: "Supporto multivaluta",
          description:
            "Tieni traccia dei conti in qualsiasi valuta. La conversione è automatica e usa i tassi di cambio di BCE, CBR e NBS.",
        },
        {
          title: "Pianificazione del budget",
          description:
            "Organizza il budget in una griglia mensile per categorie di entrata e di spesa. Confronta gli importi pianificati con quelli effettivi.",
        },
        {
          title: "Dashboard",
          description:
            "Visualizza la ripartizione delle spese, l’andamento dei saldi e l’effetto dei tassi di cambio sul tuo portafoglio.",
        },
        {
          title: "Self-hosting",
          description:
            "Usa Docker Compose con Postgres. I dati restano sul tuo server, senza dipendenze da terze parti.",
        },
        {
          title: "MCP e API per agenti",
          description:
            "Collega un client che supporta MCP remoto e OAuth per consultare i dati finanziari con l’autorizzazione obbligatoria expenses:read. Il client può richiedere anche expenses:write, un’autorizzazione facoltativa che compare nella schermata di consenso OAuth ed è necessaria per creare, modificare o eliminare dati. Per gli agenti da riga di comando o i client che accedono direttamente via HTTP, parti da GET https://api.expense-budget-tracker.com/v1/ e usa l’API per agenti con un’ApiKey.",
        },
        {
          title: "Spazi di lavoro isolati",
          description:
            "Postgres applica regole di sicurezza a livello di riga. Ogni utente ha uno spazio di lavoro isolato, che può condividere tramite inviti.",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "it" };
