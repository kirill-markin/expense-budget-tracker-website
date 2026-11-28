---
title: Dokumentacja API
description: Konfiguracja połączenia dla agentów i dokumentacja API SQL do programowego dostępu do danych finansowych.
---

## Przegląd

Expense Budget Tracker udostępnia jeden publiczny interfejs programowy pod adresem:

`https://api.expense-budget-tracker.com/v1/`

Z tego samego interfejsu możesz korzystać na dwa sposoby:

1. **Konfiguracja przez agenta**, od `GET /v1/`
2. **Bezpośrednie żądania HTTP** z już posiadanym kluczem ApiKey o długim okresie ważności

Wszystkie żądania podlegają tym samym regułom zabezpieczeń na poziomie wierszy w Postgres (RLS) co aplikacja webowa.

Jeśli Twój klient obsługuje MCP, użyj hostowanego [konektora MCP](/pl/docs/mcp-connector/) pod adresem `https://mcp.expense-budget-tracker.com/mcp` i przyznaj mu dostęp przez OAuth w przeglądarce. Ta strona opisuje odrębną integrację przez API dla agentów. Do bezpośrednich żądań HTTP używasz klucza `ApiKey` o długim okresie ważności.

## Opis API, kod źródłowy i aktualny schemat

Zacznij od:

`https://api.expense-budget-tracker.com/v1/`

Odpowiedź serwera podpowiada agentowi, jak rozpocząć uwierzytelnianie i jakie żądania wysłać w kolejnych krokach. Zawiera też linki do pliku README i kodu źródłowego. API udostępnia:

- `GET /v1/schema`
- `GET /v1/openapi.json` oraz `GET /v1/swagger.json` na potrzeby klientów sprawdzających standardowe adresy specyfikacji. Te adresy informują, że specyfikacja OpenAPI jest niedostępna, i odsyłają do dokumentu z opisem API oraz kodu źródłowego.

Użyj `schema`, aby poznać dokładną listę dozwolonych relacji i kolumn udostępnianych przez `/v1/sql/query`, `/v1/sql/execute` i punkt zgodności `/v1/sql`.

## Konfiguracja przez agenta

Jeśli chcesz, żeby Claude Code, Codex, OpenClaw lub inny agent sam nawiązał połączenie, zacznij od punktu końcowego z opisem API i wykonaj działania zwrócone przez serwer.

### Przebieg uwierzytelniania

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Odczytaj zwrócone działanie `send_code` i `bootstrapUrl`
3. Wyślij adres e-mail użytkownika metodą `POST` pod adres `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. Odbierz `otpSessionToken`
5. Poproś użytkownika o 8-cyfrowy kod weryfikacyjny z e-maila
6. Wyślij `code`, `otpSessionToken` i `label` metodą `POST` pod adres `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Odbierz klucz `ApiKey` o długim okresie ważności
8. Zapisz klucz poza pamięcią czatu
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. Opcjonalnie użyj `POST https://api.expense-budget-tracker.com/v1/workspaces`, aby utworzyć obszar roboczy
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. Odczytuj dane przez `POST https://api.expense-budget-tracker.com/v1/sql/query` i przesyłaj zatwierdzone zmiany przez `POST https://api.expense-budget-tracker.com/v1/sql/execute`

### Nagłówek uwierzytelniania

- `Authorization: ApiKey <key>`

### Wybór obszaru roboczego

- `POST /v1/workspaces/{workspaceId}/select` zapisuje domyślny obszar roboczy dla danego klucza API
- po zapisaniu obszaru w wywołaniach `/v1/sql/query`, `/v1/sql/execute` i punktu zgodności `/v1/sql` można pominąć `X-Workspace-Id`
- nadal możesz użyć `X-Workspace-Id: <workspaceId>`, jeśli dla jednego żądania chcesz wskazać inny obszar
- jeśli użytkownik ma dokładnie jeden obszar roboczy, a klucz nie ma zapisanego wyboru, API automatycznie zapisze i wybierze ten obszar

Instrukcję krok po kroku znajdziesz w poradniku [Konfiguracja agenta AI](/pl/docs/agent-setup/).

