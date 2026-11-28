---
title: Polityka prywatności
description: Polityka prywatności Expense Budget Tracker.
slug: privacy
sections:
  - type: legal_page
    lastUpdated: sierpień 2026
---
## Jakie dane zbieramy

Gdy korzystasz z wersji w chmurze, przechowujemy wprowadzone przez Ciebie dane finansowe (transakcje, budżety i nazwy kont) oraz adres e-mail potrzebny do logowania. Instancje uruchomione na własnym serwerze nie przesyłają nam żadnych danych.

## Operator

Operatorem usługi Expense Budget Tracker w chmurze jest SAMO DANNI EOOD (VAT: BG207395566). Expense Budget Tracker stworzył Kirill Markin. [kirill-markin.com](https://kirill-markin.com/) to jego osobista strona związana z projektem Expense Budget Tracker i powiązanymi narzędziami.

Ta polityka dotyczy obsługiwanej przez nas witryny, aplikacji w chmurze, API i zdalnej usługi MCP. Instancje uruchomione samodzielnie pozostają pod kontrolą swoich operatorów.

## Jak korzystamy z Twoich danych

Danych finansowych używamy wyłącznie do świadczenia usługi. Nie sprzedajemy ich ani nie używamy w celach reklamowych. Udostępniamy je aplikacji klienckiej innego dostawcy wyłącznie na Twoje polecenie, na przykład gdy zezwalasz na połączenie przez MCP. Każdy obszar roboczy jest izolowany dzięki zabezpieczeniom na poziomie wierszy w Postgres.

## MCP i klienci AI innych dostawców

Gdy połączysz klienta AI z hostowaną usługą MCP, Expense Budget Tracker przetwarza żądanie autoryzacji OAuth, wybrane narzędzie i jego argumenty, wybrany obszar roboczy oraz dane finansowe niezbędne do obsługi odczytu lub wprowadzenia zatwierdzonej zmiany. Zmiany z MCP trafiają do tego samego zbioru danych finansowych w chmurze co zmiany wprowadzone w aplikacji.

Usługa przechowuje nazwę i adresy przekierowań zarejestrowanego klienta, metadane połączenia i zakresów uprawnień, znaczniki czasu utworzenia, aktywności i cofnięcia dostępu oraz jednokierunkowe skróty kodów autoryzacji OAuth, tokenów dostępu i tokenów odświeżania. Nie przechowuje tokenów OAuth w oryginalnej postaci. Usługa MCP odbiera poszczególne wywołania narzędzi i zwraca żądane wyniki. Rozmowy prowadzone w kliencie AI nie są zapisywane jako rozmowy w Expense Budget Tracker.

Za klienta AI odpowiada niezależny dostawca, który może przetwarzać lub przechowywać polecenia, argumenty narzędzi i zwrócone dane finansowe zgodnie z własnym regulaminem i polityką prywatności. Przed połączeniem sprawdź politykę prywatności dostawcy. Połączenie MCP możesz unieważnić w dowolnym momencie w sekcji **Ustawienia > Dostęp dla agentów i programów**. Konto i powiązane dane w chmurze możesz usunąć w ustawieniach zgodnie z opisem poniżej.

## Przechowywanie danych

Dane w chmurze przechowujemy w AWS RDS (Postgres) w regionie eu-central-1. Codziennie powstają automatyczne kopie zapasowe. Dane są szyfrowane podczas przechowywania i przesyłania.

## Pliki cookie

Do uwierzytelniania używamy pliku cookie `session` (HttpOnly, Secure, SameSite=Lax). Nie używamy śledzących plików cookie ani narzędzi analitycznych innych dostawców.

## Usuwanie danych

W ustawieniach aplikacji możesz w dowolnym momencie usunąć konto i wszystkie powiązane dane. W przypadku własnego hostingu bezpośrednio zarządzasz bazą danych.

## Otwarty kod źródłowy

Cały kod źródłowy jest otwarty. Możesz dokładnie sprawdzić, co aplikacja robi z Twoimi danymi.
