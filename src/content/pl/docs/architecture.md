---
title: Architektura
description: Przegląd systemu, model danych, obsługa wielu walut i model uwierzytelniania.
---

## Przegląd systemu

```
Browser UI      --> Next.js web app --------------------> Postgres (RLS)
Machine clients --> API Gateway (REST) --> SQL Lambda ------^
MCP clients     --> API Gateway (HTTP) --> MCP Lambda ------^
Auth service (OTP + OAuth) --------------------------------^
Worker (FX fetchers) ---------------------------------------^
```

System składa się z sześciu komponentów, w tym jednej bazy danych.

1. **web** — aplikacja Next.js z panelami i trasami API
2. **auth** — logowanie jednorazowym kodem weryfikacyjnym z e-maila i inicjowanie połączeń agentów w domenie uwierzytelniania
3. **sql-api** — funkcja AWS Lambda za API Gateway obsługująca żądania programowe
4. **mcp** — osobna funkcja AWS Lambda i API typu HTTP w API Gateway dla hostowanego punktu końcowego MCP
5. **worker** — pobiera dzienne kursy walut z EBC, CBR i NBS
6. **Postgres** — podstawowe źródło danych aplikacji z zabezpieczeniami na poziomie wierszy

## Model danych

- **ledger_entries** — jeden zapis w rejestrze transakcji na operację na koncie (wpływ, wydatek, przelew)
- **budget_lines** — komórki budżetu, w których każda zmiana dodaje nowy zapis, a obowiązuje najnowsza wartość
- **budget_comments** — notatki przypisane do komórek budżetu, które można tylko dopisywać
- **workspace_settings** — waluta raportowania i ustawienia obszaru roboczego
- **account_metadata** — metadane konta, np. klasyfikacja według płynności
- **exchange_rates** — dzienne kursy walut używane do przeliczeń w chwili odczytu
- **workspaces** / **workspace_members** — izolacja danych poszczególnych obszarów roboczych
- **accounts** — widok wyliczany z zapisów w rejestrze transakcji

## Wiele walut

Wszystkie kwoty są zapisywane w walutach źródłowych. Przeliczenie na walutę raportowania odbywa się przy odczycie przez złączenia SQL z tabelą `exchange_rates`. Dzięki temu rejestr zachowuje pełną dokładność oryginalnych kwot.

## Uwierzytelnianie

Zmienna środowiskowa `AUTH_MODE` pozwala wybrać jeden z dwóch trybów:

- `none` — jeden lokalny obszar roboczy bez uwierzytelniania
- `cognito` — logowanie bez hasła jednorazowym kodem weryfikacyjnym wysyłanym e-mailem przez AWS Cognito, z otwartą rejestracją

Klienci wysyłający żądania programowo zaczynają od publicznego punktu końcowego z opisem API `GET /v1/`. Agent uwierzytelnia się w domenie logowania jednorazowym kodem weryfikacyjnym z e-maila i otrzymuje klucz ApiKey o długim okresie ważności. Następnie wykonuje operacje SQL przez API dla agentów udostępniane przez API Gateway.

Klienci obsługujący MCP łączą się osobno przez `https://mcp.expense-budget-tracker.com/mcp`. Połączenia obsługuje osobne API typu HTTP w API Gateway i funkcja MCP Lambda. Użytkownik przyznaje dostęp przez OAuth w przeglądarce w domenie uwierzytelniania.

Każdy użytkownik otrzymuje odizolowany obszar roboczy. Reguły RLS sprawdzają członkostwo przy każdym zapytaniu, także przy żądaniach SQL wysyłanych przez API.
