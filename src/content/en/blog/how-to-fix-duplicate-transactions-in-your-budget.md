---
title: "How to Fix Duplicate Transactions in Your Budget"
description: "Find duplicate budget entries, keep genuine repeat purchases, and check your balance after cleanup with a worked example and a clear review checklist."
date: "2026-09-21"
image: "/blog/fix-duplicate-budget-transactions.png"
keywords:
  - "duplicate transactions in budget"
  - "duplicate bank statement import"
  - "remove duplicate expenses"
  - "match manual and imported transactions"
---

You record a grocery receipt, import your bank statement later, and suddenly Groceries includes the same shopping trip twice. Meanwhile, two identical café charges really were two visits. Deleting every repeated amount would fix one mistake and create another.

To fix **duplicate transactions in your budget**, compare suspected entries with the original account activity, keep one complete record of each real movement, and verify the account balance and category totals afterward. Matching dates and amounts help find candidates. They don't prove that an entry should disappear.

![One blue ceramic bowl appears in a mirror while a craftsperson arranges two separate matching bowls beside it](/blog/fix-duplicate-budget-transactions.png)

## Find the evidence before changing the entries

Start with one account and a closed statement period. Keep the original statement, relevant receipts, and a copy or export of the ledger rows you're about to change, including their IDs and notes. Record the ledger balance at the statement's closing date and the affected category totals for that period. Today's balance may include later activity.

Look for overlapping import dates, manual entries followed by imports, or a receipt entered twice. A duplicate bank statement import can repeat all or part of a batch.

A stable bank transaction ID, within the same account and source, is useful evidence. Where there is no ID, compare account, currency, signed amount, purchase and posting dates, raw bank description, and receipt or order references. A CSV row number identifies a line in one particular file; it isn't a permanent transaction ID across different exports.

