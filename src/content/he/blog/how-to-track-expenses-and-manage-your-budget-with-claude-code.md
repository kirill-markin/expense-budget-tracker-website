---
title: "איך לעקוב אחרי הוצאות ולנהל את התקציב שלכם עם Claude Code"
description: "הגדירו את Claude Code כעוזר הפיננסי האישי שלכם. תנו לו URL יחיד של discovery, אפשרו לו להשלים את זרימת ה-OTP באימייל, שמרו את ה-ApiKey שהוחזר, והוא יוכל לנתח דפי חיוב, לבדוק יתרות ולנהל את התקציב שלכם מהטרמינל."
date: "2026-03-05"
keywords:
  - "מעקב הוצאות עם Claude Code"
  - "Claude Code לתקציב אישי"
  - "Claude Code Expense Budget Tracker"
  - "Claude Code לניהול תקציב"
  - "Claude Code personal finance"
  - "Claude Code ApiKey"
---

Claude Code הוא סוכן ה-AI של Anthropic שפועל בתוך הטרמינל שלכם. הוא יכול לקרוא קבצים, לכתוב קוד, להריץ פקודות ולבצע בקשות HTTP. רוב האנשים משתמשים ב-Claude Code לפיתוח תוכנה. אבל הוא עובד מצוין גם לפיננסים אישיים כשמחברים אותו ל-expense tracker עם machine API נקי.

ההגדרה פשוטה: מחברים את Claude Code ל-expense tracker בקוד פתוח דרך ה-machine API שלו, והוא הופך לעוזר פיננסי אישי שחי בתוך הטרמינל. זורקים דף חיוב מהבנק, מבקשים מ-Claude Code לרשום את הטרנזקציות, לבדוק יתרות, לעדכן את התקציב, והכול דרך שיחה טבעית. בלי לעבור בין מסכי UI, בלי להזין נתונים ידנית.

## למה Claude Code עובד טוב למעקב הוצאות

Claude Code שונה מ-ChatGPT או מאפליקציית הווב של Claude בכמה דרכים חשובות שמשנות בפיננסים אישיים:

**הוא רץ מקומית ויכול לקרוא את הקבצים שלכם.** כשאתם מורידים דף חיוב בנקאי כ-CSV או PDF, Claude Code יכול לקרוא אותו ישירות ממערכת הקבצים שלכם. בלי העלאות, בלי העתק-הדבק, בלי צילומי מסך. אתם אומרים "נתח את דף החיוב ב-`~/Downloads/chase-march-2026.csv`" ו-Claude Code קורא את הקובץ.

**הוא יכול להריץ קוד ובקשות HTTP.** Claude Code לא רק מציע פקודת `curl`, אלא מריץ אותה. כשהוא צריך להכניס 50 טרנזקציות למסד נתוני ההוצאות שלכם, הוא כותב את ה-SQL, שולח את בקשת ה-HTTP ומאשר את התוצאה. כל הזרימה מתרחשת בתוך שיחה אחת.

**הוא זוכר את ההגדרה שלכם בין סשנים.** ברגע שה-ApiKey שהוחזר נשמר מחוץ לזיכרון הצ'אט, Claude Code יכול להשתמש שוב באותו חיבור בסשנים עתידיים במקום לחזור על זרימת קוד האימייל בכל פעם.

**הוא עובד offline עם קבצים מקומיים.** אם אתם רוצים לעבד מראש דפי חיוב, לנקות פורמטי CSV, או לכתוב סקריפטי ייבוא, Claude Code עושה את כל זה מקומית לפני שמשהו בכלל נוגע ב-API.

## הגדרת Claude Code לפיננסים אישיים

אתם צריכים שני דברים: expense tracker עם machine API, ומקום שבו אפשר לשמור את המפתח ארוך-הטווח ש-Claude Code מקבל אחרי ההתחברות.

