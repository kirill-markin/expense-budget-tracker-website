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

מחסנית ה-CDK לפרודקשן משתמשת ב-ECS Fargate, ב-RDS, ב-ALB, ב-Cognito, ב-API Gateway וב-Lambda. היא חושפת את דומייני האפליקציה הציבוריים הבאים:

- `app.<domain>` — אפליקציית הווב ב-ECS Fargate מאחורי ALB
- `auth.<domain>` — שירות OTP ו-OAuth מאחורי ALB
- `api.<domain>/v1/*` — SQL REST API ללקוחות תוכנה דרך API Gateway ו-Lambda
- `mcp.<domain>/mcp` — שירות MCP מתארח דרך HTTP API ייעודי ב-API Gateway ופונקציית MCP Lambda

הדומיין המותאם אישית של MCP דורש אישור ACM ציבורי עבור השם המדויק `mcp.<domain>`. שמרו את רשומת ה-CNAME לאימות DNS לצורך חידוש, ספקו את ARN האישור לפריסת ה-CDK ול-CI, וצרו את רשומת ה-DNS של `mcp.*` לצד שאר הדומיינים הציבוריים.

לסדר הפעולות ולסקריפטים הנתמכים, עיינו ב-[סקירת הפריסה](https://github.com/kirill-markin/expense-budget-tracker/blob/main/docs/deployment.md) וב-[מדריך AWS CDK](https://github.com/kirill-markin/expense-budget-tracker/blob/main/infra/aws/README.md) שבמאגר.
