---
title: "הגדרת מעקב הוצאות עם בינה מלאכותית עבור Claude Code, Codex ו-OpenClaw"
description: "כך מחברים את Claude Code, את Codex או את OpenClaw למנהל הוצאות בקוד פתוח: משתפים כתובת גילוי אחת, מאשרים את קוד האימייל, שומרים את מפתח ה-API שמתקבל, ונותנים לסוכן להתחיל לעבוד."
date: "2026-03-10"
keywords:
  - "מעקב הוצאות עם בינה מלאכותית"
  - "חיבור Claude Code ל-Expense Budget Tracker"
  - "חיבור Codex ל-Expense Budget Tracker"
  - "חיבור OpenClaw ל-Expense Budget Tracker"
  - "מפתח API של Expense Budget Tracker"
  - "הגדרת סוכן ל-Expense Budget Tracker"
---

אם אתם רוצים להשתמש בסוכן בינה מלאכותית לניהול הוצאות, החלק המתסכל בדרך כלל הוא שלב ההגדרה.

התהליך הרגיל נראה כך:

1. פותחים את האפליקציה
2. יוצרים מפתח API
3. מעתיקים את המפתח
4. מדביקים אותו בתוך סוכן הטרמינל
5. מסבירים לאיזו נקודת קצה צריך לפנות
6. מקווים שהסוכן יבחר את מרחב העבודה הנכון

זה אפשרי, אבל זה לא באמת תהליך שמותאם לסוכנים.

