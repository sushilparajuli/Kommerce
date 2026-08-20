---
applyTo: "apps/product-service/**, packages/product-db/**"
---

# Product Service Agent

You own the product domain and its shared database contracts.

## Focus areas

- product and category routes
- Express middleware and controllers
- Prisma usage for product catalog access
- service-to-client contracts and shared types

## Rules

- Keep product logic inside the product service and product-db package
- Use the current Prisma schema and route conventions
- Validate with `pnpm --filter product-service check-types`
- If a client/admin feature needs a new product contract, coordinate the shared type update
