# Phase 1 (Weeks 1-4): Foundation + Measurement Integrity

## Exit Criteria to Port Fully to Whop

You can port this web app to Whop immediately after **Week 4** if all criteria are green for 7 consecutive days:

1. Event completeness for monetization funnel >= 95%.
2. Checkout started -> webhook activation attribution match >= 90%.
3. Session/auth reliability with no critical auth incident for 7 days.
4. Rate-limit protection working with upgrade prompts and no abuse spikes.
5. Webhook processing lag < 60s p95.

## Week 1 - KPI and event contract freeze

- Define KPI dictionary and owners.
- Freeze event schema (required fields, naming conventions).
- Add anonymous/session IDs to all tracked events.

KPIs:
- Core event completeness >= 90%
- Unknown tier in funnel reports < 5%
- Event ingestion lag < 2h

## Week 2 - Funnel instrumentation

- Instrument paywall shown/clicked/checkout-started events.
- Instrument pricing table views and plan selection clicks.
- Instrument auth success events.

KPIs:
- Paywall -> CTA click visibility 100%
- Checkout started event coverage >= 95%
- Schema violations < 1%

## Week 3 - Billing attribution and risk controls

- Emit webhook analytics events for subscription started/cancelled/payment succeeded.
- Emit rate-limit events and tier headers for diagnostics.

KPIs:
- Checkout -> subscription activation match >= 90%
- Missing plan_id for activated subscriptions = 0%
- Rate-limit false positives < 1%

## Week 4 - Readiness and Whop launch gate

- Validate dashboard and attribution against webhook data.
- Run conversion smoke tests for tier upgrades and cancellations.
- Freeze launch checklist and incident runbook.

KPIs:
- p95 webhook processing < 60s
- 0 critical auth/payment incidents for 7 days
- Funnel dashboard accepted by product + growth owners