Some tools already match manual and imported transactions. Actual Budget checks imported IDs, then dates, amounts, and payees. Check your own tool's behavior before relying on automatic matching. [Actual's import documentation](https://actualbudget.org/docs/transactions/importing/) explains its approach.

Leave uncertain candidates unchanged.

## One duplicate, two real coffees

Here's a hypothetical USD checking account. Its last trusted balance is **$1,000**, and its bank statement ends at **$843**. These are all the ledger movements between those two checkpoints; there are no pending transactions in this example.

| Ledger ID | Date | Entry and source | Signed amount | Category or purpose |
| --- | --- | --- | ---: | --- |
| L101 | Sep 14 | Green Market, manual entry from receipt R73 | −$45 | Groceries |
| L102 | Sep 15 | GREEN MKT, statement reference B501 | −$45 | Groceries |
| L103 | Sep 16 | Corner Café, statement reference B502 | −$6 | Eating out |
| L104 | Sep 16 | Corner Café, statement reference B503 | −$6 | Eating out |
| L105 | Sep 17 | Transfer to tracked savings, reference B504 | −$100 | Internal transfer |

The statement contains one $45 grocery payment, two $6 café payments, and one $100 transfer. Receipt R73 and the grocery order details confirm that L101 and L102 describe that single purchase. The one-day difference is purchase date versus posting date.

The café payments have separate bank references and separate receipts: one morning visit and one afternoon visit. Both stay. The transfer stays too, with its corresponding +$100 entry on the savings account; it doesn't count as spending.

For this example, keep L102 with the posted date and bank reference. Preserve L101's purchase date, receipt reference, and note on the retained record or in supported linked records. Verify that detail is saved before removing L101. If the two dates fall in different budget months, also review which month's category total the retained entry affects.

The balance check makes the effect visible:

```text
Before: $1,000 − $45 − $45 − $6 − $6 − $100 = $798
Remove duplicate L101: $798 − (−$45) = $843
After:  $1,000 − $45 − $6 − $6 − $100 = $843
```

Removing a negative $45 entry increases the calculated account balance by $45. It doesn't add income or return money from the shop.

Category totals need a separate check:

| Category | Before cleanup | After cleanup |
| --- | ---: | ---: |
| Groceries | $90 | $45 |
| Eating out | $12 | $12 |
| **Total spending** | **$102** | **$57** |

The $100 transfer affects checking's balance but neither spending total. Deleting one café entry would incorrectly reduce Eating out to $6 and push checking to $849. A smaller expense total isn't evidence of a correct budget.

## Give each candidate a decision

Record a decision and expected effect for each candidate. This table includes an unresolved case outside the example dataset.

| Candidate rows | Decision | Evidence and reason | Proposed effect |
| --- | --- | --- | --- |
| L101 and L102 | Keep L102; remove L101 after preserving its detail | One posted payment; receipt and order match | Checking +$45; Groceries spending −$45 |
| L103 and L104 | Keep both | Two posted payments and two separate receipts | No change |
| L105 and its savings counterpart | Keep both | Two account legs of one real transfer | No change |
| Another same-price pair without source evidence | Review | Similarity alone doesn't establish one purchase | No change until resolved |

Add account, currency, source-file references, and linked row IDs to your own table. If your tool offers merging, check which fields survive before using it. For example, [Actual's merge rules](https://actualbudget.org/docs/transactions/merging/) copy values into empty fields of the kept transaction. That doesn't combine two different existing notes, so preserve any detail the merge would lose.

## Some lookalikes need a different treatment

**A payment and refund have opposite signs.** Keep both actual movements. Netting them to zero or deleting the pair loses the purchase and refund history, especially when they fall in different months.

**Different accounts or currencies need their own evidence.** Two matching numbers can be transfer legs, a credit-card purchase and its later payment, or unrelated purchases. The [transfer guide](/blog/do-bank-transfers-count-as-expenses/) explains how to separate account movements from consumption.

If an entire transfer was entered twice, review both accounts before changing either. The result should retain one real outgoing movement and its real incoming counterpart. Removing only one leg of a duplicated pair leaves the other account wrong.

**A pending authorization and a posted payment aren't automatically two completed charges.** Compare the same posted cutoff first, and review the pending item separately. Don't delete a settled payment just because a pending display resembles it.

**A split purchase can span several rows.** A $45 payment divided into $30 Groceries and $15 Household should total $45 once. Match the bank payment to the whole linked group. Deleting a category row because it resembles another entry damages the allocation; keeping an additional full $45 expense doubles the purchase. Follow the [split-transaction guide](/blog/how-to-split-a-transaction-across-budget-categories/) when reviewing those groups.

If the bank actually posts two charges for one intended purchase, your budget should reflect both real account movements while you resolve the issue with the merchant or bank. A later reversal gets its own entry. Deleting the second charge from your budget won't change what left the account.

## Review cleanup with an agent in Expense Budget Tracker

In Expense Budget Tracker, ask an agent for a **read-only candidate review first**, using the account, period, evidence, and table above. The product doesn't automatically deduplicate bank activity.

The agent must confirm the workspace and current schema. For direct HTTP access, the [API reference](/docs/api/) documents separate read and write endpoints: 100 returned rows per request, and 100 affected rows per mutation statement and request. A full 100-row result may be only part of the period. Have the agent read the remaining records before declaring the review complete.

Before approving any write, review the exact row IDs, linked event rows, metadata to retain, proposed changes, and expected balance and category effects. In this product, split rows share an `event_id`; inspect the whole event rather than treating each row as an independent purchase. Transfers also require checking the affected accounts together.

After the approved changes, query the affected records again, verify preserved details, and recalculate the balances and category totals. Stop if the result differs from the preview. Don't add a balancing entry to hide the gap.

## Finish at the same bank cutoff

Compare the corrected account with the statement's closing balance using the same date and posted-transaction scope. Then check each affected category and confirm that every real source movement is still represented once, including linked splits and transfers.

A matching balance alone can hide offsetting mistakes. Keep the review table with the source evidence so you can explain both what changed and why. If a difference remains, use the [reconciliation guide](/blog/how-to-reconcile-your-budget-with-your-bank-balance/) to investigate it.

Before the next import, preserve the matches in your [statement import plan](/blog/how-to-import-bank-statements-into-an-expense-tracker/) so the same purchase isn't added again.
