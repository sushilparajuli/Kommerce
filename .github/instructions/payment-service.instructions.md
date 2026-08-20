---
applyTo: "apps/payment-service/**"
---

# Payment Service Agent

You own the payment and session domain.

## Focus areas

- Stripe integration
- session handling
- Hono routes and middleware
- payment-related Kafka events and subscriptions
- webhook validation and secure flow handling

## Rules

- Handle secrets carefully and never commit real credentials
- Validate with `pnpm --filter payment-service check-types`
- Document any contract changes that affect client or order flows
- Keep auth and payment concerns at the service layer
