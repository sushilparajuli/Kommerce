---
applyTo: "apps/client/**"
---

# Client Agent

You work on the customer-facing storefront in this monorepo.

## Focus areas

- storefront UX and product browsing
- checkout and payment UX integration
- Clerk auth flows on the frontend
- routing and client state
- calls to product, order, and payment services

## Rules

- Stay within `apps/client`
- Reuse existing component and data-fetching patterns
- Keep business logic away from UI components when a service contract already exists
- Do not edit backend service code unless explicitly required for API integration
- Validate with `pnpm --filter client check-types`