[Expense Budget Tracker](https://expense-budget-tracker.com/he/) הוא מערכת פיננסים אישיים בקוד פתוח שמבוססת על Postgres. נקודת ה-discovery הקנונית שלו היא `GET https://api.expense-budget-tracker.com/v1/`. אפשר להירשם לגרסה המתארחת או [לארח אותו בעצמכם](https://github.com/kirill-markin/expense-budget-tracker) על השרת שלכם.

### שלב 1: תנו ל-Claude Code את כתובת ה-discovery

אמרו ל-Claude Code להתחבר בעזרת:

```text
https://api.expense-budget-tracker.com/v1/
```

Claude Code אמור להתחיל בקריאת תגובת ה-discovery, ואז לבקש:

- את כתובת האימייל של החשבון שלכם
- את הקוד בן 8 הספרות שנשלח לתיבת הדואר שלכם

כשהוא מאמת את הקוד, השירות מחזיר מפתח ארוך-טווח בפורמט ה-API האמיתי, למשל `ebta_...`.

### שלב 2: שמרו את המפתח שהוחזר מחוץ לזיכרון הצ'אט

זרימת האימות נוחה, אבל עדיין צריך לשמור את המפתח במקום עמיד. השרת אומר במפורש לסוכנים לא להסתמך רק על היסטוריית הצ'אט.

דפוס פשוט נראה כך:

```bash
export EXPENSE_BUDGET_TRACKER_API_KEY="ebta_your_key_here"
```

אם אתם רוצים ש-Claude Code ישמור אותו בקובץ `.env` מקומי, אשרו את זה במפורש. אחרת השאירו אותו ב-shell של הסשן הנוכחי ושמרו אותו בעצמכם במקום קבוע.

### שלב 3: שמרו את סביבת העבודה פעם אחת

אחרי ש-Claude Code מאמת את הקוד, הוא אמור לטעון את החשבון ואת סביבות העבודה שלכם:

```bash
curl https://api.expense-budget-tracker.com/v1/me \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

```bash
curl https://api.expense-budget-tracker.com/v1/workspaces \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

אחר כך צריך לשמור פעם אחת את סביבת העבודה כברירת מחדל עבור המפתח הזה:

```bash
curl -X POST https://api.expense-budget-tracker.com/v1/workspaces/workspace-id/select \
  -H "Authorization: ApiKey $EXPENSE_BUDGET_TRACKER_API_KEY"
```

אחרי זה `POST /v1/sql` יכול לוותר על `X-Workspace-Id`. אם לחשבון שלכם יש בדיוק סביבת עבודה אחת, ה-API שומר אותה אוטומטית ומשתמש בה בפעם הראשונה.

### שלב 4: הוסיפו קובץ הוראות מקומי למוסכמות שלכם

Claude Code עדיין עובד טוב יותר כשאתם נותנים לו את הקטגוריות, החשבונות וכללי העבודה שלכם. קובץ `CLAUDE.md` מקומי שימושי בשביל זה:

```markdown
# Personal Finance

## Expense Tracker API

- Endpoint: https://api.expense-budget-tracker.com/v1/sql
- Auth: ApiKey in Authorization header
- API key is in the EXPENSE_BUDGET_TRACKER_API_KEY environment variable
- Default workspace is already saved for this key
- Request: POST with JSON body {"sql": "your query"}
- Response: {"rows": [...], "rowCount": N}

## My expense categories

Income: salary, freelance, side-projects
Fixed: rent, utilities, insurance, subscriptions
Daily: groceries, dining-out, transport, coffee
Lifestyle: clothing, entertainment, healthcare, travel
Planning: taxes, big-purchases, savings, emergency-fund

## My accounts

- chase-checking (USD) — main checking account
- wise-eur (EUR) — European account
- cash-usd (USD) — cash

## Rules

- Always check existing categories before inserting transactions
- After importing, verify account balances match the bank
- Use the exact category names listed above
- Store transactions in their original currency
```

### שלב 5: פתחו את Claude Code והתחילו לעבוד

```bash
cd ~/finances
claude
```

Claude Code קורא את ההוראות המקומיות שלכם, משתמש מחדש ב-ApiKey השמור, ויכול להתחיל לעבוד מיד.

## ניתוח דפי חיוב בנקאיים עם Claude Code

כאן Claude Code באמת בולט. הורידו את דף החיוב שלכם ובקשו ממנו לעבד אותו:

```text
> I downloaded my Chase statement to ~/Downloads/chase-march-2026.csv.
> Parse it and record all transactions to my chase-checking account.
```

Claude Code יעשה:

1. יקרא את קובץ ה-CSV ממערכת הקבצים שלכם
2. ינתח כל שורה: תאריך, סכום, תיאור
3. יתאים כל טרנזקציה לאחת מקטגוריות ההוצאה שלכם מתוך `CLAUDE.md`
4. יבנה פקודות `INSERT` עבור טבלת `ledger_entries`
5. ישלח כל אחת מהן דרך SQL API
6. ידווח לכם מה נרשם

אתם בודקים את הפלט, אומרים ל-Claude Code לתקן טרנזקציות שסווגו לא נכון, וסיימתם. חודש שלם של טרנזקציות בנקאיות מעובד בכמה דקות.

גם עבור דפי חיוב ב-PDF או צילומי מסך של אפליקציית הבנק, אותה גישה עובדת. Claude Code יכול לקרוא תמונות ו-PDF, לחלץ את נתוני הטרנזקציות, ולרשום הכול באותה צורה.

## בדיקת יתרות ואיתור טעויות

אחרי ייבוא טרנזקציות, תמיד כדאי לאמת שהמספרים מסתכמים:

```text
> Check my account balances and compare them to what I see in the bank:
> chase-checking should be $4,230.15
> wise-eur should be €1,847.50
```

Claude Code שואל את תצוגת `accounts` דרך SQL API, משווה את היתרות, ומסמן פערים. אם `chase-checking` מראה 4,180.15 דולר במקום 4,230.15, Claude Code יכול לעזור לכם למצוא את ה-50 דולר החסרים. אולי טרנזקציה שדולגה או נספרה פעמיים.

בדיקת היתרות השבועית הזו היא אחד ההרגלים החשובים ביותר בפיננסים אישיים. Kirill Markin, שבנה את Expense Budget Tracker ומקטלג כל טרנזקציה אישית כבר יותר מחמש שנים, עושה את הבדיקה הזו בכל שבוע. זה מה ששומר על הנתונים אמינים לאורך זמן.

## לשאול שאלות על ההוצאות שלכם

ברגע שנתוני ההוצאות כבר יושבים במסד הנתונים, Claude Code יכול לענות על כל שאלה פיננסית על ידי כתיבת שאילתות SQL:

```text
> How much did I spend on dining out in the last 3 months?
```

```text
> What are my top 5 expense categories this month?
```

```text
> Show me all transactions over $100 from last week.
```

```text
> What's my average monthly grocery spending over the past 6 months?
```

Claude Code כותב את ה-SQL, מריץ אותו מול ה-API, ונותן לכם את התשובה בשפה רגילה. אתם לא צריכים לדעת SQL בעצמכם, אבל תמיד אפשר לבקש מ-Claude Code להראות את השאילתה שרצה, לוודא שהיא הגיונית, או לכוונן אותה.

## ניהול תחזית התקציב שלכם

מעקב הוצאות הוא רישום של מה שכבר קרה. תקצוב הוא תכנון של מה שיקרה בהמשך. שניהם חיים באותו מסד נתונים.

הטבלה `budget_lines` שומרת את התחזית החודשית שלכם: הכנסה צפויה והוצאות מתוכננות לכל קטגוריה ולכל חודש. אפשר לנהל את זה דרך Claude Code:

```text
> Set my budget for April 2026:
> - groceries: $400
> - dining-out: $200
> - rent: $2,100
> - salary income: $8,500
> Copy everything else from March's budget.
```

Claude Code קורא את רשומות התקציב של מרץ, יוצר רשומות לאפריל עם העדכונים שלכם, וכותב אותן דרך SQL API. עכשיו יש לכם תחזית מתגלגלת ל-12 חודשים שאפשר לגלול בה בממשק האינטרנט.

שגרה חודשית טובה: בסוף כל חודש, פתחו את Claude Code ואמרו משהו כזה:

```text
> Compare my actual spending this month against the budget.
> For any category where I spent more than 20% over budget,
> adjust next month's forecast to be more realistic.
```

Claude Code קורא את הביצוע בפועל מ-`ledger_entries`, משווה לתוכנית ב-`budget_lines`, ומעדכן את התחזית. זה בדיוק סוג הניתוח שלוקח 30 דקות ידנית ו-2 דקות עם Claude Code.

## עבודה עם כמה מטבעות

אם יש לכם חשבונות בכמה מטבעות, Claude Code מטפל בזה בצורה טבעית. expense tracker שומר כל טרנזקציה במטבע המקורי שלה ומביא שערי חליפין מדי יום מ-ECB, מ-CBR ומ-NBS.

```text
> I received €2,500 freelance payment into wise-eur yesterday.
> Record it as income, category: freelance.
```

Claude Code יכתוב את ה-`INSERT` עם `currency: 'EUR'` ועם הסכום הנכון. כשאחר כך תשאלו "מה ההכנסה הכוללת שלי החודש ב-USD?", מסד הנתונים יבצע את המרת המטבע בזמן השאילתה באמצעות שערי החליפין העדכניים. Claude Code רק ידווח את התוצאה.

## מה Claude Code יכול לעשות שממשקי אינטרנט לא יכולים

הכוח של Claude Code בפיננסים אישיים מגיע מהחיבור בין גישה לקבצים, בקשות HTTP ושיחה טבעית בכלי אחד:

**עיבוד באצ'ים.** זרקו חמש דוחות בנק מחמישה חשבונות שונים לתיקייה אחת, ובקשו מ-Claude Code לעבד את כולם. הוא יקרא כל קובץ, יכניס את הטרנזקציות לחשבונות הנכונים, ויאמת את היתרות בסוף. לעשות את זה בממשק האינטרנט היה לוקח שעה של הקלקות.

**ניתוח מותאם אישית.** "באילו חודשים בשנה האחרונה היו ההוצאות הגבוהות ביותר על בידור, ומה היו הטרנזקציות הגדולות ביותר?" לאף אפליקציית תקציב אין כפתור לזה. Claude Code כותב את שאילתת ה-SQL, מריץ אותה ומסביר את התוצאות.

**המרת פורמטים.** הבנק שלכם מייצא CSV מוזר עם עמודות מאוחדות ופורמט תאריכים אירופי? תגידו ל-Claude Code לנקות אותו קודם. הוא ישכתב את הקובץ מקומית, ואז יייבא את הגרסה הנקייה.

**כתיבת סקריפטים.** בקשו מ-Claude Code לכתוב סקריפט Python שאפשר להשתמש בו שוב: "כתוב סקריפט שמייבא CSV של Chase ורושם את כל הטרנזקציות. שמור אותו ב-`~/finances/import-chase.py`." בפעם הבאה פשוט תריצו את הסקריפט ישירות, עם Claude Code או בלעדיו.

## סכמת מסד הנתונים ש-Claude Code עובד מולה

Machine API של Expense Budget Tracker חושף קבוצה קטנה של relations שקל לסוכני AI לעבוד איתם. הרשימה המותרת מתפרסמת על ידי `GET /v1/schema`.

| Table | מה היא שומרת |
|---|---|
| `ledger_entries` | כל טרנזקציית הכנסה והוצאה |
| `budget_lines` | תוכנית התקציב, סכומים לפי קטגוריה ולפי חודש |
| `budget_comments` | הערות על תאי תקציב ספציפיים |
| `exchange_rates` | שערי חליפין יומיים שנשלפים אוטומטית |
| `workspace_settings` | העדפת מטבע הדיווח |
| `account_metadata` | סיווג נזילות של חשבונות |
| `accounts` | VIEW עם יתרות שוטפות לכל חשבון |

לטבלה `ledger_entries` יש עמודות ברורות: `event_id`, `ts`, `account_id`, `amount`, `currency`, `kind`, `category`, `counterparty`, `note`. Claude Code יכול לכתוב פקודות `INSERT` נכונות כבר בניסיון הראשון, כי שמות העמודות מתארים בדיוק מה הן מחזיקות.

## אבטחה ובקרת גישה

לתת ל-Claude Code גישה למסד נתוני ההוצאות שלכם בטוח במסגרת המגבלות של SQL API:

כל שאילתה רצה דרך Postgres Row Level Security. מפתח ה-API קשור למשתמש שלכם, וה-SQL רץ רק מול סביבת העבודה שנבחרה. Claude Code יכול לראות רק את הנתונים שלכם, גם על מסד נתונים משותף.

לכל בקשה מותרת פקודה אחת בלבד. סוגי הפקודות הנתמכים הם `SELECT`, `WITH`, `INSERT`, `UPDATE` ו-`DELETE`. Claude Code לא יכול ליצור או למחוק טבלאות, לא יכול להשתמש ב-transaction wrappers, לא יכול לקרוא ל-`set_config()`, ולא יכול לשלוח הערות SQL או quoted identifiers. SQL API אוכף את זה בצד השרת בלי קשר למה ש-Claude Code מנסה לשלוח.

מפתחות API נשמרים כ-hash של SHA-256, כך שהטקסט הגלוי לעולם לא נשמר במסד הנתונים. אפשר לבטל את המפתחות אחר כך מתוך המוצר. מגבלות הקצב עוצרות שימוש ב-10 בקשות לשנייה ו-10,000 בקשות ביום, עם timeout של 30 שניות ומגבלה של 100 שורות לתגובה.

מפתח ה-API נשאר במשתנה סביבה מקומי. Claude Code קורא אותו מתוך `$EXPENSE_BUDGET_TRACKER_API_KEY` כשהוא שולח בקשות. הוא אף פעם לא צריך להיכנס ל-repo שלכם.

## חלופה מתקדמת: HTTP ישיר בלי התחברות שמותאמת לסוכנים

אם כבר יש לכם ApiKey ארוך-טווח של Expense Budget Tracker, Claude Code יכול לדלג על הגדרת ה-OTP באימייל ופשוט להשתמש במפתח הקיים. במצב הזה עדיין קוראים לאותן נקודות קצה:

- `GET /v1/openapi.json` עבור הסכמה המפורסמת והקריאה למכונה
- `GET /v1/schema` עבור ה-relations המותרים
- `POST /v1/sql` עבור השאילתות עצמן

זה שימושי לסקריפטים יציבים ולסביבות מוגדרות מראש, אבל לרוב האנשים URL ה-discovery יחד עם זרימת ה-OTP הם ההגדרה הפשוטה ביותר.

## תהליך עבודה אמיתי: מעקב הוצאות שבועי ב-10 דקות

Kirill Markin עובד בדיוק כך כבר שנים, וזה מצטמצם לסשן שבועי שנראה בערך כך:

1. מורידים דפי חיוב בנקאיים מכל החשבונות (2 דקות)
2. פותחים את Claude Code ומבקשים ממנו לעבד את הקבצים (3 דקות, Claude Code עושה את העבודה ואתם צופים)
3. בודקים מה Claude Code רשם ומתקנים קטגוריות שגויות (3 דקות)
4. מבקשים מ-Claude Code לאמת שכל יתרות החשבון תואמות לבנק (דקה)
5. אם זה סוף החודש, מבקשים מ-Claude Code להשוות בין הביצוע בפועל לתקציב ולעדכן את התחזית (2 דקות)

אלה 10 דקות בשביל תמונה מלאה של המצב הפיננסי שלכם: כל טרנזקציה מקוטלגת, כל יתרה מאומתת, והתקציב מעודכן. המערכת עובדת כי החלקים המשעממים, ניתוח, קטלוג, הכנסה וחישוב, הם בדיוק מה ש-Claude Code טוב בו, בעוד שחלקי שיקול הדעת, סקירת קטגוריות והחלטה על התאמות תקציב, נשארים אצלכם.

## להתחיל עם Claude Code ו-Expense Budget Tracker

1. [התקינו את Claude Code](https://docs.anthropic.com/en/docs/claude-code) אם עדיין לא עשיתם את זה
2. הירשמו ב-[expense-budget-tracker.com](https://expense-budget-tracker.com/he/) או [ארחו בעצמכם](https://github.com/kirill-markin/expense-budget-tracker) את האפליקציה
3. תנו ל-Claude Code את `https://api.expense-budget-tracker.com/v1/`
4. השלימו את זרימת ה-OTP באימייל ושמרו את המפתח שהוחזר כ-`EXPENSE_BUDGET_TRACKER_API_KEY`
5. שמרו סביבת עבודה ברירת מחדל עבור המפתח הזה
6. הוסיפו `CLAUDE.md` מקומי עם הקטגוריות, החשבונות וכללי העבודה שלכם
7. פתחו את Claude Code בתוך תיקיית הכספים שלכם וזרקו פנימה את דף החיוב הראשון

Claude Code יבדוק את הסכמה, יתאים את הקטגוריות שלכם ויתחיל לרשום טרנזקציות. עברו על התוצאות, תקנו כל מה שנראה לא נכון, ויש לכם מבנה של מעקב הוצאות מבוסס AI שרץ מהטרמינל.

ה-expense tracker הוא MIT licensed ובקוד פתוח מלא ב-[github.com/kirill-markin/expense-budget-tracker](https://github.com/kirill-markin/expense-budget-tracker). Claude Code זמין ב-[docs.anthropic.com/en/docs/claude-code](https://docs.anthropic.com/en/docs/claude-code). שני הכלים חינמיים להתחלה.
