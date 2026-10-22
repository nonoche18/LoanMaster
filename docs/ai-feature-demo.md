# One Northstar story across LoanMaster

Northstar Precision Works is a fictional New York precision manufacturer with 14 years operating. Every screen now uses the same financing request and financial inputs:

- Request: $2,000,000 for equipment purchasing and expansion.
- Revenue: $12,000,000 in FY 2024, $9,840,000 in FY 2025 (18% decline).
- FY 2025 annual cash available before debt payments: $780,000 ($1,020,000 operating cash less $240,000 maintenance capex).
- Existing annual principal and interest payments: $360,000. Cash balance: $850,000.
- Draft application outstanding principal: $1,100,000. Debt schedule: $1,250,000. The intentional $150,000 discrepancy needs reconciliation.
- Latest Q3 2026 income statement and balance sheet are missing from the bundled documents.

The shared profile imports the source figures from `lib/expansion-demo.ts`. Application Review uses those same fictional sources. Banker summaries use the shared company profile. Loan Insights and the existing calculator share scenario state, including principal, rate, term, cash flow and existing annual debt payments. Editing a scenario remains exploratory; Reset to company profile restores the business request.

## Two repayment terms, one requested amount

The former $1.5m alternative has been removed. Both options fund the complete $2m request:

| Option | Amount | Annual rate | Term | Monthly payment | DSCR | Total interest |
|---|---:|---:|---:|---:|---:|---:|
| A — requested financing | $2,000,000 | 8.5% | 7 years | $31,673 | 1.05× | $660,530 |
| B — longer repayment term | $2,000,000 | 8.5% | 10 years | $24,797 | 1.19× | $975,657 |

Monthly payments use deterministic amortization with no fees or taxes. DSCR = $780,000 / ($360,000 + 12 × new monthly payment). B lowers monthly payment by about $6,876 but adds $315,127 in total interest. Neither scenario represents bank pricing or an offer. Both amount inputs remain linked so this comparison always uses one principal amount.

The banker algorithm and real profiles remain the same. Renelus's fit becomes 45% because $9.84m is within the published range up to $10m; Habib and Najieb remain 90% and 85%. These are illustrative public-evidence scores, not approval odds.

## Demo interactions

Documents & Hand-off → AI Application Review: add a revenue explanation, review the debt figures and record a reconciliation note, connect to the existing upload form, mark reviewed tasks, and expand questions to draft responses. Notes record preparation and do not automatically rewrite financial statements or constitute banker acceptance. No live AI or arbitrary-file analysis is performed. Notes remain in memory across navigation; reload clears them.

Loan Readiness → AI Loan Insights: adjust inputs, compare repayment tradeoffs, reset, and continue into the existing calculator below. Missing/invalid inputs receive guidance. All financial calculations use the existing payment functions.

## Run and screenshots

Node.js 24 LTS. On a fresh source checkout run `npm ci`, then `npm run dev`. Open the Local URL shown in the terminal.

At 1440×900, choose Documents & Hand-off for Application Review, or Loan Readiness for Loan Insights. Scroll the panel to the top. Current presentation files:

- `docs/screenshots/ai-application-review.png`
- `docs/screenshots/ai-loan-insights.png`
- `docs/screenshots/northstar-restored-overview.png`
- `docs/screenshots/northstar-restored-banker-match.png`

Build, TypeScript, lint and all 14 tests pass. Browser checks confirmed the shared $2m amount, 90/85/45 fit scores, updated human-friendly banker text, and scenario-rate synchronization with the original calculator. No browser console errors observed.
