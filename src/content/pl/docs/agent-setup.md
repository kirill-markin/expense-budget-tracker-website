---
title: Konfiguracja agenta AI
description: Podaj Claude Code, Codex lub OpenClaw adres dokumentu z opisem API. Agent wykona kroki wskazane przez serwer, sprawdzi 8-cyfrowy kod weryfikacyjny, zapisze klucz ApiKey o długim okresie ważności i zacznie pracę w Twoim obszarze roboczym.
---

## Link, który podajesz agentowi

Podaj agentowi dokładnie ten adres.

`https://api.expense-budget-tracker.com/v1/`

Pod tym adresem znajduje się oficjalny publiczny dokument z opisem API dla agentów AI. Wskazuje, jak rozpocząć uwierzytelnianie, jakie punkty końcowe wywołać w kolejnych krokach, której metody uwierzytelniania używać po połączeniu oraz gdzie znaleźć aktualny schemat i otwarty kod źródłowy.

Ten poradnik pokazuje, jak połączyć agenta w terminalu lub klienta HTTP bezpośrednio z API dla agentów. Jeśli Twój klient obsługuje MCP, użyj [konektora MCP](/pl/docs/mcp-connector/) w chmurze. Klient łączy się z `https://mcp.expense-budget-tracker.com/mcp` i umożliwia przyznanie dostępu za pomocą OAuth w przeglądarce. Nie wymaga opisanej tu konfiguracji klucza ApiKey.

## Co robi użytkownik

1. Otwórz Claude Code, Codex, OpenClaw lub innego agenta, który może wysyłać żądania HTTP.
2. Poproś agenta o połączenie z Expense Budget Tracker za pomocą `https://api.expense-budget-tracker.com/v1/`.
3. Gdy agent poprosi o adres e-mail, podaj adres używany w Expense Budget Tracker.
4. Odszukaj w skrzynce odbiorczej 8-cyfrowy kod weryfikacyjny.
5. Przekaż kod agentowi.
6. Pozwól agentowi zapisać otrzymany klucz ApiKey poza pamięcią czatu. Potem możesz przejść do importu, wysłać zapytanie lub zająć się budżetem.

Nie musisz kopiować klucza podczas logowania. Po zweryfikowaniu kodu z e-maila agent sam konfiguruje połączenie.

## Co robi agent

1. `GET https://api.expense-budget-tracker.com/v1/`
2. Odczytaj odpowiedź serwera i wykonaj wskazane w niej działania. Nie zapisuj kolejnych kroków na stałe w kodzie.
3. Wyślij adres e-mail użytkownika metodą `POST` na zwrócony `bootstrapUrl`
4. Odbierz `otpSessionToken` i działanie `verify_code`
5. Poproś użytkownika o 8-cyfrowy kod weryfikacyjny z e-maila
6. Wyślij `code`, `otpSessionToken` i etykietę połączenia `label` metodą `POST` pod adres `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. Odbierz nowy klucz `ApiKey`
8. Zapisz klucz poza pamięcią czatu, najlepiej jako `EXPENSE_BUDGET_TRACKER_API_KEY`
9. `GET https://api.expense-budget-tracker.com/v1/me` z nagłówkiem `Authorization: ApiKey <key>`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. W razie potrzeby utwórz obszar roboczy przez `POST /v1/workspaces`
12. Zapisz domyślny obszar roboczy przez `POST /v1/workspaces/{workspaceId}/select`
13. Sprawdź dostępne relacje przez `GET https://api.expense-budget-tracker.com/v1/schema`
14. Odczytuj dane przez `POST https://api.expense-budget-tracker.com/v1/sql/query` i przesyłaj zatwierdzone zmiany przez `POST https://api.expense-budget-tracker.com/v1/sql/execute`

Obszar roboczy wskazujesz jawnie przez `POST /v1/workspaces/{workspaceId}/select`. Serwer zapamiętuje wybór dla danego klucza API. W kolejnych wywołaniach `/v1/sql/query` i `/v1/sql/execute` możesz pominąć `X-Workspace-Id`. Nadal możesz przesłać `X-Workspace-Id`, aby dla danego żądania wskazać inny obszar. Punkt końcowy `POST /v1/sql` utrzymujemy ze względu na zgodność i jest on przeznaczony wyłącznie do atomowego wykonywania skryptów z wieloma instrukcjami. Do zwykłych odczytów i zapisów służą osobne punkty końcowe.

Jeśli użytkownik ma dokładnie jeden obszar roboczy, a klucz nie ma zapisanego wyboru, serwer automatycznie ustawia ten obszar jako domyślny i go używa.

## Co agent powinien zapisać

Klucz zwrócony przez `verify-code` ma długi okres ważności. Zapisz go poza pamięcią czatu.

- Jeśli użytkownik zgadza się na zapis pliku, zapisz klucz w lokalnym pliku `.env` jako `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'`
- W przeciwnym razie wyeksportuj go w bieżącej powłoce jako `EXPENSE_BUDGET_TRACKER_API_KEY='<PASTE_KEY_HERE>'` i poproś użytkownika o zapisanie go w trwałym miejscu

Uwierzytelnione żądania używają:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` tylko wtedy, gdy chcesz zastąpić zapisany wybór lub gdy żaden obszar nie został jeszcze zapisany

## Jeśli jesteś agentem AI

Zacznij od:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

Następnie wykonaj działania zwrócone przez serwer. Jeśli dokument z opisem API podaje kolejne kroki, użyj instrukcji z odpowiedzi serwera.

Po `verify-code` bezpiecznie zapisz otrzymany `ApiKey`. Następnie odczytaj:

- `/v1/me`, aby uzyskać informacje o koncie użytkownika
- `/v1/workspaces`, aby poznać dostępne obszary robocze
- `/v1/schema`, aby sprawdzić dozwolone relacje i kolumny SQL
- `/v1/openapi.json` lub `/v1/swagger.json` tylko wtedy, gdy klient sprawdza standardowe adresy specyfikacji. Pod tymi adresami znajdziesz odsyłacze do dokumentu z opisem API i kodu źródłowego. Punkty te nie udostępniają specyfikacji API.

## Przykładowe polecenia dla użytkowników

### Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Use my account email when needed, ask me for the 8-digit code, save the returned ApiKey outside chat memory, then import my latest bank statement from ~/Downloads.
```

### Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
Ask for my email, wait for the email code, save the key, inspect /schema, and then show my latest transactions.
```

### OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, list my workspaces, save one as the default for this key, and import the new CSV I uploaded.
```

## Co możesz zrobić po konfiguracji

- Importować wyciągi bankowe lub pliki z historią transakcji kartą
- Przypisywać transakcje do istniejących kategorii
- Uzgadniać salda kont z danymi banku
- Sprawdzać wydatki według kategorii, okresu, sprzedawcy lub konta
- Aktualizować pozycje budżetu na kolejny miesiąc

Szczegóły punktów końcowych i uwierzytelniania znajdziesz w [dokumentacji API](/pl/docs/api/).