## Bezpośrednie żądania HTTP z istniejącym kluczem

Skrypty, zadania cron, panele i własne aplikacje mogą wysyłać żądania bezpośrednio do tego samego API, jeśli mają klucz ApiKey o długim okresie ważności.

### Uwierzytelnianie

Przekaż klucz w nagłówku uwierzytelniania ApiKey:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql/query \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id` jest wymagany tylko wtedy, gdy dla klucza nie zapisano jeszcze domyślnego obszaru roboczego lub gdy dla tego żądania chcesz wskazać inny obszar.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` w razie potrzeby

## Punkty końcowe w skrócie

- `GET /v1/` — publiczny dokument z opisem API
- `GET /v1/openapi.json` i `GET /v1/swagger.json` — adresy udostępnione dla zgodności, które odsyłają do dokumentu opisującego API oraz do kodu źródłowego zamiast udostępniać specyfikację API
- `GET /v1/me` — informacje o uwierzytelnionym koncie
- `GET /v1/workspaces` — lista obszarów roboczych dostępnych dla właściciela klucza
- `POST /v1/workspaces` — utworzenie obszaru roboczego
- `POST /v1/workspaces/{workspaceId}/select` — zapis domyślnego obszaru roboczego dla tego klucza
- `GET /v1/schema` — sprawdzenie dozwolonych relacji i kolumn SQL
- `POST /v1/sql/query` — wykonanie jednej instrukcji tylko do odczytu `SELECT` lub `WITH ... SELECT`
- `POST /v1/sql/execute` — wykonanie jednej zatwierdzonej instrukcji `INSERT`, `UPDATE` lub `DELETE`
- `POST /v1/sql` — punkt zgodności dla atomowych skryptów zawierających wiele instrukcji

## Zasady SQL

Główne punkty końcowe celowo rozdzielają odczyt i zapis:

- `POST /v1/sql/query` przyjmuje dokładnie jedną instrukcję tylko do odczytu `SELECT` lub `WITH ... SELECT`
- `POST /v1/sql/execute` przyjmuje dokładnie jedną instrukcję zmieniającą dane: `INSERT`, `UPDATE` lub `DELETE`, także w obsługiwanych formach z `WITH`
- punkt zgodności `POST /v1/sql` przyjmuje skrypty z wieloma instrukcjami podlegające ograniczeniom i wykonuje je atomowo. Używaj go tylko wtedy, gdy potrzebujesz atomowego wykonania skryptu

Blokowane lub odrzucane są:

- wiele instrukcji w głównych punktach końcowych `/v1/sql/query` i `/v1/sql/execute`
- instrukcje DDL, np. `CREATE`, `DROP` i `ALTER`
- instrukcje sterowania transakcją, np. `BEGIN`, `COMMIT` i `ROLLBACK`
- `set_config()`
- komentarze SQL
- identyfikatory ujęte w cudzysłowy
- ciągi znaków ograniczone znacznikami z symbolem dolara (dollar quoting)

Serwer ogranicza też wybór relacji dostępnych w zapytaniach. Przed wygenerowaniem SQL sprawdź w `/v1/schema`, które relacje i kolumny są dostępne.

Obecnie udostępniane relacje:

- `ledger_entries`
- `budget_lines`
- `workspace_settings`
- `account_metadata`
- `accounts` (tylko do odczytu)
- `fx_rates_raw` (tylko do odczytu)
- `fx_rates_daily` (tylko do odczytu)

## Limity

- do 100 zwróconych wierszy na żądanie
- do 100 zmienionych wierszy na instrukcję modyfikującą i żądanie
- maksymalnie 25 sekund na całe żądanie SQL
- na klucz: 10 żądań na sekundę i 10 000 żądań na dobę

## Bezpieczeństwo

- Klucze API są przechowywane jako skróty SHA-256. Klucz w postaci jawnej nie jest trwale zapisywany.
- Zasady RLS zapewniają izolację obszarów roboczych w bazie danych.
- Klucze można w dowolnej chwili unieważnić w aplikacji.
- Usunięcie użytkownika z obszaru roboczego automatycznie unieważnia wszystkie jego klucze.
