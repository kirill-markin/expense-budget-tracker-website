---
title: "Jak śledzić wydatki z Claude Code: połączenie, import i uzgadnianie sald"
description: "Połącz Claude Code z Expense Budget Tracker jednym linkiem. Sprawdź i zatwierdź import wyciągów, uzgodnij salda i zaktualizuj budżet bez łączenia z bankiem."
date: "2026-03-05"
updated: "2026-09-11"
image: "/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png"
keywords:
  - "śledzenie wydatków z Claude Code"
  - "kontrola wydatków z Claude"
  - "aplikacja do śledzenia wydatków z Claude"
  - "budżet z Claude Code"
  - "jak połączyć Claude z aplikacją do wydatków"
  - "import wyciągu bankowego z Claude Code"
---

Nawet przy czterech pozycjach na wyciągu saldo może zgadzać się co do centa (różnica `€0.00`), a budżet nadal zawierać błąd. Jeśli zakup w supermarkecie za €54.20 trafi do kategorii „Podróże” zamiast „Zakupy spożywcze”, saldo się nie zmieni, a kwoty w raporcie według kategorii będą się różnić o €54.20.

Przy śledzeniu wydatków za pomocą Claude Code sprawdź dwie rzeczy. Po pierwsze, operacje zapisane w rejestrze transakcji powinny dawać takie samo saldo końcowe jak wyciąg. Po drugie, przypisane kategorie powinny zgadzać się z tym, co ustalisz po przejrzeniu wyciągu. Claude Code może odczytać plik, wykonać obliczenia i wywołać API. Ty wybierasz konto i kategorie, przeglądasz proponowane zapisy i zatwierdzasz konkretne zmiany.

Przy tym sposobie pracy Expense Budget Tracker nie łączy się bezpośrednio z bankiem i nie przyjmuje plików z wyciągami. Wyeksportuj wyciąg samodzielnie, zapisz go w miejscu, do którego Claude Code ma dostęp, i prześlij wyłącznie zatwierdzone wpisy przez zarządzane API dla agentów. Jeśli przede wszystkim chcesz uniknąć stałego połączenia z bankiem, [poradnik o budżetowaniu bez łączenia z bankiem](/blog/budget-app-without-bank-linking/) (po angielsku) opisuje szerzej zalety i ograniczenia tego podejścia.

![Konserwator mozaiki wyjmuje źle ułożoną niebieską płytkę z pasa terakoty obok mosiężnej wagi w równowadze](/blog/how-to-track-expenses-and-manage-your-budget-with-claude-code-v2.png)

## Jak połączyć Claude Code jednym linkiem

