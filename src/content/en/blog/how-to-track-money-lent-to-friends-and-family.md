---
title: "How to Track Money Lent to Friends and Family"
description: "Track money lent to friends and family, partial repayments, and forgiven balances without counting repayments as salary or IOUs as money for bills."
date: "2026-09-16"
image: "/blog/how-to-track-money-lent-to-friends-and-family.png"
keywords:
  - "how to track money lent to friends"
  - "family loan tracker"
  - "money owed to me"
  - "track partial repayments"
  - "loan repayment budget"
---

You lend a friend $300. They return $80, then another $70 a few weeks later. Both deposits reach your bank, but there's still $150 to collect. That remaining balance needs a place in your records without becoming money you count on for rent.

To track money lent to friends and family, keep two connected records: actual cash movements in your budget, and a separate history for each loan. Reduce the amount owed when a repayment arrives or you explicitly forgive part of the loan. Keep promised payments in the schedule until the money reaches you.

![A neighbor returns two borrowed folding chairs while others remain in use across the courtyard](/blog/how-to-track-money-lent-to-friends-and-family.png)

## First, agree on what the money is for

A loan comes with an expectation of repayment. A gift doesn't. Covering a shared dinner and collecting everyone's share is a reimbursement; use the [reimbursable expenses guide](/blog/how-to-track-reimbursable-expenses/) for that situation.

