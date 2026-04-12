---
title: מדריך לאירוח עצמי
description: הפעילו את Expense Budget Tracker על השרת שלכם באמצעות Docker Compose ו-Postgres.
---

## דרישות

- Docker ו-Docker Compose
- Postgres 18 ‏(כלול בקובץ ה-Compose)

## התחלה מהירה

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
cp .env.example .env
make up
```

הפקודות האלה מפעילות את Postgres, מריצות את המיגרציות, ומעלות את:

- יישום האינטרנט ב-`http://localhost:3000`
- שירות האימות ב-`http://localhost:8081`
- תהליך ה-FX ב-Docker Compose

## תצורה

העתיקו את `.env.example` אל `.env` והתאימו את הערכים:

- `MIGRATION_DATABASE_URL` — תפקיד הבעלים שבו משתמשות המיגרציות
- `DATABASE_URL` — תפקיד האפליקציה עבור תהליך יישום האינטרנט
- `AUTH_DATABASE_URL` — תפקיד סכמת האימות עבור שירות האימות
- `AUTH_MODE` — הערך `none` לשימוש מקומי, או `cognito` עבור סביבות עם קוד חד-פעמי באימייל
- `AUTH_DOMAIN`, `COOKIE_DOMAIN`, ו-`ALLOWED_REDIRECT_URIS` — ניתוב האימות והעוגיות

כאשר `AUTH_MODE=cognito`, צריך גם את הגדרות Cognito ואת `SESSION_ENCRYPTION_KEY` מתוך `.env.example`.

## עדכון

```bash
git pull
make up
```

`Docker Compose` בונה מחדש את השירותים ומריץ שוב את המיגרציות דרך מכל `migrate`.

## פריסה ל-AWS

לפריסה בסביבת ייצור על AWS ‏(ECS Fargate + RDS + ALB + Cognito), ראו את [מדריך AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/tree/main/infra/aws).
