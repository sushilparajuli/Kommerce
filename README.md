# E-Commerce Monorepo

This repository is a modular e-commerce platform built as a Turborepo monorepo. It combines a Next.js storefront, an admin dashboard, and multiple backend services that work together through shared libraries, authentication, and event-driven messaging.

## Overview

The system is split into clear domains:

- Frontend apps for customer shopping and admin operations
- Domain services for products, orders, and payments
- Shared packages for database access, Kafka integration, and common types
- Event-driven communication for decoupled service interactions
- Agent-based coordination using domain-specific instructions and a repo-level orchestrator

This follows a service-oriented architecture inside a single monorepo, with each service owning a bounded responsibility while sharing configuration and type contracts across the workspace.

## Architecture Pattern

### Agentic workflow model

This repo is designed to work well with an agentic multi-agent setup:

- an orchestrator agent routes the task to the correct domain
- domain agents operate inside their service or app boundary
- shared packages hold common contracts and infrastructure logic
- verification is required before work is considered complete

This pattern scales better than a single broad agent because each unit has a clear owner, responsibility, and validation target.

### 1. Monorepo + workspace packages

The project uses Turborepo with pnpm workspaces. Shared code is centralized in packages and consumed by app/service packages through workspace dependencies.

This pattern keeps the codebase organized by responsibility instead of merging everything into one application.

### 2. Frontend / backend separation

- `apps/client`: customer-facing storefront built with Next.js
- `apps/admin`: admin dashboard built with Next.js
- `apps/product-service`: Product domain API using Express
- `apps/order-service`: Order domain API using Fastify
- `apps/payment-service`: Payment/session orchestration service using Hono

Each app/service has a clear boundary and its own runtime, making it easier to scale, deploy, and evolve independently.

### 3. Shared infrastructure packages

- `packages/product-db`: Prisma + PostgreSQL integration for product and catalog data
- `packages/order-db`: MongoDB integration for order-related persistence
- `packages/kafka`: Kafka producer/consumer client utilities
- `packages/types`: shared TypeScript contracts and domain models
- `packages/eslint-config` and `packages/typescript-config`: shared linting and TypeScript config

This reduces duplication and enforces a common contract across services.

### 4. Event-driven integration

The backend services communicate using Kafka for asynchronous events and subscriptions. This is a classic event-driven architecture pattern where services publish business events and react to them without requiring tight, synchronous coupling.

The pattern supports:

- independent service execution
- decoupled workflows for order/payment events
- easier extensibility as new consumers are added

### 5. Authenticated domain services

The backend APIs use Clerk authentication middleware to protect routes and validate user access where necessary. This keeps authentication concerns consistent across domain services without forcing all logic into the frontend clients.

## Repository Structure

```text
.
├── apps/
│   ├── admin/                 # Admin dashboard (Next.js)
│   ├── client/                # Customer storefront (Next.js)
│   ├── order-service/         # Order domain service (Fastify)
│   ├── payment-service/       # Payment/session service (Hono)
│   └── product-service/       # Product domain service (Express)
├── packages/
│   ├── eslint-config/         # Shared ESLint config
│   ├── kafka/                 # Kafka client utilities
│   ├── order-db/              # MongoDB connection and models
│   ├── product-db/            # Prisma client + schema
│   ├── types/                 # Shared TS types
│   └── typescript-config/     # Shared tsconfig presets
├── package.json               # Root workspace scripts
├── pnpm-workspace.yaml        # Workspace config
├── turbo.json                 # Turborepo task orchestration
├── README.md                  # Project documentation
└── pnpm-lock.yaml             # Dependency lockfile
```

## Tech Stack

### Frontend & UX

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui style components
- Recharts for admin dashboards and analytics
- Zustand for client-side state management
- Clerk for authentication and user identity
- Stripe for checkout/payment flow integration

### Backend & APIs

- Express for product API layer
- Fastify for order API layer
- Hono for payment/session services
- Node.js runtime
- TypeScript across all services
- Kafka for async messaging and event distribution
- Prisma for relational product data access
- MongoDB for order persistence
- PostgreSQL via Prisma/Postgres integration in product domain
- CORS, middleware patterns, and route-based API organization