Zainstaluj Claude Code i zaloguj się zgodnie z [oficjalną instrukcją Anthropic](https://code.claude.com/docs/en/quickstart) (po angielsku). [Dokumentacja CLI](https://code.claude.com/docs/en/cli-reference) (po angielsku) wyjaśnia, jak działają katalogi robocze i dostęp do dodatkowych plików.

Uruchom `claude` w katalogu zawierającym wyciąg lub przyznaj dostęp do tego katalogu metodą obsługiwaną w Twojej konfiguracji. Następnie wklej poniższe polecenie:

```text
Connect to Expense Budget Tracker from this discovery link:
https://app.expense-budget-tracker.com/api/agent

Fetch it with GET, read the returned JSON, and follow the current action URLs. Do not
guess or hardcode the API flow. Ask me for my Expense Budget Tracker email and start
the email OTP flow.
After that request succeeds, tell me to check spam or junk if the message is not
visible, ask me for the 8-digit code, and follow the returned verification action.

After verification, ask me to approve a persistent storage location for the returned
ApiKey outside chat memory and source control. Load my account context, list my
workspaces, ask me to confirm the target workspace, save it as the default for this
key, and inspect the live schema. Run one small read-only query to confirm the selected
workspace. Do not write financial data.
```

[Link dla agentów w domenie aplikacji](https://app.expense-budget-tracker.com/api/agent) zwraca aktualny dokument z opisem API. Obecnie podaje `https://api.expense-budget-tracker.com/v1/` jako adres bazowy API, a także adresy do uwierzytelniania i operacji SQL. Wklej link z domeny aplikacji. Claude Code powinien korzystać z adresów zwróconych przez usługę bez zapamiętywania wewnętrznej kolejności wywołań.

Rejestracja i logowanie korzystają z tej samej procedury opartej na e-mailu. Po podaniu 8-cyfrowego kodu weryfikacyjnego Claude Code otrzyma klucz `ApiKey` o długim okresie ważności. Zatwierdź konkretne miejsce zapisu, np. plik z danymi uwierzytelniającymi wykluczony z kontroli wersji. Nie zapisuj klucza w `CLAUDE.md` ani nie dodawaj go do repozytorium. [Instrukcja konfiguracji agenta AI](/pl/docs/agent-setup/) opisuje kroki uwierzytelniania i wyboru obszaru roboczego.

## Kiedy użyć API dla agentów, a kiedy MCP

Śledzenie wydatków z Claude może oznaczać dwie różne integracje. W tym poradniku używasz Claude Code w terminalu z API dla agentów. Claude w przeglądarce i Claude Desktop mogą korzystać z hostowanego zdalnego konektora MCP.

| | Claude Code z API dla agentów | Claude lub Claude Desktop z MCP |
|---|---|---|
| Najlepsze zastosowanie | Praca w terminalu z dostępnymi lokalnie plikami i bezpośrednimi żądaniami HTTP | Rozmowy w kliencie Claude obsługującym MCP |
| Punkt wyjścia | `https://app.expense-budget-tracker.com/api/agent` | `https://mcp.expense-budget-tracker.com/mcp` |
| Uwierzytelnianie | Jednorazowy kod z e-maila, potem klucz `ApiKey` o długim okresie ważności | OAuth w przeglądarce |
| Dostęp do danych | Dokument z opisem API wskazuje adresy punktów końcowych odczytu i zapisu | Narzędzie `sql_query` i opcjonalne `sql_execute` |
| Dostęp do wyciągu | Pliki i katalogi dostępne w danej sesji Claude Code | Zdalny konektor nie zapewnia dostępu do lokalnych plików |

Dane uwierzytelniające tych integracji nie są wymienne. Jeśli korzystasz z Claude w przeglądarce lub z Claude Desktop, skorzystaj z [poradnika o śledzeniu wydatków z Claude przez MCP](/blog/claude-expense-tracker-mcp-connector/) (po angielsku). Jeśli punktem wyjścia jest plik dostępny dla Claude Code, użyj opisanego poniżej API dla agentów.

Zwróć uwagę na jeszcze dwie rzeczy:

- Dostawca modelu przetwarza dane niezależnie od API i sposobu przechowywania danych w Expense Budget Tracker. Zanim udostępnisz dane z wyciągu, przeczytaj [dokumentację Claude Code o przetwarzaniu danych](https://code.claude.com/docs/en/data-usage) (po angielsku) i warunki dostawcy skonfigurowanego w Twojej instalacji.
- Lokalna konfiguracja Docker Compose opisana w [instrukcji uruchomienia na własnym serwerze](/pl/docs/self-hosting/) uruchamia aplikację webową, usługę uwierzytelniania, bazę danych i proces pobierania kursów walut. Nie udostępnia zarządzanego API dla agentów używanego w tym poradniku. Wdrożenie AWS z repozytorium to osobna konfiguracja, która obejmuje publiczne API.

## Ustal dokładny zakres importu

Na początek wybierz jedno konto, jedną walutę i jeden zamknięty okres objęty wyciągiem. CSV jest wygodny, bo jego wiersze łatwo sprawdzić. Przy innym formacie poproś najpierw Claude Code o potwierdzenie, że może odczytać plik w Twoim środowisku, i o pokazanie odczytanych wierszy. Sama nazwa pliku nie gwarantuje obsługi formatu.

Podaj Claude Code sześć informacji:

1. Lokalną ścieżkę do wyciągu.
2. Konto bankowe i odpowiadające mu konto w aplikacji.
3. Walutę konta.
4. Pierwszą i ostatnią datę księgowania.
5. Saldo początkowe lub ostatnie potwierdzone saldo.
6. Saldo końcowe z wyciągu.

Pomiń transakcje oczekujące, dopóki bank ich nie zaksięguje. Zachowaj plik źródłowy w oryginalnej postaci i poproś Claude Code o przygotowanie osobnego podglądu importu.

Takie reguły możesz zapisać w lokalnym pliku `CLAUDE.md` w katalogu z finansami:

```markdown
# Expense Budget Tracker workflow

- Start from https://app.expense-budget-tracker.com/api/agent and follow discovery.
- Confirm the target workspace and inspect the live schema before writing SQL.
- Use the read action for all inspection and reconciliation.
- Before a write, show the source totals, possible duplicates, exact SQL, and expected rows.
- Wait for my explicit approval of the complete change set.
- Use the write action only for the approved INSERT, UPDATE, or DELETE.
- Verify every write with a fresh read.
- Never invent a balancing entry or silently resolve an uncertain category.
- Keep the ApiKey outside this file and outside source control.
```

Dopisz informacje, które się nie zmieniają, takie jak nazwy kont, zasady przypisywania kategorii, sposób zapisywania przelewów i walutę raportowania. Przykładowe kategorie z tego artykułu kopiuj tylko wtedy, gdy odpowiadają kategoriom w Twoim rejestrze transakcji.

## Przygotuj pełny podgląd importu

Gdy połączenie działa, wklej poniższe polecenie i uzupełnij wartości w nawiasach kwadratowych:

```text
Import [local statement path] into [tracker account] for [posted start date] through
[posted end date] in [currency]. The opening balance is [amount] and the bank's closing
balance is [amount].

First confirm the selected workspace and inspect the live schema. Use only the read
action to inspect the target account, existing categories, and ledger rows that overlap
the statement period. Confirm that you can read the local file, parse it, and prepare a
complete preview without writing anything.

For every source row, show its source identifier or row number, posted date, signed
amount, currency, target account, proposed transaction type, proposed category, and
duplicate status. Flag transfers, refunds, reimbursements, fees, foreign-currency rows,
unfamiliar counterparties, and uncertain classifications.

Then show the source row count and signed total, all proposed ledger rows, possible
duplicates, the exact SQL you would send, and the expected affected-row count. Stop
and wait for my explicit approval of the complete change set.
```

Dopóki nie zatwierdzisz zmiany, operacje w bazie powinny pozostać w trybie tylko do odczytu. Claude Code powinien sprawdzić bieżący schemat bez kopiowania nazw kolumn z artykułu, znaleźć właściwe konto i pobrać zapisy w rejestrze transakcji z tego samego okresu. Zgodność daty i kwoty wskazuje na możliwy duplikat. Dwa rzeczywiste zakupy mogą mieć takie same wartości w obu polach.

### Przykład z czterema pozycjami

Załóżmy, że wyciąg z rachunku bieżącego pokazuje saldo początkowe €1,250.00 i cztery zaksięgowane pozycje:

| Wiersz | Data księgowania | Opis | Kwota ze znakiem | Proponowany typ | Proponowana kategoria | Do sprawdzenia |
|---|---|---|---:|---|---|---|
| 1 | 2026-08-31 | Wynagrodzenie | +€2,000.00 | Wpływ | Wynagrodzenie | Bez wątpliwości |
| 2 | 2026-09-02 | Sklep | −€54.20 | Wydatek | Zakupy spożywcze | Sprawdź sprzedawcę, jeśli go nie rozpoznajesz |
| 3 | 2026-09-03 | Przelew na konto oszczędnościowe | −€300.00 | Przelew | — | Potwierdź drugie konto |
| 4 | 2026-09-04 | Kawiarnia | −€8.40 | Wydatek | Jedzenie na mieście | Bez wątpliwości |

Suma czterech kwot z uwzględnieniem znaków wynosi `+€1,637.40`. Po dodaniu jej do salda początkowego `€1,250.00` oczekiwane saldo końcowe wynosi `€2,887.40`. Ten przykład mieści się na jednym ekranie, ale przy dłuższym wyciągu podgląd nadal powinien obejmować każdą pozycję źródłową i wskazywać wszystkie niejasności.

Sprawdź, na które konto trafił przelew. Przelew między własnymi kontami nie jest wydatkiem. Zwroty płatności i zwroty kosztów też powinny zachować właściwy typ. Jeśli klasyfikacja jest niejasna, oznacz pozycję do decyzji bez zgadywania kategorii.

### Zatwierdź konkretny zestaw zmian

Sprawdź obszar roboczy, konto, zakres dat, liczbę wierszy, sumę kwot ze znakami, możliwe duplikaty i klasyfikację. Zatwierdź konkretny podgląd i instrukcje SQL. Ogólne polecenie „zaimportuj wszystko” nie wystarczy.

API dla agentów rozdziela odczyt i zapis. Claude Code wysyła jedno zapytanie `SELECT` lub `WITH ... SELECT` pod adres odczytu podany przez serwer. Z punktu końcowego zapisu korzysta dopiero po wyraźnym zatwierdzeniu konkretnego `INSERT`, `UPDATE` lub `DELETE`. Nazwy tabel i kolumn sprawdzaj w aktualnym schemacie. Zasady SQL i limity opisuje [dokumentacja API](/pl/docs/api/).

### Przetestuj duży import lub aktualizację na małej partii

Dokument z opisem API wskazuje, by przed dużym `INSERT` lub `UPDATE` wysłać próbne żądanie o tej samej strukturze SQL. Dla `INSERT` to 1–3 wiersze z podanymi wprost wartościami, a dla `UPDATE` jeden wskazany wiersz. Twoja zgoda obejmuje zarówno próbę, jak i pozostałe wiersze z przejrzanego zestawu zmian.

Jeśli próba się powiedzie, Claude Code powinien od razu kontynuować, zapisując kolejno partie po najwyżej 100 wpisów i sprawdzając każdą z nich. Przy zatwierdzonym imporcie 247 wierszy i próbie z 3 wierszy pozostają partie po 100, 100 i 44 wiersze. Zmiana zakresu, nowa niejasność albo błąd wykonania wymagają nowej zgody. Kolejne partie z zatwierdzonego zestawu możesz przetworzyć w ramach tej samej zgody.

Ograniczony zestaw instrukcji SQL nie obsługuje `ON CONFLICT`, więc duplikaty trzeba rozstrzygać jawnie. Odczyt zwraca najwyżej 100 wierszy. Claude Code powinien sprawdzić w metadanych odpowiedzi liczbę wierszy i informację o skróceniu wyniku, liczyć sumy w SQL i podzielić szczegółową weryfikację na krótsze, uporządkowane odczyty. Do potwierdzenia całego importu potrzebne są pełne wyniki.

### Odczytaj zapisane wiersze

Pomyślna odpowiedź API potwierdza wykonanie żądania. Każdą zapisaną wartość trzeba jeszcze porównać z podglądem. Odczytaj ponownie dane z tego samego konta i okresu, a następnie porównaj:

- liczbę dodanych wierszy
- daty, kwoty ze znakami i waluty
- przypisanie do konta
- typy i kategorie transakcji
- możliwe duplikaty
- sumy partii i sumę całego wyciągu

Jeśli coś się różni, sprawdź przyczynę w trybie tylko do odczytu. Przed kolejnym zapisem przejrzyj jedną konkretną korektę. [Poradnik importowania wyciągów bankowych](/blog/how-to-import-bank-statements-into-an-expense-tracker/) (po angielsku) dokładniej omawia nakładające się okresy, zwroty i przelewy.

## Uzgodnij saldo i sprawdź kategorie osobno

Przy uzgadnianiu salda sprawdzasz, czy operacje zapisane w rejestrze transakcji dają takie samo saldo końcowe jak wyciąg za ten sam okres księgowania.

Dla zwykłego rachunku depozytowego:

**oczekiwane saldo końcowe = saldo początkowe + zaksięgowane wpływy − zaksięgowane obciążenia**

Przy operacjach zapisanych ze znakami:

**oczekiwane saldo końcowe = saldo początkowe + suma zaksięgowanych operacji ze znakami**

Na kontach zobowiązań, takich jak karty kredytowe, mogą obowiązywać inne zasady przypisywania znaków kwotom. Claude Code powinien wskazać te zasady przed obliczeniem różnicy.

Wklej kolejne polecenie:

```text
Use the read action only. Reconcile [account] for [posted start date] through [posted
end date] against the bank closing balance of [amount and currency]. State the opening
boundary, the sign convention, the stored row count, and the signed movement total.

Show expected closing balance, bank closing balance, and the exact difference. If the
difference is not zero, list candidate missing, duplicated, excluded, wrong-date, or
mis-signed rows. Do not insert a balancing entry and do not change any data.

After the balance check, review category totals separately. List uncategorized rows,
transfer rows counted as spending, and categories that differ from the approved preview.
```

W przykładzie z czterema pozycjami `€1,250.00 + €1,637.40 = €2,887.40`. Jeśli bank również podaje saldo końcowe €2,887.40, różnica wynosi `€0.00`.

Zerowa różnica potwierdza obliczenia na koncie dla wybranego zakresu. Kategorie trzeba sprawdzić osobno. Przeniesienie zakupu w sklepie za €54.20 z kategorii „Zakupy spożywcze” do kategorii „Podróże” pozostawia różnicę salda równą zero, ale przenosi €54.20 z jednej kategorii do drugiej. Sprawdź kategorie przed zaakceptowaniem wyniku.

Jeśli różnica jest inna niż zero, sprawdź saldo początkowe, brakujące lub zdublowane wiersze, przelewy, pozycje oczekujące, znaki, daty i waluty. Nigdy nie dodawaj fikcyjnej transakcji wyrównującej, żeby ukryć różnicę. [Poradnik uzgadniania sald](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) (po angielsku) opisuje ten proces dokładniej.

## Zaktualizuj budżet po uzgodnieniu salda

Przejdź do budżetu dopiero wtedy, gdy odczytane wiersze są prawidłowe, saldo się zgadza, a sumy kategorii mają sens. Claude Code może porównać rzeczywiste operacje z `budget_lines` i zaproponować zmiany. Jeden nietypowy miesiąc nie musi wyznaczać planu na kolejny.

```text
Confirm the workspace and inspect the current schema. Use the read action to compare
actual income and spending for [complete period] with the matching budget lines. Exclude
transfers using the stored transaction type and show uncategorized activity separately.

For each proposed budget change, show the category, current amount, actual amount,
proposed amount, difference, and reason. Then show the exact SQL and expected affected
rows. Do not write until I approve specific lines.

After approval, use the write action only for those lines and verify them with a fresh
read. Report any stored value that differs from the approved proposal.
```

Duży wydatek może być jednorazowy. Pozorne przekroczenie budżetu może wynikać ze źle zaklasyfikowanego przelewu lub zwrotu. Claude Code może policzyć różnice i przygotować SQL, a Ty decydujesz o kwotach na kolejny miesiąc.

## Zachowaj tę samą kolejność przy każdym wyciągu

Dla każdego wyciągu wykonaj te kroki w tej samej kolejności:

1. Zacznij od `https://app.expense-budget-tracker.com/api/agent` i postępuj według instrukcji w dokumencie z opisem API.
2. Pobierz informacje o koncie, potwierdź obszar roboczy i sprawdź aktualny schemat.
3. Daj Claude Code dostęp do jednego pliku z wyciągiem i podaj dokładny okres, saldo początkowe i saldo końcowe.
4. Odczytaj zapisy w rejestrze transakcji z tego samego okresu i przygotuj pełny podgląd importu.
5. Zatwierdź konkretny zestaw zmian.
6. Przy długiej instrukcji INSERT wykonaj próbę na 1–3 wierszach, a potem przetwarzaj kolejno partie po najwyżej 100 wierszy.
7. Odczytaj każdą zapisaną partię i porównaj ją z podglądem.
8. Uzgodnij konto z saldem końcowym w banku bez dodawania wpisu wyrównującego.
9. Sprawdź sumy kategorii, nawet gdy różnica sald wynosi zero.
10. Osobno przygotuj, zatwierdź i zweryfikuj zmiany pozycji budżetowych.

Zacznij od jednego konta i jednego zamkniętego okresu. Gdy zapisy z tego wyciągu są uzgodnione, a budżet sprawdzony, powtórz proces dla następnego konta. Claude Code wykonuje powtarzalną pracę z plikami i API, a Ty zatwierdzasz decyzje finansowe przed zmianą danych.
