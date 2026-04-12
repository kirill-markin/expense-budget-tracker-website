---
title: "הגדרת מעקב הוצאות עם AI עבור Claude Code, Codex ו-OpenClaw"
description: "איך מחברים את Claude Code, את Codex או את OpenClaw למנהל הוצאות בקוד פתוח. משתפים כתובת discovery אחת, מאשרים את קוד האימייל, שומרים את ה-ApiKey שהוחזר, ונותנים לסוכן להתחיל לעבוד."
date: "2026-03-10"
keywords:
  - "מעקב הוצאות עם AI"
  - "Claude Code Expense Budget Tracker"
  - "Codex Expense Budget Tracker"
  - "OpenClaw Expense Budget Tracker"
  - "ApiKey expense tracker"
  - "agent setup expense tracker"
---

אם אתם רוצים להשתמש בסוכן AI כדי לעקוב אחרי הוצאות, החלק המעיק הוא בדרך כלל ההגדרה הראשונית.

התהליך הרגיל נראה כך:

1. פותחים את האפליקציה
2. יוצרים מפתח API
3. מעתיקים את המפתח
4. מדביקים אותו בתוך סוכן הטרמינל
5. מסבירים לאיזו נקודת קצה צריך לפנות
6. מקווים שהסוכן ישתמש בסביבת העבודה הנכונה

זה עובד, אבל זה לא באמת מותאם לסוכנים.

[Expense Budget Tracker](https://expense-budget-tracker.com/he/) חושף עכשיו נקודת קצה ציבורית של discovery עבור סוכני טרמינל כמו [Claude Code](https://docs.anthropic.com/en/docs/claude-code), OpenAI Codex או OpenClaw:

`https://api.expense-budget-tracker.com/v1/`

המשתמש נותן לסוכן את הקישור היחיד הזה, ואז עונה על שתי שאלות:

- באיזו כתובת אימייל צריך להשתמש להתחברות?
- מהו הקוד בן 8 הספרות שהגיע עכשיו לתיבה?

אחרי זה הסוכן יוצר לעצמו `ApiKey`, שומר אותו מחוץ לזיכרון הצ'אט, טוען את החשבון, מציג את רשימת סביבות העבודה, שומר אחת מהן כברירת מחדל עבור אותו מפתח, ויכול להתחיל לייבא או לשאול על טרנזקציות.

הפרויקט הוא קוד פתוח ב-GitHub:

- [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)
- [מימוש ה-Machine API](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/sql-api/src/machineApi.ts)
- [נתיב send-code עבור סוכנים](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentSendCode.ts)
- [נתיב verify-code עבור סוכנים](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentVerifyCode.ts)

## הקישור היחיד שצריך לתת לסוכן שלכם

זאת הכתובת המדויקת:

```text
https://api.expense-budget-tracker.com/v1/
```

נקודת הקצה הזאת מחזירה מסמך discovery קריא למכונה. הסוכן יכול להבין ממנו:

- איפה מתחיל תהליך האימות הראשוני
- לאיזו פעולה צריך לפנות קודם
- באיזו כותרת אימות להשתמש אחר כך
- מהם השלבים הבאים להגדרת סביבת עבודה ולגישה ל-SQL

זה הרעיון המרכזי: במקום לקודד ידנית הוראות התחלה בתוך prompt, המוצר עצמו מסביר לסוכן איך להתחבר.

## דוגמת prompt עבור Claude Code

```text
Connect to Expense Budget Tracker using https://api.expense-budget-tracker.com/v1/.
Ask me for the account email, wait for the 8-digit code from my inbox, finish the setup,
save the returned ApiKey outside chat memory, then import transactions from ~/Downloads/chase-march-2026.csv and verify the final balance.
```

## דוגמת prompt עבור Codex

```text
Use https://api.expense-budget-tracker.com/v1/ to connect to my Expense Budget Tracker account.
When you need login information, ask me for the email and then the 8-digit code.
After setup, save the key, inspect /schema, and show me my latest 20 transactions and total grocery spend this month.
```

## דוגמת prompt עבור OpenClaw

```text
Connect yourself to Expense Budget Tracker through https://api.expense-budget-tracker.com/v1/.
After login, save my personal workspace as the default for this key and import the CSV file I uploaded.
Use existing categories when possible, and tell me if any balance does not match.
```

## איך עובדת הגדרת מעקב ההוצאות עם AI

הנה תהליך ה-HTTP המלא שמאחורי ההגדרה הזו.

### 1. קוראים את נקודת הקצה של discovery

הסוכן מתחיל כאן:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

התשובה מסבירה לו להתחיל עם `send_code`, כוללת את כתובת האתחול בדומיין האימות, ומפנה לנקודות הקצה הציבוריות של OpenAPI ושל הסכמה.

### 2. שולחים את אימייל המשתמש

הסוכן שולח את כתובת האימייל לשירות האימות:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

אם הבקשה מצליחה, התשובה מכילה `otpSessionToken` והוראות לפנות אחר כך ל-`verify_code`.

### 3. מבקשים מהמשתמש את קוד האימייל בן 8 הספרות

המשתמש בודק את תיבת הדואר ומחזיר את הקוד לסוכן.

### 4. מאמתים את הקוד ומקבלים ApiKey

אחר כך הסוכן קורא לנקודת הקצה הבאה:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "code":"12345678",
    "otpSessionToken":"opaque-token-from-send-code",
    "label":"Claude Code on macbook"
  }'