Make sure both people understand the arrangement the same way. The [CFPB's guidance on family lending and borrowing](https://www.consumerfinance.gov/consumer-tools/educator-tools/adult-financial-education/tips-for-managing-family-lending-and-borrowing/) suggests discussing the effect on your finances, whether repayment is expected, when you'll check in, and what happens if circumstances change. Writing down those expectations gives you something concrete to refer to later.

The method below covers small, interest-free personal loans made and repaid in the same currency. It tracks your cash budget and the remaining loan balance. It doesn't calculate interest or address loan contracts, legal rights, or tax treatment.

## Give each loan a reference and a history

A spreadsheet or private note works as a family loan tracker. Assign a separate reference to every loan, including repeat loans to the same person. A payment labeled only “Alex” won't tell you which of two loans it settles.

Start with these fields:

| Field | Example |
| --- | --- |
| Loan reference and borrower | L-01 · Alex |
| Date advanced and currency | July 3, 2026 · USD |
| Original amount | $300 |
| Agreed repayment plan | $100 on July 20, August 20, and September 20 |
| Actual repayments | One dated row per receipt, with its bank reference |
| Amount forgiven | $0 initially; record any later decision and its date |
| Outstanding principal | Amount advanced minus repayments minus forgiveness |
| Status and next check-in | Open · July 21 |

Principal is the money lent, excluding interest. For this interest-free loan:

```text
Outstanding principal = amount advanced − repayments received − amount forgiven
```

Keep the original plan and any dated revisions alongside the payment history. Changing a due date should never change the record of what you've received.

If the loan predates your tracker, establish the confirmed amount still owed at your starting date and keep the earlier receipts. Don't add a cash withdrawal today for money that left your account months ago.

## Track the cash in a separate lending category

Use a budget category such as **Personal lending**. Record the advance there when the money leaves your account. Record each principal repayment in the same category when it arrives, reversing that part of the original outlay.

This is a simple cash-budget method. The category shows money lent and recovered; it doesn't measure consumption like groceries or transport. Keep it separate from those categories when reviewing living costs. Formal accounting for a loan asset is outside this workflow.

In Expense Budget Tracker, `spend` entries have negative amounts for outflows and positive amounts for reversals. A $300 advance is a `-300` entry in Personal lending. An $80 repayment is a `+80` entry in that category. Use the account where the money actually leaves or arrives.

Don't also record the repayment as income. Returning your principal doesn't create earnings, and entering the same receipt twice would overstate your account balance. The amount still owed belongs in the external loan register; this method doesn't create a cash account for the borrower.

## Follow one loan through partial repayments

Suppose your checking account starts at $1,200 and Alex agrees to repay $300 in three $100 installments. All amounts are USD. Every cash movement below uses checking, with no other transactions or fees.

| Date | What happened | Signed Personal lending entry | Principal still owed |
| --- | --- | ---: | ---: |
| July 3 | You lend $300 | `-300 spend` | $300 |
| July 20 | Alex repays $80 | `+80 spend` | $220 |
| August 5 | Alex repays $70 | `+70 spend` | $150 |
| August 20 | No payment arrives on the scheduled date | No cash entry | $150 |
| August 28 | Alex repays $100 | `+100 spend` | $50 |
| September 10 | You explicitly forgive the remaining $50 | No cash entry | $0 |

Give each receipt a row in the budget and a row in L-01's repayment history. Use its bank reference to connect the two. July's payment was $80, so enter $80 and retain the $100 scheduled amount separately. The $20 shortfall is still part of the outstanding balance.

After the August 5 receipt, checking holds $1,050:

```text
$1,200 starting cash − $300 advanced + $80 returned + $70 returned = $1,050
```

At that point, $150 is still owed to you. It isn't in checking. If upcoming bills need $800 and you want to keep a $100 reserve, you have **$150 available for new spending**:

```text
$1,050 cash − $800 reserved for bills − $100 reserve = $150 available
```

The $150 available and the $150 owed happen to match in this example. They are separate amounts. An expected repayment doesn't increase the money available today.

### Why a repayment month can show negative spending

July's lending category shows $220 of net cash outlay: $300 lent minus $80 returned. August has $170 returned and no new advance, so its category actual is **−$170**. The underlying signed `spend` entries are positive; the spending report reverses that sign to show recovered cash as negative spending.

Across July and August, net lending outlay is $50. Keep the repayments on their real dates, even though they reduce a later month's spending total. Moving them back to July would make the dated cash records wrong.

The loan register carries on across months. A new budget month doesn't reset what someone owes you.

## Record a missed payment without changing the balance

On August 20, no money arrives. Leave the outstanding principal at $150, mark the scheduled payment as missed, and note the next check-in or revised agreement. There's no cash transaction to enter.

If you'd included the repayment in a forecast, remove it from that expected date and reconsider any spending that depended on it. A message saying “I'll send it Friday” belongs in the notes until a receipt confirms payment.

When the money arrives, use its actual date and amount. If the borrower has two open loans, confirm how to allocate the payment. The amounts assigned across both loans must add up to the single receipt.

## Forgiveness needs a decision, not another expense

On September 10, you decide to forgive the last $50. Add that amount and date to L-01, with a note of the decision communicated to Alex. The completed record is $300 advanced, $250 repaid, $50 forgiven, and $0 outstanding. Use a status such as **closed — partly forgiven** so you can distinguish it from a fully repaid loan.

Checking stays at $1,150: the starting $1,200 minus the $50 never returned. Forgiveness doesn't move any more cash. The lending category already contains that unrecovered outlay, so recording another $50 expense would count it twice.

Keep overdue and forgiven amounts separate. A late payment, or your belief that repayment is unlikely, doesn't by itself mean you've released the borrower from repayment. You can mark a loan as overdue or uncertain while retaining its outstanding balance.

## Put the manual workflow into practice

In [Expense Budget Tracker](https://app.expense-budget-tracker.com), use the account ledger and a Personal lending spending category with the signs shown above. Keep the loan references, repayment plans, and outstanding amounts in your separate register. This uses the app's general [budget and balance tracking features](/features/); the workflow is manual and doesn't require a dedicated loan module or automatic repayment reminders.

For each receipt, confirm the amount, destination account, and loan reference before updating both records once. If the money first reaches a tracked payment-app balance, record the repayment there. Moving it to checking later is an [internal transfer](/blog/do-bank-transfers-count-as-expenses/), so it doesn't reduce the loan a second time.

At your next [bank reconciliation](/blog/how-to-reconcile-your-budget-with-your-bank-balance/), match the lending entries to actual account movements. Then compare each loan's remaining principal with its repayment and forgiveness history. Start with one open loan: find the original advance, match the receipts, and write down the amount still owed today.
