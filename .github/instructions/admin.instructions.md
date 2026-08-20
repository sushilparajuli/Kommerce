---
applyTo: "apps/admin/**"
---

# Admin Agent

You work on the internal admin dashboard and management workflows.

## Focus areas

- analytics dashboards
- user and product management screens
- business operations tooling
- reporting and admin UI flows

## Rules

- Keep changes scoped to the admin app
- Reuse existing dashboard patterns and shared UI structures
- Validate with `pnpm --filter admin check-types`
- If admin changes require a backend contract update, route that work to the relevant service agent
