import type { PageContent } from "@/lib/content/types";

export const FEATURES_PAGE_CONTENT_DE = {
  locale: "de",
  title: "Funktionen",
  description:
    "Konten in mehreren Währungen, Budgetplanung, Dashboards, gehosteter MCP-Zugang, Agent-API, Selbsthosting und getrennte Arbeitsbereiche.",
  slug: "features",
  sections: [
    {
      type: "feature_list",
      title: "Funktionen",
      intro:
        "Alles, was du für deine privaten Finanzen brauchst. Die Kontrolle über deine Daten bleibt bei dir.",
      items: [
        {
          title: "Konten in mehreren Währungen",
          description:
            "Speichere jede Transaktion in ihrer ursprünglichen Währung. Erst beim Abruf rechnet die App die Beträge anhand der täglichen Wechselkurse von EZB, CBR und NBS in deine Berichtswährung um. Die Originalbeträge bleiben erhalten.",
        },
        {
          title: "Budgettabelle",
          description:
            "Plane monatliche Einnahmen und Ausgaben nach Kategorien. Lege Planbeträge fest, vergleiche sie mit den Istbeträgen und behalte die Abweichung im Blick. Das Änderungsprotokoll hält jede Änderung fest. Bestehende Einträge bleiben unverändert.",
        },
        {
          title: "Kontostände im Blick",
          description:
            "Die App berechnet den laufenden Kontostand jedes Kontos automatisch aus seinen Buchungen. Zeige Summen in beliebigen Währungen an. Umbuchungen zwischen deinen eigenen Konten werden als eigener Transaktionstyp erfasst.",
        },
        {
          title: "Dashboards",
          description:
            "Sieh, wie sich deine Ausgaben verteilen, wie sich deine Kontostände entwickeln und wie Wechselkurse deine Finanzen beeinflussen. Die Auswertungen sind direkt in der App verfügbar und brauchen kein separates BI-Tool.",
        },
        {
          title: "Agent-API",
          description:
            "Für CLI-Agenten und direkten HTTP-Zugriff gibt es einen eigenen Einstieg. Rufe zuerst GET https://api.expense-budget-tracker.com/v1/ auf und führe dann über die Agent-API mit einem ApiKey eingeschränktes SQL aus. Auch hier gelten der vollständige Zugriffsschutz auf Zeilenebene und Anfragelimits. Du kannst den Arbeitsbereich auswählen und die Vorgänge nachvollziehen.",
        },
        {
          title: "Gehosteter MCP-Server",
          description:
            "OAuth-fähige MCP-Clients können sich über https://mcp.expense-budget-tracker.com/mcp verbinden und deine Finanzdaten mit der erforderlichen Berechtigung expenses:read abfragen. Ein Client kann zusätzlich expenses:write anfordern. Diese Berechtigung erscheint bei der OAuth-Freigabe und ist nötig, um Daten anzulegen, zu ändern oder zu löschen.",
        },
        {
          title: "KI-Chat",
          description:
            "Der integrierte Chat nutzt deine erfassten Buchungen. So kannst du nach Ausgaben fragen, Zeiträume vergleichen oder deine Finanzdaten auswerten lassen.",
        },
        {
          title: "Getrennte Arbeitsbereiche",
          description:
            "Postgres Row-Level Security trennt die Daten. Jeder Nutzer erhält einen eigenen Arbeitsbereich. Lade andere zu gemeinsamen Arbeitsbereichen ein und behalte die Kontrolle über die Zugriffsrechte.",
        },
        {
          title: "Selbst hosten",
          description:
            "Docker Compose mit Postgres läuft lokal oder auf deinem eigenen Server. Du bleibst unabhängig vom Anbieter und behältst die volle Kontrolle über deine Finanzdaten.",
        },
        {
          title: "Passwortlose Anmeldung",
          description:
            "AWS Cognito verschickt Einmalcodes per E-Mail. Es gibt kein Passwort, das du dir merken musst oder das offengelegt werden könnte. Jeder kann sich registrieren und erhält dabei automatisch einen Arbeitsbereich.",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "de" };
