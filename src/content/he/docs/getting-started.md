---
title: תחילת העבודה
description: הירשמו לגרסת הענן או הקימו מופע משלכם בתוך דקות.
---

## גרסת הענן

הדרך המהירה ביותר להתחיל היא עם גרסת הענן המנוהלת:

1. עברו אל [app.expense-budget-tracker.com](https://app.expense-budget-tracker.com)
2. הירשמו עם כתובת האימייל שלכם וקבלו קוד חד-פעמי, בלי סיסמה
3. התחילו לעקוב אחרי ההוצאות שלכם באפליקציית הווב
4. עבור לקוח שתומך ב-MCP, הוסיפו את `https://mcp.expense-budget-tracker.com/mcp` ואשרו את הגישה בדפדפן
5. עבור סוכן מסוף או לקוח HTTP ישיר, התחילו ב-`GET https://api.expense-budget-tracker.com/v1/`

אין צורך בהתקנה או בהגדרת שרת. הנתונים שלכם מבודדים לפי סביבת עבודה באמצעות אבטחת שורות (row-level security) של Postgres.

## גישה מסוכנים ומלקוחות תוכנה

אותו חשבון בענן משמש גם עבור:

- ממשק הווב ב-`https://app.expense-budget-tracker.com`
- [מחבר ה-MCP](/he/docs/mcp-connector/) המתארח ב-`https://mcp.expense-budget-tracker.com/mcp`, עם הרשאת OAuth בדפדפן
- [הגדרת Agent API](/docs/agent-setup/) שמתחילה ב-`GET https://api.expense-budget-tracker.com/v1/`, ולאחריה בקשות HTTP ישירות עם `Authorization: ApiKey <key>`

## אירוח עצמי

אם אתם מעדיפים להפעיל מופע משלכם, עיינו ב-[מדריך לאירוח עצמי](/docs/self-hosting/).

## מצב הדגמה

האפליקציה כוללת גם מצב הדגמה מובנה. השתמשו במתג `All/Demo` שבחלק העליון כדי להתרשם מהממשק עם נתוני דוגמה, בלי צורך במסד נתונים.
