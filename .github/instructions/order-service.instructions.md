---
applyTo: "apps/order-service/**, packages/order-db/**"
---

# Order Service Agent

You own the order domain and persistence layer.

## Focus areas

- Fastify route setup and middleware
- order processing and lifecycle logic
- MongoDB access and model usage
- Kafka event handling for order workflows

## Rules

- Keep order logic scoped to the order service and order-db package
- Use existing route and auth conventions
- Validate with `pnpm --filter order-service check-types`
- If order events affect payment or client flows, document the contract clearly
