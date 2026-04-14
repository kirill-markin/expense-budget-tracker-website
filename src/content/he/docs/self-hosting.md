---
title: מדריך לאירוח עצמי
description: הפעילו את Expense Budget Tracker על שרת משלכם באמצעות Docker Compose ו-Postgres.
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

הפקודות האלה מעלות את Postgres, מריצות את המיגרציות ומפעילות את:

- אפליקציית הווב ב-`http://localhost:3000`
- שירות האימות ב-`http://localhost:8081`
- תהליך ה-FX כחלק מ-`Docker Compose`

## תצורה

העתיקו את `.env.example` אל `.env` ועדכנו את הערכים לפי הצורך:

- `MIGRATION_DATABASE_URL` — כתובת ההתחברות עם הרשאת הבעלים שבה משתמשות המיגרציות
- `DATABASE_URL` — כתובת ההתחברות עם הרשאת האפליקציה עבור תהליך הווב
- `AUTH_DATABASE_URL` — כתובת ההתחברות עם הרשאת סכמת האימות עבור שירות האימות
- `AUTH_MODE` — `none` לשימוש מקומי, או `cognito` לסביבות עם קוד חד-פעמי באימייל
- `AUTH_DOMAIN`, `COOKIE_DOMAIN`, ו-`ALLOWED_REDIRECT_URIS` — הגדרות ניתוב האימות והעוגיות

כאשר `AUTH_MODE=cognito`, נדרשות גם הגדרות Cognito וכן `SESSION_ENCRYPTION_KEY` מתוך `.env.example`.

## עדכון

```bash
git pull
make up
```

`Docker Compose` יבנה מחדש את השירותים ויריץ שוב את המיגרציות דרך הקונטיינר `migrate`.

## פריסה ל-AWS

לפריסה לפרודקשן ב-AWS ‏(ECS Fargate + RDS + ALB + Cognito), עיינו ב-[מדריך AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/tree/main/infra/aws).
