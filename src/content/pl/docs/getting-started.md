---
title: Pierwsze kroki
description: W kilka minut załóż konto w chmurze lub uruchom aplikację na własnym serwerze.
---

## Wersja w chmurze

Najszybciej zaczniesz od wersji w chmurze, którą utrzymujemy za Ciebie.

1. Wejdź na [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com).
2. Zarejestruj się za pomocą adresu e-mail. Do zalogowania wystarczy jednorazowy kod weryfikacyjny.
3. Zacznij śledzić wydatki w aplikacji w przeglądarce.
4. Jeśli Twój klient obsługuje MCP, dodaj `https://mcp.expense-budget-tracker.com/mcp` i przyznaj dostęp w przeglądarce.
5. Jeśli używasz agenta w terminalu lub klienta HTTP, zacznij od `GET https://api.expense-budget-tracker.com/v1/`.

Nie musisz niczego instalować ani konfigurować własnego serwera. Postgres izoluje dane poszczególnych obszarów roboczych na poziomie wierszy.

## Dostęp dla agentów i programów

Z tego samego konta w chmurze skorzystasz na trzy sposoby.

- Otwórz aplikację w przeglądarce pod adresem `https://app.expense-budget-tracker.com`.
- Połącz się z [konektorem MCP](/pl/docs/mcp-connector/) w chmurze pod adresem `https://mcp.expense-budget-tracker.com/mcp` i przyznaj dostęp przez OAuth w przeglądarce.
- Skorzystaj z [API dla agentów](/pl/docs/agent-setup/). Zacznij od `GET https://api.expense-budget-tracker.com/v1/`, a następnie wysyłaj bezpośrednie żądania HTTP z nagłówkiem `Authorization: ApiKey <key>`.

## Własny hosting

Jeśli wolisz uruchomić aplikację samodzielnie, skorzystaj z [instrukcji uruchomienia na własnym serwerze](/pl/docs/self-hosting/).

## Tryb demonstracyjny

Aplikacja ma wbudowany tryb demo. W nagłówku przełącz się z trybu „Wszystko” na „Demo”, żeby obejrzeć aplikację z przykładowymi danymi. Baza danych nie jest potrzebna.
