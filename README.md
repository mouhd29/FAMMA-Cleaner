# FAMMA Cleaner Company LLC

Dubai cleaning operations platform. Built with React, TypeScript, Vinext and Cloudflare D1 via ChatGPT Sites.

## Working features

- Customer records and service addresses
- Booking creation with services, Dubai dates/times, cleaner count and selling rates
- Daily schedule, booking search and stage filters
- Cleaner assignment with server-side overlap checks
- Internal hourly cost snapshots and approved actual hours per cleaner
- Machinery, transport and material charges and direct costs
- Completed booking to immutable sales invoice
- Tax configuration, partial payments and payment history
- Printable invoices / browser Save as PDF
- Job profitability reports with Excel-compatible CSV export
- Company settings and JPEG/PNG/WebP logo upload
- Responsive navy, turquoise and white interface
- D1 persistence and optimistic revision checks to prevent concurrent overwrites

## Access and first-release scope

The hosted app is private to its owner through Sites authentication. This release is an office application. External client booking access, employee role accounts, Arabic translations, recurring bookings, equipment/vehicle resource calendars, per-cleaner clock-in/out, invoice voiding and record deletion are not implemented. Do not change the Site audience to public: office APIs rely on its owner-private access boundary.

Approved hours currently apply equally to all cleaners on a booking. Use separate bookings for workers with different durations. Unassigned job profit is only an incomplete estimate. Tax is configurable and defaults to 0 until company settings are confirmed. Sample rate AED 35/hour is editable.

Money is rounded to 2 decimals. Invoiced revenue and direct costs exclude tax; gross profit is before overheads. Invoice company/customer/rate snapshots do not change when settings change. Invoiced jobs are locked.

## Develop

Node >=22.13.0. Install with `npm ci` (or the Sites dependency helper). Run `npm run dev`.

Set `.openai/hosting.json` D1 binding to `DB`. Generate schema migrations with `npm run db:generate`; deploy through Sites to apply hosted migrations. The production database is separate from local preview data.

Checks:

```
npx tsc --noEmit
node --experimental-strip-types --test tests/model.test.mjs
npm run build
```

Tests cover illustrative job totals, overlap detection, required staff/hour approval, immutable invoices, duplicate invoice protection, tax and payments. Browser QA verified customer → cleaner → booking → completion → invoice → partial payment.

No credentials or customer data belong in this public GitHub repository. `.sites-runtime`, `.wrangler` and `.env*` must remain ignored.

## Credit notes / invoice returns

Issue partial or full remaining credits from an invoice or the Credit notes page. Each numbered CN document keeps the original invoice reference, company/customer snapshots, date, reason and original tax allocation. Credits cannot exceed the remaining original subtotal. Invoice balances, net sales, job gross profit and CSV reports account for credits; actual job costs and original payments remain unchanged. Overpayments appear as customer credit due. This feature does not execute or record cash refunds. Existing stored workspaces without creditNotes load compatibly.

Validation: 8 model tests and TypeScript/production builds passed. Browser preview for this change was blocked by browser URL security policy, so current visual layout was not browser-verified.
