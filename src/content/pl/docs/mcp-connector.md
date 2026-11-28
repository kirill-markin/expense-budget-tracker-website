---
title: Konektor MCP
description: Połącz klienta MCP z Expense Budget Tracker przez OAuth, aby bezpiecznie odczytywać lub aktualizować dane finansowe.
---

## Przegląd

Konektor Model Context Protocol (MCP) dla Expense Budget Tracker jest dostępny w chmurze pod poniższym adresem.

`https://mcp.expense-budget-tracker.com/mcp`

Konektor korzysta z transportu Streamable HTTP i autoryzacji OAuth. Podaj ten adres klientowi MCP, który obsługuje zdalne serwery Streamable HTTP i automatyczne wykrywanie konfiguracji OAuth. Klient otworzy przeglądarkę, w której zalogujesz się i zatwierdzisz dostęp.

Dane uwierzytelniające MCP to tokeny dostępu i odświeżania OAuth. Klucz `ApiKey` o długim okresie ważności opisany w [dokumentacji API dla agentów](/pl/docs/api/) służy do osobnej integracji przez bezpośrednie żądania HTTP. Punkt końcowy MCP go nie przyjmuje.

## Wykrywanie konfiguracji OAuth i połączenie

Hostowany konektor udostępnia metadane chronionego zasobu pod adresem:

`https://mcp.expense-budget-tracker.com/.well-known/oauth-protected-resource/mcp`

Te metadane wskazują klientowi serwer autoryzacji. Metadane tego serwera znajdziesz pod adresem:

`https://auth.expense-budget-tracker.com/.well-known/oauth-authorization-server`

Zgodny klient wykonuje następujące kroki:

1. Łączy się z `https://mcp.expense-budget-tracker.com/mcp` i odczytuje metadane chronionego zasobu.
2. Rejestruje się dynamicznie jako publiczny klient OAuth. Ten typ klienta nie używa sekretu.
3. Rozpoczyna autoryzację w trybie Authorization Code i otwiera adres autoryzacji w przeglądarce użytkownika.
4. Używa PKCE dla każdego żądania autoryzacji. Obsługiwana jest tylko metoda `S256` do obliczania wartości code challenge.
5. Prosi o `expenses:read`. Dodaje `expenses:write` tylko wtedy, gdy musi wywołać `sql_execute`.
6. Wymienia kod autoryzacji na tokeny dostępu i odświeżania, a później odnawia dostęp w razie potrzeby.

Nie kopiuj tokenów do poleceń, historii czatu, plików źródłowych ani dzienników. Przechowuj je tylko w miejscu, którego klient MCP używa do zapisu danych uwierzytelniających.

## Zakresy uprawnień

- Zakres `expenses:read` jest wymagany. Pozwala pobierać listę obszarów roboczych, sprawdzać schemat i wykonywać zapytania tylko do odczytu.
- Opcjonalny zakres `expenses:write` daje osobne uprawnienie do wywołania `sql_execute`, które może dodawać, zmieniać i usuwać dane.

Proś tylko o uprawnienia potrzebne do wykonania zadania. Klient, który tylko analizuje dane lub tworzy raporty, powinien prosić o `expenses:read` bez `expenses:write`.

## Narzędzia

### `list_workspaces`

Zwraca listę obszarów roboczych dostępnych dla zalogowanego użytkownika. Przed odczytem lub zmianą danych wskaż konkretny obszar za pomocą zwróconego identyfikatora.

### `get_schema`

Zwraca relacje i kolumny udostępniane przez MCP dla wybranego obszaru roboczego. Wywołaj to narzędzie przed napisaniem SQL, aby poznać nazwy tabel i kolumn.

### `sql_query`

Wykonuje jedno zapytanie SQL w wybranym obszarze roboczym. Narzędzie przyjmuje ograniczony zestaw instrukcji, a baza danych wymusza dla tego zapytania tryb tylko do odczytu. Wynik ma najwyżej 100 wierszy, a wykonanie może trwać maksymalnie 20 sekund.

### `sql_execute`

Wykonuje dozwolone instrukcje SQL zmieniające dane w wybranym obszarze roboczym. Narzędzie może też usuwać dane i wymaga osobnego zakresu `expenses:write`. Przed zatwierdzeniem wywołania upewnij się, że wybrano właściwy obszar roboczy, i sprawdź treść instrukcji SQL.

Tryb tylko do odczytu baza danych wymusza w przypadku `sql_query`. Serwer MCP umożliwia zmianę danych przez `sql_execute`.

## Bezpieczne korzystanie

1. Wywołaj `list_workspaces` i potwierdź z użytkownikiem, którego obszaru roboczego dotyczy zadanie.
2. Wywołaj `get_schema` przed wygenerowaniem SQL.
3. Używaj `sql_query` do sprawdzania danych, sumowania, uzgadniania sald i tworzenia raportów.
4. Proś o `expenses:write` tylko wtedy, gdy zadanie wymaga zmiany danych.
5. Przed `sql_execute` pokaż dokładną instrukcję i jej oczekiwany skutek, a następnie ponownie potwierdź obszar roboczy.
6. Po zapisie sprawdź wynik za pomocą `sql_query`.

Serwer ogranicza dozwolone instrukcje SQL i dostępne relacje. Są to dodatkowe zabezpieczenia. Nadal trzeba starannie sprawdzać wygenerowany SQL.

## Limity

- maksymalnie 100 wierszy w wynikach SQL
- maksymalnie 20 sekund na wykonanie
- dostęp ograniczony do obszarów roboczych zalogowanego użytkownika
- `sql_query` korzysta z ograniczonego zestawu instrukcji SQL, a baza danych wymusza tryb tylko do odczytu
- `sql_execute` wymaga `expenses:write` oprócz obowiązkowego zakresu odczytu

## Prywatność i własny hosting

Autoryzowany klient MCP może odczytywać dane finansowe, a z `expenses:write` także je zmieniać. Przed połączeniem przeczytaj [Politykę prywatności](/pl/privacy/) oraz zasady przetwarzania danych przez dostawcę klienta MCP.

Powyższe adresy dotyczą wyłącznie usługi Expense Budget Tracker w chmurze, którą utrzymujemy. Jeśli wdrażasz aplikację samodzielnie, skorzystaj z [instrukcji uruchomienia na własnym serwerze](/pl/docs/self-hosting/) i skonfiguruj punkt końcowy MCP i metadane OAuth dla swoich domen. Implementacja jest dostępna w [repozytorium kodu źródłowego](https://github.com/kirill-markin/expense-budget-tracker).