### Data & Infrastructure

- pnpm workspaces and Turborepo
- Prisma schema and migrations
- PostgreSQL for catalog/product domain
- MongoDB for order domain
- Kafka topics and subscriptions for service communication
- Shared package contracts for common domain types

## Domain Coverage

This project covers the core domains of a commerce platform:

### Product domain

- product catalog management
- category management
- product listing and filtering
- product metadata and inventory-oriented operations

### Order domain

- order creation and processing
- order persistence and lifecycle tracking
- order-related API workflows
- commerce event handling around transactions

### Payment domain

- Stripe-based payments
- checkout/session management
- payment-related webhooks and flows
- event-driven follow-up processing

### User & auth domain

- Clerk-based authentication
- user identity verification
- protected routes and service-level auth middleware

### Admin domain

- dashboard pages for analytics and management
- product and user management interfaces
- business oversight for commerce operations

### Customer experience domain

- storefront browsing
- frontend flows for shopping and checkout
- client-side app state and UI interactions

## Multi-Agent Ownership Model

The repo is organized to support domain-based agents.

### Orchestrator agent

- decides which domain owns a task
- breaks work into manageable units
- coordinates cross-service contract updates
- ensures verification happens before completion

### Client agent

Scope: `apps/client/**`

- storefront UX and customer flows
- frontend auth and payments integration
- product browsing and checkout UI

### Admin agent

Scope: `apps/admin/**`

- admin dashboards and management screens
- reporting and business-facing interfaces

### Product service agent

Scope: `apps/product-service/**` and `packages/product-db/**`

- product/category APIs
- Prisma access and product data logic

### Order service agent

Scope: `apps/order-service/**` and `packages/order-db/**`

- order lifecycle, Mongo persistence, and event handling

### Payment service agent

Scope: `apps/payment-service/**`

- Stripe and session flows
- payment webhooks and service-side auth

### Shared infra agent

Scope: `packages/**`, root config files, and workspace tooling

- shared types
- package contracts
- build and monorepo configuration

## Core Workflows

### Customer app

The client app is responsible for storefront experiences, product browsing, authentication, and checkout flows.

### Admin app

The admin app acts as an internal dashboard for managing products, users, orders, and reporting.

### Product service

Handles product and category operations, with database access through the Prisma-backed product DB package.

### Order service

Owns order processing and order persistence, using Fastify and MongoDB.

### Payment service

Coordinates payment and session-related flows, using Hono and Stripe with Kafka integration for downstream processing.

## Development Workflow

From the root of the repository:

```bash
pnpm install
pnpm dev
```

This runs the monorepo apps/services through Turbo. You can also target a specific app or service with filters if needed.

Examples:

```bash
pnpm --filter admin dev
pnpm --filter client dev
pnpm --filter product-service dev
pnpm --filter order-service dev
pnpm --filter payment-service dev
```

## Build and Type Check

```bash
pnpm build
pnpm lint
pnpm check-types
```

## Agent Working Rules

- each task should be routed to the domain that owns it
- agents should not edit outside their domain unless a shared contract requires it
- verification must happen with the smallest relevant command
- secrets should remain in local `.env` files and example values should live in `.env.example`
- shared package changes should be reviewed before downstream services are updated

## Notes

- This project intentionally favors modular service boundaries over a single app architecture.
- Shared packages are used for data access and contract reuse across services.
- Kafka and event-driven messaging are central to the integration pattern.
- The codebase is designed to be extensible for future services, more domains, and additional operational tooling.
- The repo is structured to support scaling with a multi-agent workflow without losing service ownership or contract clarity.

## Recommended Mental Model

Think of the system as:

- a monorepo shell for organization
- multiple small apps/services for domain ownership
- shared packages for cross-cutting infrastructure
- event-driven communication for loose coupling

This is a strong pattern for building a scalable commerce platform where frontend, admin, and domain APIs evolve at different speeds while sharing common contracts and infrastructure.
