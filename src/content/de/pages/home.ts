import type { PageContent } from "@/lib/content/types";

export const HOME_PAGE_CONTENT_DE = {
  locale: "de",
  title: "Expense Budget Tracker – Open Source für deine Finanzen",
  description:
    "Open-Source-App für Ausgaben und Budgets mit mehreren Währungen, Finanz-Dashboards, einem gehosteten MCP-Server und einer Agent-API.",
  slug: "home",
  sections: [
    {
      type: "hero",
      titleLines: [
        "Erfasse deine Ausgaben.",
        "Plane dein Budget.",
        "Deine Daten gehören dir.",
      ],
      subtitle:
        "Verwalte deine Finanzen mit einer Open-Source-App für mehrere Währungen, Budgetplanung und Finanz-Dashboards. Gib Claude Code, Codex oder OpenClaw zur Einrichtung den Link zum Discovery-Endpunkt der API und bestätige den Code aus deiner E-Mail. Den Rest übernimmt der Agent.",
      primaryLink: {
        label: "Jetzt starten",
        href: "https://app.expense-budget-tracker.com",
      },
      secondaryLink: {
        label: "Auf GitHub ansehen",
        href: "https://github.com/kirill-markin/expense-budget-tracker",
      },
      hintText: "Für die Verbindung zum gehosteten MCP-Server brauchst du einen MCP-Client mit OAuth-Unterstützung.",
      hintLink: {
        label: "https://mcp.expense-budget-tracker.com/mcp",
        href: "https://mcp.expense-budget-tracker.com/mcp",
      },
    },
    {
      type: "feature_list",
      title: "Funktionen",
      intro:
        "Alles, was du für deine privaten Finanzen brauchst. Die Kontrolle über deine Daten bleibt bei dir.",
      items: [
        {
          title: "Mehrere Währungen",
          description:
            "Führe Konten in beliebigen Währungen. Die App rechnet Beträge automatisch mit Wechselkursen von EZB, CBR und NBS um.",
        },
        {
          title: "Budgetplanung",
          description:
            "Plane deine Einnahmen und Ausgaben nach Kategorien in einer monatlichen Budgettabelle und vergleiche Plan- und Istbeträge.",
        },
        {
          title: "Dashboards",
          description:
            "Sieh auf einen Blick, wofür du Geld ausgibst, wie sich deine Kontostände entwickeln und wie sich Wechselkurse auf dein Portfolio auswirken.",
        },
        {
          title: "Selbst hosten",
          description:
            "Docker Compose mit Postgres. Deine Daten bleiben auf deinem Server. Du bist unabhängig von Drittanbietern.",
        },
        {
          title: "MCP und Agent-API",
          description:
            "Verbinde einen OAuth-fähigen MCP-Client mit dem gehosteten MCP-Server. Für den Lesezugriff auf Finanzdaten braucht er expenses:read. Der Client kann zusätzlich expenses:write anfordern. Diese Berechtigung erscheint bei der OAuth-Freigabe und ist nötig, um Daten anzulegen, zu ändern oder zu löschen. Für CLI-Agenten oder direkten HTTP-Zugriff rufst du zuerst GET https://api.expense-budget-tracker.com/v1/ auf und nutzt dann die Agent-API mit einem ApiKey.",
        },
        {
          title: "Getrennte Arbeitsbereiche",
          description:
            "Postgres sichert den Zugriff auf Zeilenebene ab. Jeder Nutzer erhält einen eigenen Arbeitsbereich und kann andere per Einladung daran beteiligen.",
        },
      ],
    },
  ],
  body: "",
} satisfies Omit<PageContent, "locale"> & { readonly locale: "de" };
