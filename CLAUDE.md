# CLAUDE.md

This project is a multi-app e-commerce monorepo built with Turborepo and pnpm workspaces. Treat it as a modular platform where each application and service owns a distinct domain, while shared packages define infrastructure and contracts.

## Project Purpose

This repository contains:

- a customer-facing storefront in `apps/client`
- an admin dashboard in `apps/admin`
- a product API in `apps/product-service`
- an order API in `apps/order-service`
- a payment/session API in `apps/payment-service`
- shared infrastructure in `packages/*`

The architecture is organized around bounded domains and service boundaries rather than one monolithic app.

## Architecture Pattern

### 1. Monorepo shell

- Root-level `package.json` orchestrates the workspace with Turborepo
- `pnpm-workspace.yaml` defines the member packages/apps
- `turbo.json` controls build, lint, type-checking, and dev task orchestration

### 2. Frontend applications

- `apps/client`: customer storefront and shopping flows
- `apps/admin`: internal business dashboard for management workflows

Both are Next.js apps and should be treated as independent frontend surfaces that consume backend services.

### 3. Backend services

- `apps/product-service`: Express-based product and category API
- `apps/order-service`: Fastify-based order API and order processing
- `apps/payment-service`: Hono-based payment/session service using Stripe

Each service owns its own runtime and domain logic.

### 4. Shared infrastructure packages

- `packages/product-db`: Prisma + PostgreSQL access for product data
- `packages/order-db`: MongoDB connection and order persistence support
- `packages/kafka`: Kafka producer/consumer wrappers
- `packages/types`: shared TypeScript types
- `packages/eslint-config` and `packages/typescript-config`: monorepo standards

### 5. Event-driven integration

Kafka is used to decouple services and support asynchronous workflows. Services should prefer events and subscriptions over direct hard coupling where possible.

### 6. Auth pattern

Use Clerk-based auth middleware for protected routes and user validation. Keep authentication checks in the service layer, not just on the frontend.

## Domain Coverage

This repo covers the main domains of an e-commerce platform:

- Product domain: product catalog, categories, listing, and product operations
- Order domain: order creation, lifecycle, and persistence
- Payment domain: Stripe, checkout/session flows, and payment-related processing
- User/auth domain: Clerk authentication and protected route access
- Admin domain: reporting, dashboards, and management screens
- Customer domain: storefront browsing and UX flows

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui style patterns
- Recharts for dashboard analytics
- Zustand for client state
- Clerk for auth
- Stripe for payment UX

### Backend

- Express
- Fastify
- Hono
- Node.js
- TypeScript
- Kafka
- Prisma
- PostgreSQL
- MongoDB

## Working Rules for Agents

### General principles

1. Keep changes scoped to the relevant feature or domain.
2. Prefer reading the exact feature files before editing.
3. Match the current architecture instead of introducing a new pattern unless necessary.
4. Respect the monorepo boundaries: do not move logic across apps/services without clear reason.
5. Keep shared types and contracts in `packages/types` when used across multiple domains.
6. Never commit secrets. Use `.env.example` files to document required keys.

### Environment and config guidance

- Real secrets belong in local `.env` files only.
- Store example values in `.env.example` files.
- Ignore actual env files using the root `.gitignore`.

### Code quality guidance

- Prefer small, focused edits.
- Reuse existing patterns already used in the service or app.
- Maintain TypeScript correctness and existing middleware conventions.
- Keep service boundaries clear.
- Avoid introducing cross-service dependencies unless they are already part of the platform design.

## Feature Breakdown and Agent Workflow

Use this flow for each feature request.

### Step 1: Clarify the feature boundary

Identify which domain owns the feature:

- customer UI change => `apps/client`
- admin dashboard => `apps/admin`
- product API => `apps/product-service`
- order workflow => `apps/order-service`
- payment/session change => `apps/payment-service`
- shared model contract => `packages/types` or `packages/*/src`

### Step 2: Inspect relevant files

Before patching:

- read the exact route/controller/component involved
- check neighboring files for existing conventions
- confirm whether a shared package or service is already handling the same logic

### Step 3: Plan the implementation

Break the task into small increments:

- data model or contract updates
- service or route work
- frontend view or state updates
- validation and error handling
- verification

### Step 4: Implement minimal root-cause fix

Do not broaden scope. Fix only what is required for the feature or bug.

### Step 5: Verify with the smallest relevant command

Examples:

- `pnpm --filter client check-types`
- `pnpm --filter admin check-types`
- `pnpm --filter product-service check-types`
- `pnpm --filter order-service check-types`
- `pnpm --filter payment-service check-types`
- `pnpm lint`
- `pnpm build`

Prefer the smallest targeted validation that proves the changed behavior.

### Step 6: Summarize the work

Provide a short summary with:

- what changed
- which area/domain it affects
- verification performed
- any follow-up or risk notes

## Required Skills for AI Coding Work

When working in this repo, the agent should be able to handle these competencies:

- Monorepo navigation and multi-package coordination
- Next.js app development and routing
- React component patterns and state flow
- Express API development
- Fastify API development
- Hono service development
- Prisma and relational schema handling
- MongoDB connection and data access patterns
- Kafka producer/consumer integration
- Clerk-based auth and route protection
- Stripe payment integration
- TypeScript cross-package contract design
- Environment management and `.env.example` documentation
- Verification using package-level checks before broad validation

## Recommended Execution Style

Use an agentic, feature-first workflow:

1. identify domain and affected files
2. inspect exact implementation points
3. create a minimal task plan
4. implement one feature slice at a time
5. validate with the most relevant command
6. report concise status and evidence

This project favors modularity, service ownership, and shared contracts. Follow that pattern consistently.

## Important Notes

- Prefer existing framework conventions over introducing new abstractions.
- Keep service-to-service collaboration event-driven where possible.
- Keep frontend and backend responsibilities distinct.
- Preserve the current monorepo organization and naming style.
- Do not expose real credentials or environment values in tracked files.
