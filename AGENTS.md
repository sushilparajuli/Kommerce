# Agentic Multi-Agent Setup

This repository is structured to support a modular, domain-based multi-agent workflow. Rather than using one broad agent for all work, the system should route tasks to the most relevant specialist agent based on the feature or service boundary.

## Core Principles

1. Domain ownership first
   - Customer experience belongs to the client app
   - Admin operations belong to the admin app
   - Product logic belongs to the product service
   - Order logic belongs to the order service
   - Payment and session logic belongs to the payment service
   - Shared models and infrastructure belong to the shared packages

2. One task, one agent
   - Keep each agent focused on one bounded domain
   - Avoid cross-domain edits unless a contract change is explicitly approved

3. Verification before completion
   - Every agent must validate with the smallest relevant command
   - Never claim success without fresh evidence from type checks, builds, or lint output

4. Secrets stay out of the repo
   - Real credentials must remain in local `.env` files
   - Use `.env.example` placeholders only in tracked files

## Agent Layering

### 1. Orchestrator agent

Role:

- understands the monorepo structure
- identifies which domain owns the request
- breaks the task into smaller work units
- dispatches to the relevant specialized agent
- checks final integration and validation state

Responsibilities:

- route feature requests to the proper domain
- keep work scoped and measurable
- summarize changes and risks before completion
- coordinate shared contract updates across services

### 2. Client agent

Scope:

- `apps/client/**`

Responsibilities:

- storefront flows
- product browsing UX
- checkout flow integration
- Clerk auth on client side
- frontend state, routing, and API consumption

Validation:

- `pnpm --filter client check-types`
- `pnpm --filter client lint`

### 3. Admin agent

Scope:

- `apps/admin/**`

Responsibilities:

- dashboard and analytics pages
- admin CRUD flows
- business reporting screens
- internal management interface work

Validation:

- `pnpm --filter admin check-types`
- `pnpm --filter admin lint`

### 4. Product service agent

Scope:

- `apps/product-service/**`
- `packages/product-db/**`

Responsibilities:

- HTTP routes and controllers for product/category APIs
- Prisma access patterns
- product catalog updates
- contract changes shared with client/admin use cases

Validation:

- `pnpm --filter product-service check-types`

### 5. Order service agent

Scope:

- `apps/order-service/**`
- `packages/order-db/**`

Responsibilities:

- order creation and lifecycle logic
- MongoDB models and persistence
- Fastify route and middleware work
- order-related Kafka events and subscriptions

Validation:

- `pnpm --filter order-service check-types`

### 6. Payment service agent

Scope:

- `apps/payment-service/**`

Responsibilities:

- Stripe session and webhook logic
- Hono routes and middleware
- payment-domain Kafka events
- checkout and transaction integration points

Validation:

- `pnpm --filter payment-service check-types`

### 7. Shared infra agent

Scope:

- `packages/**`
- root config files such as `turbo.json`, `pnpm-workspace.yaml`, `package.json`

Responsibilities:

- shared type definitions
- package contracts
- monorepo tooling and build setup
- shared config and environment patterns

Validation:

- `pnpm check-types`
- `pnpm lint`

## Routing Rules

The orchestrator should decide domain ownership by checking the affected folders and the feature surface.

Examples:

- route change touches `apps/client` => client agent
- route change touches `apps/admin` => admin agent
- route change touches `apps/product-service` or Prisma schema => product service agent
- route change touches `apps/order-service` or `packages/order-db` => order service agent
- route change touches `apps/payment-service` => payment service agent
- route change touches shared types or package config => infra agent

If multiple domains are impacted, the orchestrator should:

- create a task list
- identify the contract boundary
- ensure a shared type or API update is reviewed before code is merged

## Handoff Rules

When an agent needs a change outside its domain:

1. It should identify the contract boundary.
2. It should propose the smallest shared change.
3. It should ask the orchestrator to assign the dependent domain work.
4. It should not silently introduce cross-service coupling.

## Verification Workflow

Each task should end with:

- scope verification
- code-level validation
- domain-specific type check
- final summary with evidence

Minimum examples:

- UI work => client type check
- API route work => service type check
- package model change => affected package and service checks
- payment/security work => explicit human review before finalizing

## Recommended Execution Pattern

1. Orchestrator identifies domain
2. Specialized agent reads only relevant files
3. Agent plans the feature in small steps
4. Agent implements the minimal root-cause fix
5. Agent runs the smallest validation command
6. Orchestrator reviews integration risk and handoff state
7. Final report includes what changed, what was validated, and any follow-up risk

## Success Criteria

A multi-agent setup is working well when:

- no agent edits outside its assigned domain without reason
- shared contracts are obvious and maintained
- services remain loosely coupled
- validation happens per feature and per domain
- humans only approve high-risk work such as secret changes, payment configuration, DB changes, or deployment tasks

## Suggested Future Evolution

As the platform grows, add:

- a release agent for deployment and environment review
- a QA agent for regression checks and smoke tests
- a docs agent for README and architecture updates
- a security agent for secret, auth, and middleware review

This maintains the same modular pattern while scaling the system without creating a single monolithic AI workflow.