[Expense Budget Tracker](https://expense-budget-tracker.com/he/) מציע עכשיו נקודת קצה ציבורית לגילוי עבור סוכני טרמינל כמו [Claude Code](https://docs.anthropic.com/en/docs/claude-code), OpenAI Codex או OpenClaw:

`https://api.expense-budget-tracker.com/v1/`

המשתמש נותן לסוכן את הקישור היחיד הזה, ואז עונה על שתי שאלות פשוטות:

- באיזו כתובת אימייל להשתמש כדי להתחבר?
- מהו הקוד בן 8 הספרות שהגיע עכשיו לתיבת הדואר?

אחר כך הסוכן יוצר לעצמו `ApiKey`, שומר אותו מחוץ לזיכרון השיחה, טוען את החשבון, מציג את רשימת מרחבי העבודה, שומר אחד מהם כברירת המחדל לאותו מפתח, ויכול להתחיל לייבא עסקאות או להריץ שאילתות.

הפרויקט הוא קוד פתוח ב-GitHub:

- [github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker)
- [מימוש ה-API לסוכנים](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/sql-api/src/machineApi.ts)
- [נתיב send-code עבור סוכנים](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentSendCode.ts)
- [נתיב verify-code עבור סוכנים](https://github.com/kirill-markin/expense-budget-tracker/blob/main/apps/auth/src/routes/agentVerifyCode.ts)

## הקישור היחיד שצריך לתת לסוכן שלכם

זאת הכתובת המדויקת:

```text
https://api.expense-budget-tracker.com/v1/
```

נקודת הקצה הזאת מחזירה מסמך גילוי קריא למכונה. הסוכן יכול להבין ממנו:

- היכן מתחיל תהליך האימות הראשוני
- לאיזו פעולה צריך לפנות קודם
- באיזו כותרת אימות להשתמש בהמשך
- מהם השלבים הבאים להגדרת מרחב עבודה ולגישה ל-SQL

זה הרעיון המרכזי: במקום לכתוב ידנית בתוך ההנחיה את כל שלבי ההתחברות, המוצר עצמו מסביר לסוכן איך להתחבר.

## דוגמת הנחיה עבור Claude Code

```text
התחבר ל-Expense Budget Tracker באמצעות https://api.expense-budget-tracker.com/v1/.
בקש ממני את כתובת האימייל של החשבון, המתן לקוד בן 8 הספרות שיגיע לתיבת הדואר שלי, סיים את ההגדרה,
שמור את ה-ApiKey שמתקבל מחוץ לזיכרון השיחה, ואז ייבא עסקאות מתוך ~/Downloads/chase-march-2026.csv ואמת את היתרה הסופית.
```

## דוגמת הנחיה עבור Codex

```text
השתמש ב-https://api.expense-budget-tracker.com/v1/ כדי להתחבר לחשבון ה-Expense Budget Tracker שלי.
כשצריך פרטי התחברות, בקש ממני קודם את כתובת האימייל ואז את הקוד בן 8 הספרות.
אחרי ההגדרה, שמור את המפתח, בדוק את /schema, והצג לי את 20 העסקאות האחרונות שלי ואת סך ההוצאה שלי על מצרכים החודש.
```

## דוגמת הנחיה עבור OpenClaw

```text
התחבר ל-Expense Budget Tracker דרך https://api.expense-budget-tracker.com/v1/.
אחרי ההתחברות, שמור את מרחב העבודה האישי שלי כברירת המחדל למפתח הזה וייבא את קובץ ה-CSV שהעליתי.
השתמש בקטגוריות קיימות כשאפשר, ותגיד לי אם יש יתרה שלא תואמת.
```

## איך פועלת הגדרת מעקב ההוצאות עם בינה מלאכותית

זהו רצף בקשות ה-HTTP המלא שמאחורי ההגדרה הזאת.

### 1. קוראים את נקודת הגילוי

הסוכן מתחיל כאן:

```bash
curl https://api.expense-budget-tracker.com/v1/
```

התשובה אומרת לו להתחיל ב-`send_code`, כוללת את כתובת האתחול בדומיין האימות, ומפנה גם ל-OpenAPI ול-`/schema` שפורסמו.

### 2. שולחים את אימייל המשתמש

הסוכן שולח את כתובת האימייל לשירות האימות:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/send-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

אם הבקשה מצליחה, התשובה כוללת `otpSessionToken` והוראות לפנייה הבאה אל `verify_code`.

### 3. מבקשים מהמשתמש את קוד האימייל בן 8 הספרות

המשתמש בודק את תיבת הדואר ומחזיר את הקוד לסוכן.

### 4. מאמתים את הקוד ומקבלים ApiKey

אחר כך הסוכן קורא לנקודת הקצה הזאת:

```bash
curl -X POST https://auth.expense-budget-tracker.com/api/agent/verify-code \
  -H "Content-Type: application/json" \
  -d '{
    "code":"12345678",
    "otpSessionToken":"opaque-token-from-send-code",
    "label":"Claude Code on macbook"
  }'
```

בתשובה מתקבל `ApiKey` חדש. המפתח הזה מוצג פעם אחת בלבד, ולכן הסוכן צריך לשמור אותו עבור בקשות עתידיות, רצוי כ-`EXPENSE_BUDGET_TRACKER_API_KEY`.

זה השיפור המרכזי לעומת התהליך הידני הישן: המשתמש כבר לא צריך ליצור מפתח בהגדרות ולהעתיק אותו לטרמינל.

### 5. טוענים את החשבון ואת ההקשר של מרחב העבודה

אחרי האימות, הסוכן משתמש ב-`Authorization: ApiKey <key>` וטוען את פרטי החשבון:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

אחר כך הוא שולף את רשימת מרחבי העבודה:

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

אם צריך, הוא יכול ליצור מרחב עבודה חדש או לבחור במפורש מרחב עבודה קיים באמצעות `POST /v1/workspaces/{workspaceId}/select`.

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace_123/select \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ"
```

### 6. מריצים SQL דרך ה-API

אחרי זה, העבודה השוטפת על הנתונים נעשית דרך דומיין האפליקציה:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/sql \
  -H "Authorization: ApiKey ebta_ABCDEFGH_0123456789ABCDEFGHJKMNPQ" \
  -H "X-Workspace-Id: workspace_123" \
  -H "Content-Type: application/json" \
  -d '{
    "sql":"SELECT ts, category, counterparty, amount, currency FROM ledger_entries ORDER BY ts DESC LIMIT 20"
  }'
```

הבקשה חייבת לכלול את שתי הכותרות הבאות:

- `Authorization: ApiKey <key>`
- `X-Workspace-Id: <workspaceId>` רק אם רוצים לעקוף את מרחב העבודה השמור או לפני שנשמר אחד כזה

בחירת מרחב העבודה היא מפורשת, והשרת שומר אותה לכל מפתח API אחרי `POST /v1/workspaces/{workspaceId}/select`. אם למשתמש יש מרחב עבודה אחד בלבד, ה-API שומר אותו אוטומטית ומשתמש בו גם עבור מפתח חדש.

## מה הסוכן יכול לעשות אחרי ההגדרה

אחרי שהחיבור הושלם, הסוכן יכול לטפל בעבודה הפיננסית המשעממת שלא אמורה לדרוש שעות של הקלקות:

1. לנתח קובצי ייצוא בפורמט CSV או PDF, וגם צילומי מסך מהבנק
2. להוסיף עסקאות לספר החשבונות
3. להשוות יתרות מול מה שהבנק מציג
4. לנתח הוצאות לפי קטגוריה, בית עסק או תקופה
5. לעדכן סעיפי תקציב לחודש הבא

הנה דוגמה מעשית לייבוא דפי חשבון:

```text
ייבא את ~/Downloads/revolut-february-2026.csv אל חשבון ה-EUR שלי.
לפני שאתה כותב משהו, בדוק את הקטגוריות הקיימות שלי ואת העסקאות מ-30 הימים האחרונים כדי למנוע כפילויות.
אחרי הייבוא, השווה את יתרת החשבון שהתקבלה ליתרת הסגירה שמופיעה בקובץ ה-CSV.
```

והנה דוגמה לניתוח:

```text
הצג לי את 10 קטגוריות ההוצאה המובילות שלי ב-90 הימים האחרונים, ואז השווה אותן ל-90 הימים שקדמו להם.
בנוסף, רשום את העסקאות הגדולות ביותר בקטגוריות שבהן ההוצאה עלתה.
```

## למה זה עדיף על הגדרה ידנית של מפתח API

התהליך החדש פשוט יותר גם למשתמש וגם לסוכן:

- המשתמש לא צריך להעתיק ידנית מפתח ארוך טווח
- הסוכן לומד את הפרוטוקול מהמוצר עצמו
- יש הפרדה נקייה בין אימות לבין גישה לנתונים
- כל בקשת SQL תחומה למרחב העבודה שנבחר
- אפשר לבטל את החיבור אחר כך מתוך האפליקציה

אם אתם בונים תהליך עבודה למעקב הוצאות עם בינה מלאכותית, זה חשוב. זה חוסך הרבה טקסט טכני מיותר בהנחיה ומפחית טעויות בהגדרה.

## מנהל הוצאות בקוד פתוח עם חיבור לסוכנים

Expense Budget Tracker הוא פרויקט MIT ובקוד פתוח מלא:

- [אתר הפרויקט](https://expense-budget-tracker.com/he/)
- [מאגר GitHub](https://github.com/kirill-markin/expense-budget-tracker)
- [README ב-GitHub](https://github.com/kirill-markin/expense-budget-tracker/blob/main/README.md)
- [תיעוד הגדרת סוכן בינה מלאכותית](https://expense-budget-tracker.com/he/docs/agent-setup/)
- [תיעוד ה-API](https://expense-budget-tracker.com/he/docs/api/)

אם אתם רוצים לארח אותו בעצמכם, התחילו כאן:

```bash
git clone https://github.com/kirill-markin/expense-budget-tracker.git
cd expense-budget-tracker
make up
```

אם אתם מעדיפים את הגרסה המתארחת, תנו לסוכן שלכם את הכתובת הזאת:

```text
https://api.expense-budget-tracker.com/v1/
```

זה מספיק כדי ש-Claude Code, Codex או OpenClaw יתחילו לבד את תהליך ההתחברות.
