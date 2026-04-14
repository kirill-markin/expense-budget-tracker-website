---
title: מדריך ה-API
description: תהליך ההתחברות של סוכנים ומסמך עזר ל-SQL API לצורך גישה תכנותית לנתונים הפיננסיים שלכם.
---

## סקירה כללית

Expense Budget Tracker חושפת ממשק API ציבורי אחד לגישה תכנותית בכתובת:

`https://api.expense-budget-tracker.com/v1/`

אפשר להשתמש באותו ממשק בשתי דרכים:

1. **חיבור עצמי של סוכנים** החל מ-`GET /v1/`
2. **שימוש ישיר ב-HTTP** עם `ApiKey` ארוך-טווח קיים

כל הבקשות נאכפות באמצעות אותה אבטחה ברמת שורה (RLS) של Postgres שבה משתמשת גם אפליקציית הווב.

## גילוי ומפרטים שפורסמו

התחילו כאן:

`https://api.expense-budget-tracker.com/v1/`

תגובת הגילוי מסבירה לסוכנים איך להתחיל את תהליך האימות ולאילו נקודות קצה לפנות אחר כך. אותו API גם מפרסם:

- `GET /v1/openapi.json`
- `GET /v1/swagger.json`
- `GET /v1/schema`

השתמשו ב-`schema` כשאתם צריכים את הרשימה המדויקת של הטבלאות והעמודות שמותר לגשת אליהן דרך `/v1/sql`.

## חיבור עצמי של סוכנים

אם אתם רוצים ש-Claude Code, Codex, OpenClaw או סוכן אחר יתחבר בעצמו, התחילו מנקודת הקצה לגילוי ופעלו לפי הפעולות שהשרת מחזיר.

### זרימת האימות

1. `GET https://api.expense-budget-tracker.com/v1/`
2. קראו את הפעולה `send_code` ואת `bootstrapUrl` שמוחזרים בתגובה
3. שלחו `POST` עם כתובת האימייל של המשתמש אל `https://auth.expense-budget-tracker.com/api/agent/send-code`
4. קבלו `otpSessionToken`
5. בקשו מהמשתמש את הקוד בן 8 הספרות שנשלח באימייל
6. שלחו `POST` עם `code`, `otpSessionToken` ו-`label` אל `https://auth.expense-budget-tracker.com/api/agent/verify-code`
7. קבלו `ApiKey` ארוך-טווח
8. שמרו את המפתח הזה מחוץ לזיכרון הצ'אט
9. `GET https://api.expense-budget-tracker.com/v1/me`
10. `GET https://api.expense-budget-tracker.com/v1/workspaces`
11. לפי הצורך, `POST https://api.expense-budget-tracker.com/v1/workspaces` כדי ליצור סביבת עבודה
12. `POST https://api.expense-budget-tracker.com/v1/workspaces/{workspaceId}/select`
13. `GET https://api.expense-budget-tracker.com/v1/schema`
14. הריצו SQL עם `POST https://api.expense-budget-tracker.com/v1/sql`

### כותרת האימות

- `Authorization: ApiKey <key>`

### עבודה עם סביבות עבודה

- `POST /v1/workspaces/{workspaceId}/select` שומר את סביבת העבודה שמוגדרת כברירת מחדל עבור אותו מפתח API
- אחרי שסביבת העבודה נשמרת, אפשר להשמיט את `X-Workspace-Id` ב-`/v1/sql`
- `X-Workspace-Id: <workspaceId>` עדיין נתמך אם תרצו לעקוף את סביבת העבודה השמורה בבקשה אחת
- אם למשתמש יש בדיוק סביבת עבודה אחת, ועדיין לא נשמרה בחירה עבור המפתח, ה-API ישמור את הבחירה הזו אוטומטית וישתמש בה

למדריך אנושי מפורט שלב אחר שלב, ראו [הגדרת סוכן AI](/docs/agent-setup/).

## שימוש ישיר ב-HTTP עם מפתח קיים

סקריפטים, משימות מתוזמנות, לוחות מחוונים ואפליקציות מותאמות אישית יכולים לפנות לאותו API ישירות, כל עוד כבר יש להם `ApiKey` ארוך-טווח.

### אימות

שלחו את המפתח בכותרת אימות מסוג `ApiKey`:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_your_key_here" \
  -H "X-Workspace-Id: workspace-id" \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM ledger_entries ORDER BY ts DESC LIMIT 10"}'
```

`X-Workspace-Id` נדרש רק אם למפתח עדיין אין סביבת עבודה שמורה כברירת מחדל, או אם תרצו לעקוף את סביבת העבודה השמורה בבקשה הזו.

- `Authorization: ApiKey ebta_your_key_here`
- `X-Workspace-Id: <workspaceId>` כשצריך

## סיכום נקודות הקצה

- `GET /v1/` — מסמך גילוי ציבורי
- `GET /v1/openapi.json` ו-`GET /v1/swagger.json` — מפרטי API שפורסמו
- `GET /v1/me` — פרטי החשבון בהקשר המאומת
- `GET /v1/workspaces` — רשימת סביבות העבודה הזמינות לבעל המפתח
- `POST /v1/workspaces` — יצירת סביבת עבודה
- `POST /v1/workspaces/{workspaceId}/select` — שמירת סביבת העבודה שמוגדרת כברירת מחדל עבור המפתח הזה
- `GET /v1/schema` — בדיקת הטבלאות והעמודות המותרות עבור SQL
- `POST /v1/sql` — הרצת משפט SQL מוגבל אחד

## מדיניות SQL

נקודת הקצה `POST /v1/sql` מקבלת משפט SQL אחד בלבד בכל בקשה.

סוגי המשפטים המותרים:

- `SELECT`
- `WITH`
- `INSERT`
- `UPDATE`
- `DELETE`

דפוסים חסומים או דפוסים שיידחו:

- כמה משפטים באותה בקשה
- פקודות הגדרת מבנה (DDL) כמו `CREATE`, `DROP` ו-`ALTER`
- עטיפות טרנזקציה כמו `BEGIN`, `COMMIT` ו-`ROLLBACK`
- `set_config()`
- הערות SQL
- מזהים במירכאות כפולות
- מחרוזות התחומות בדולרים, למשל `$$...$$`

השרת גם מגביל אילו טבלאות אפשר לתשאל. השתמשו ב-`/v1/schema` כדי לבדוק אילו טבלאות ועמודות נחשפות לפני שאתם מייצרים את משפט ה-SQL.

הטבלאות שנחשפות כרגע:

- `ledger_entries`
- `accounts`
- `budget_lines`
- `budget_comments`
- `workspace_settings`
- `account_metadata`
- `exchange_rates`

## מגבלות

- 100 שורות לכל תגובה
- מגבלת זמן של 30 שניות לכל משפט
- 10 בקשות לשנייה, 10,000 בקשות ליום לכל מפתח

## אבטחה

- מפתחות API נשמרים כגיבובי SHA-256, בלי לשמור את הערך הגלוי
- מדיניות RLS אוכפת בידוד בין סביבות עבודה ברמת מסד הנתונים
- אפשר לבטל מפתחות מתוך המוצר בכל רגע
- הסרת חבר מסביבת עבודה מבטלת אוטומטית את כל המפתחות שלו
