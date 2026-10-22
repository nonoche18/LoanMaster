# LoanMaster frontend prototype

A clickable, local-only proposed Bank of America client experience. The company and financial records are fictional; three New York banker profiles are sourced from official public BofA pages. This is a UI prototype, not an approved bank product, credit offer or application.

## Run locally

Use **Node.js 24 LTS** and npm. The original system Node 17 is too old.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. Open this folder in VS Code to edit it. No API keys or environment variables are required.

## Screens

- Overview: request summary, preparation roadmap, open questions and selected banker.
- Business Profile: Business → Financing → Financials → editable Review.
- Banker Match: real public profiles with official portraits, biographies, public phone numbers, source links, search/filters, evidence explanation, selection and comparison of up to three bankers.
- Loan Readiness: separate completeness measures, interactive amount/rate/term/cash-flow scenario, payment, DSCR and illustrative capacity.
- Documents & Hand-off: checklist, session-only uploads, review, discrepancy example, package preview and browser-generated PDF/JSON/ZIP downloads.

Click **Explore sample company** or the reset icon to restore Northstar Precision Works. Select **Start your financing plan** for a blank session-only flow. Fictional demo changes autosave locally; uploaded files never do. Only enter invented information in demo mode.

## Frontend structure

Next.js App Router + React + TypeScript + Tailwind CSS and Lucide icons. `app/workspace.tsx` holds the connected UI, `app/globals.css` the responsive visual system. `lib/models.ts`, `lib/domain.ts`, `lib/data.ts` and `lib/export.ts` separate typed records, calculations, sample company / verified public banker data and browser exports. The domain layer is client-side code, not a backend.

## Checks

```sh
npm run typecheck
npm run lint
npm run build
npm test
```

## Limits and scope

The scope was narrowed to frontend screen design. No backend, authentication, live AI extraction, directory synchronization, bank integration or delivery is implemented. No deployment or contact with bankers. Uploaded files are memory-only and disappear on reload. Sample extraction is a fixed fictional fixture; manual review is required. Fit is deterministic, requiring complete evidence, and is not an approval probability. Sample rates and coverage assumptions are not BofA policy. Revolving credit intentionally has no term-loan calculation. Financial estimates omit fees and taxes.

The complete pilot/business-case and presentation research from the original brief are outside the revised frontend scope. The original repository concept is preserved in `docs/original-concept.md`. Static screen captures are in `docs/screenshots/`.
