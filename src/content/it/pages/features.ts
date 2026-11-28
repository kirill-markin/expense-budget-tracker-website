import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_IT = {
  locale: "it",
  title: "Funzionalità",
  description:
    "Monitoraggio multivaluta, pianificazione del budget, dashboard, connettore MCP gestito, API per agenti, self-hosting e spazi di lavoro isolati.",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "Funzionalità",
      intro:
        "Tieni sotto controllo le tue finanze personali e i tuoi dati.",
      items: [
        {
          title: "Conti multivaluta",
          description:
            "L’app conserva ogni transazione nella sua valuta originale. Quando consulti i dati, converte gli importi nella valuta di rendicontazione usando i tassi giornalieri di BCE, CBR e NBS. Così gli importi originali mantengono la loro precisione.",
        },
        {
          title: "Griglia del budget",
          description:
            "Organizza il budget mensile per categorie di entrata e di spesa. Imposta gli importi pianificati, confrontali con quelli effettivi e monitora lo scostamento. Il registro di controllo conserva ogni modifica senza sovrascrivere le precedenti.",
        },
        {
          title: "Monitoraggio dei saldi",
          description:
            "L’app calcola automaticamente il saldo progressivo di ciascun conto a partire dalle registrazioni. Puoi consultare i totali in qualsiasi valuta. I trasferimenti tra i tuoi conti hanno un tipo di registrazione dedicato.",
        },
        {
          title: "Dashboard",
          description:
            "Ripartizione visiva delle spese, grafici dei saldi nel tempo e analisi dell’effetto dei tassi di cambio, tutto nell’app e senza strumenti di business intelligence esterni.",
        },
        {
          title: "API per agenti",
          description:
            "Un accesso dedicato per gli agenti da riga di comando e i client che accedono direttamente via HTTP. Parti da GET https://api.expense-budget-tracker.com/v1/ e usa l’API per agenti con autenticazione ApiKey per eseguire istruzioni SQL soggette a restrizioni. L’API applica tutte le regole di sicurezza a livello di riga (RLS), permette di selezionare lo spazio di lavoro, limita la frequenza delle richieste e consente di verificare le operazioni.",
        },
        {
          title: "Server MCP gestito",
          description:
            "I client che supportano MCP remoto e OAuth possono collegarsi a https://mcp.expense-budget-tracker.com/mcp e consultare i tuoi dati finanziari con l’autorizzazione obbligatoria expenses:read. Un client può richiedere anche expenses:write, un’autorizzazione facoltativa che compare nella schermata di consenso OAuth ed è necessaria per creare, modificare o eliminare dati.",
        },
        {
          title: "Chat con l’IA",
          description:
            "Fai domande sulle spese, confronta periodi o analizza le tue finanze nella chat integrata. Le risposte si basano sulle tue registrazioni.",
        },
        {
          title: "Spazi di lavoro isolati",
          description:
            "La sicurezza a livello di riga di Postgres isola i dati. Ogni utente ha uno spazio di lavoro. Invita altre persone negli spazi condivisi con un controllo completo degli accessi.",
        },
        {
          title: "Self-hosting",
          description:
            "Usa Docker Compose con Postgres in locale o sul tuo server. Mantieni il pieno controllo dei dati finanziari e puoi gestirli senza dipendere da un fornitore.",
        },
        {
          title: "Accesso senza password",
          description:
            "Accedi con un codice di verifica monouso che AWS Cognito invia via email. Chiunque può registrarsi e ricevere automaticamente uno spazio di lavoro. L’accesso senza password elimina il rischio di esporre una password.",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "it" };