```

התשובה כוללת `ApiKey` חדש. המפתח הזה מוצג פעם אחת בלבד, ולכן הסוכן צריך לשמור אותו לבקשות עתידיות, רצוי כ-`EXPENSE_BUDGET_TRACKER_API_KEY`.

זה השיפור המרכזי לעומת התהליך הידני הישן: המשתמש לא צריך ליצור מפתח ב-Settings ולהעתיק אותו לטרמינל.

### 5. טוענים את החשבון ואת ההקשר של סביבת העבודה

אחרי האימות, הסוכן משתמש ב-`Authorization: ApiKey <key>` וטוען את החשבון:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

אחר כך הוא מציג את רשימת סביבות העבודה:

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

אם צריך, הוא יכול ליצור סביבת עבודה חדשה או לשמור במפורש סביבת עבודה קיימת עם `POST /v1/workspaces/{workspaceId}/select`.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace_123/select \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

### 6. מריצים SQL דרך Agent API

אחרי זה, העבודה הרגילה על הנתונים נעשית דרך דומיין האפליקציה:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ" \
  -H "X-Workspace-Id: workspace_123" \
  -H "Content-Type: application/json" \
  -d '{
    "sql":"SELECT ts, category, counterparty, amount, currency FROM ledger_entries ORDER BY ts DESC LIMIT 20"
  }'
```

הבקשה חייבת לכלול את שני ה-headers הבאים:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` רק אם רוצים לעקוף את סביבת העבודה השמורה או לפני שנשמרת אחת כזאת

בחירת סביבת העבודה היא מפורשת, והשרת שומר אותה לכל API key אחרי `POST /v1/workspaces/{workspaceId}/select`. אם למשתמש יש סביבת עבודה אחת בלבד, ה-API שומר אותה אוטומטית ומשתמש בה עבור מפתח חדש.

## מה הסוכן יכול לעשות אחרי ההגדרה

אחרי שהחיבור הושלם, הסוכן יכול לטפל בעבודות הפיננסיות המשעממות שלא אמורות לדרוש שעות של קליקים:

1. לנתח ייצוא CSV, PDF או צילומי מסך מהבנק
2. להכניס טרנזקציות ל-ledger
3. לבדוק יתרות מול מה שהבנק מציג
4. לשאול על הוצאות לפי קטגוריה, בית עסק או תקופה
5. לעדכן שורות תקציב לחודש הבא

הנה דוגמה מעשית לייבוא דוח:

```text
Import ~/Downloads/revolut-february-2026.csv into my EUR account.
Before writing anything, query my existing categories and the last 30 days of transactions to avoid duplicates.
After import, compare the resulting account balance with the closing balance in the CSV.
```

והנה דוגמה לניתוח:

```text
Show me my top 10 spending categories in the last 90 days, then compare them with the previous 90-day period.
Also list the largest transactions in categories where spending increased.
```

## למה זה עדיף על הגדרה ידנית של API key

התהליך החדש פשוט יותר גם למשתמש וגם לסוכן:

- המשתמש לא צריך להעתיק ידנית מפתח ארוך-טווח
- הסוכן מגלה את הפרוטוקול מהמוצר עצמו
- יש הפרדה נקייה בין אימות לבין גישה לנתונים
- כל בקשת SQL תחומה לסביבת העבודה שנבחרה
- אפשר לבטל את החיבור אחר כך מתוך האפליקציה

אם אתם בונים תהליך עבודה של מעקב הוצאות עם AI, זה משנה. זה מוריד הרבה boilerplate מיותר ב-prompt והרבה טעויות הגדרה.

## מנהל הוצאות בקוד פתוח עם הגדרה לסוכנים

Expense Budget Tracker הוא פרויקט MIT ובקוד פתוח מלא:

- [אתר הפרויקט](https://expense-budget-tracker.com/he/)
- [מאגר GitHub](https://github.com/kirill-markin/expense-budget-tracker)
- [README ב-GitHub](https://github.com/kirill-markin/expense-budget-tracker/blob/main/README.md)
- [תיעוד הגדרת סוכן AI](https://expense-budget-tracker.com/he/docs/agent-setup/)
- [תיעוד ה-API](https://expense-budget-tracker.com/he/docs/api/)

אם אתם רוצים לארח אותו בעצמכם, התחילו כאן:

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

אם אתם רוצים להשתמש בגרסה המתארחת, תנו לסוכן שלכם את ה-URL הזה:

```text
https://api.expense-budget-tracker.com/v1/
```

זה מספיק כדי ש-Claude Code, Codex או OpenClaw יתחילו בעצמם את תהליך ההתחברות.
