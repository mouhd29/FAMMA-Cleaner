# FAMMA Cleaner Company LLC

Dubai, UAE — cleaning bookings and operations platform.

## Project status

Initial specification only. Application code and deployment are not yet implemented.

## Core workflow

Customer bookings → staff scheduling → actual working hours → sales invoices → job gross profit.

Booking stages: Requested → Confirmed → Assigned → In progress → Completed → Invoiced.
Payment status is separate: Unpaid, Partially paid, Paid.

## Modules

| Module | Scope |
| --- | --- |
| Dashboard | Today's bookings, available cleaners, sales, unpaid invoices, job gross profit |
| Customers | Name, mobile, email, service addresses, booking history |
| Client booking page | Service, location, date, time, cleaner count, hours, estimated price |
| Booking calendar | Cleaner, machinery and transportation assignments; overlap detection |
| Labor costs | Internal hourly cost per cleaner, separate customer selling rates |
| Job tracking | Arrival, start, finish, approved billable hours |
| Additional charges | Machinery hourly/fixed, transportation per trip, materials, extras |
| Sales invoices | Generate from completed bookings, approve charges, payments, printable PDF |
| Reports | Sales, outstanding balances, utilization, job costs and gross profit |
| Administration | Company details, logo, services, rates, tax settings, staff permissions |

## Pricing rules

- Currency: AED. Business timezone: Asia/Dubai.
- Labor-hours = number of cleaners × hours per cleaner; actual hours may differ by cleaner.
- Keep agreed selling rates and internal cost snapshots on each job so later rate changes do not change historical jobs.
- Calculate customer charges from approved billable hours and agreed rates.
- Calculate actual labor costs from each cleaner's approved worked hours and internal cost snapshot.
- Track selling charges and internal costs separately for machinery, transportation and materials.
- Job gross profit = revenue before tax minus direct job costs, before overheads.
- Internal costs and profit are visible only to authorized staff; customer views contain customer charges only.
- Tax settings must be configurable and confirmed before issuing production invoices.

### Illustrative example (not confirmed business rates)

| Item | Customer charge (AED) | Internal cost (AED) |
| --- | ---: | ---: |
| Cleaning: 2 cleaners × 4 hours; selling 35/hour, cost 15/hour | 280 | 120 |
| Machinery: fixed | 60 | 25 |
| Transportation: one trip | 40 | 30 |
| Total before tax | 380 | 175 |

Estimated job gross profit: AED 205 before overheads.

## Design and language

Navy, turquoise and white; responsive office dashboard and mobile-friendly customer booking page. Plan English and Arabic support with right-to-left layouts.

## Implementation roadmap

1. Company settings, staff permissions, customers, services and rate setup.
2. Customer booking page, office calendar, resource assignment and overlap validation.
3. Actual time entry and approval; job charge and cost calculations.
4. Invoices, partial payments, PDF printing and job gross profit reports.
5. Recurring bookings, customer-specific rates and expanded reporting.

## Decisions to confirm

Actual hourly selling rates and cleaner costs; minimum booking hours; rounding and overtime; cancellation rules; tax registration/settings; user roles; recurring booking rules.

Never commit credentials, customer records or employee private information to this repository.
