---
title: Uruchomienie na własnym serwerze
description: Uruchom Expense Budget Tracker na własnym serwerze za pomocą Docker Compose i Postgres.
---

## Wymagania

- Docker i Docker Compose
- Postgres 18 (zdefiniowany w pliku Compose)

## Szybki start

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

Te polecenia uruchamiają bazę Postgres, wykonują migracje i włączają pozostałe usługi.

- aplikację w przeglądarce pod adresem `http://localhost:3000`
- usługę uwierzytelniania pod adresem `http://localhost:8081`
- proces pobierający kursy walut w Docker Compose

## Konfiguracja

Skopiuj `.env.example` do `.env` i ustaw:

- `MIGRATION_DATABASE_URL` — rola właściciela używana do migracji
- `DATABASE_URL` — rola używana przez proces aplikacji webowej
- `AUTH_DATABASE_URL` — rola w schemacie uwierzytelniania używana przez usługę logowania
- `AUTH_MODE` — `none` do użytku lokalnego, `cognito` w środowiskach z logowaniem jednorazowym kodem z e-maila
- `AUTH_DOMAIN`, `COOKIE_DOMAIN` i `ALLOWED_REDIRECT_URIS` — kierowanie żądań uwierzytelniania i pliki cookie

Przy `AUTH_MODE=cognito` potrzebujesz też ustawień Cognito i klucza `SESSION_ENCRYPTION_KEY` z pliku `.env.example`.

## Aktualizacja

```bash
git pull
make up
```

Docker Compose przebudowuje usługi i ponownie uruchamia migracje w kontenerze `migrate`.

## Wdrożenie w AWS

Produkcyjny stos CDK korzysta z ECS Fargate, RDS, ALB, Cognito, API Gateway i Lambda. Publiczne domeny aplikacji to:

- `app.<domain>` — aplikacja webowa w ECS Fargate za ALB
- `auth.<domain>` — usługa OTP i OAuth za ALB
- `api.<domain>/v1/*` — interfejs REST do operacji SQL wywoływanych programowo przez API Gateway i Lambda
- `mcp.<domain>/mcp` — hostowana usługa MCP korzystająca z osobnego API typu HTTP w API Gateway oraz funkcji MCP Lambda

Własna domena MCP wymaga publicznego certyfikatu ACM wystawionego dokładnie dla nazwy `mcp.<domain>`. Zachowaj rekord CNAME do weryfikacji DNS, aby umożliwić odnowienie certyfikatu. Podaj ARN certyfikatu w konfiguracji wdrożenia CDK i CI, a obok pozostałych publicznych domen utwórz rekord DNS `mcp.*`.

Kolejność kroków wdrożenia i skrypty konfiguracyjne znajdziesz w [opisie wdrożenia w repozytorium](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) (po angielsku) oraz w [instrukcji AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) (po angielsku).
