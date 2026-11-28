---
title: Pomoc
description: Jak uzyskać pomoc i zgłosić problem z bezpieczeństwem w Expense Budget Tracker, także w usłudze MCP w chmurze.
slug: support
sections:
  - type: simple_markdown_page
---

## Pomoc dotycząca aplikacji w chmurze i MCP

Jeśli potrzebujesz pomocy z aplikacją w chmurze, kontem, autoryzacją OAuth lub publicznym serwerem MCP, napisz na [markinkirill@gmail.com](mailto:markinkirill@gmail.com). Udzielamy pomocy w miarę możliwości i nie gwarantujemy czasu odpowiedzi.

Do zgłoszenia dołącz tylko informacje potrzebne do zbadania problemu.

- nazwę i wersję klienta
- datę, godzinę i strefę czasową wystąpienia błędu
- punkt końcowy lub stronę, której dotyczy problem
- etap OAuth lub nazwę narzędzia MCP
- dokładny komunikat błędu po usunięciu poufnych danych oraz identyfikator żądania, jeśli został wyświetlony
- opis tego, czego oczekujesz i co faktycznie się wydarzyło

Nie wysyłaj haseł, plików cookie sesji, kodów OAuth, tokenów dostępu ani odświeżania, kluczy API, surowych danych finansowych ani treści żądania bez usunięcia z niej poufnych danych.

## Zgłoszenia dotyczące bezpieczeństwa

Jeśli podejrzewasz lukę w zabezpieczeniach, zgłoś ją prywatnie pod adresem [markinkirill@gmail.com](mailto:markinkirill@gmail.com). W temacie wpisz **Expense Budget Tracker security report** i podaj tylko kroki potrzebne do odtworzenia problemu. Z opisu usuń poufne informacje. Nie dołączaj aktywnych danych uwierzytelniających ani danych finansowych. Nie opisuj podejrzewanej luki w publicznym zgłoszeniu na GitHubie. Jeśli ktoś mógł uzyskać nieautoryzowany dostęp, najpierw unieważnij połączenie w sekcji **Ustawienia > Dostęp dla agentów i programów** i wymień pozostałe dane uwierzytelniające objęte problemem.

## Błędy, własny hosting i pytania do społeczności

W [systemie zgłoszeń na GitHubie](https://github.com/kirill-markin/expense-budget-tracker/issues) możesz zgłaszać błędy, które da się odtworzyć, zadawać pytania o własny hosting i prowadzić publiczne dyskusje ze społecznością. Najpierw przejrzyj istniejące zgłoszenia i usuń prywatne dane z dzienników i zrzutów ekranu. Informacje o wdrażaniu i rozwijaniu aplikacji znajdziesz w [instrukcji uruchomienia na własnym serwerze](/pl/docs/self-hosting/) i [repozytorium kodu źródłowego](https://github.com/kirill-markin/expense-budget-tracker).

## Przed zgłoszeniem problemu z MCP

Sprawdź, czy Twój klient obsługuje zdalne MCP przez Streamable HTTP, tryb Authorization Code z PKCE w OAuth 2.1 oraz dynamiczną rejestrację klientów. Użyj uniwersalnego adresu dokładnie w postaci podanej w [instrukcji MCP](/pl/docs/mcp-connector/), połącz się ponownie i spróbuj jeszcze raz. Jeśli problem się powtarza, wyślij wymienione wyżej informacje po usunięciu z nich poufnych danych.
