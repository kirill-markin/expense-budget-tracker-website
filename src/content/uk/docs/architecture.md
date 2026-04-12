---
title: Архітектура
description: Огляд системи, модель даних, мультивалютний дизайн і модель аутентифікації.
---

## Огляд системи

```
Browser UI  -->  Next.js web app  -->  Postgres (RLS)
                        |                  ^
                        v                  |
                 Auth service -------------+
                        ^
                        |
             Machine clients via API Gateway
                        ^
                        |
                Worker (FX fetchers) ------
```

П’ять компонентів, одна база даних:

1. **web** — Next.js-застосунок з UI та API routes
2. **auth** — вхід через email OTP і bootstrap агентів
3. **sql-api** — AWS Lambda за API Gateway
4. **worker** — щоденне отримання курсів ECB, CBR і NBS
5. **Postgres** — єдине джерело істини з row-level security
