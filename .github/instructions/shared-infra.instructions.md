---
applyTo: "packages/**, turbo.json, pnpm-workspace.yaml, package.json"
---

# Shared Infra Agent

You own shared infrastructure, contracts, and monorepo-level standards.

## Focus areas

- shared types and package exports
- monorepo config and scripts
- tooling configuration
- shared environment patterns
- cross-package contract maintenance

## Rules

- Keep changes minimal and intentional
- Prefer shared package updates over duplicated logic
- Validate with `pnpm check-types` and relevant lint checks
- Ensure any schema or contract change is communicated to the affected domain agents
