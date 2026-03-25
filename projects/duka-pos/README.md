# Duka POS — Enterprise Migration Plan

This repository hosts Duka POS, a lightweight, offline-first Point of Sale system for Kenyan small retailers (dukas). We are migrating toward an enterprise-grade, TypeScript-first architecture with a scalable folder structure, strong typing, and a modern UI.

## What Duka POS is (MVP context)
- Lightweight, software-only POS targeted at small retail shops and dukas in Kenya
- Core features: sales, inventory, and receipt printing (USB ESC/POS)
- Offline-first with optional online payment flow (M-Pesa) when connected
- One-time license model ($400) for MVP; future enhancements may include cloud features and multi-device sync

## Current MVP status
- Core MVP implemented: Sales register, inventory tracking, receipts (printer path stub), and SQLite-backed data store
- MVP UI scaffold using React; IPC wiring for product and sale flows is in place
- M-Pesa and printer integration are ready as paths to wire but currently implemented as stubs for MVP testing
- Enterprise migration roadmap created and committed

## Tech stack (current MVP + target)
- Runtime: Electron (Windows-first) and Node.js
- Frontend: React 18, TSX planned for enterprise; TailwindCSS
- Database: SQLite via better-sqlite3
- IPC: Electron IPC between main and renderer; strong type layer to be introduced in TS
- Printer: ESC/POS via node-thermal-printer (when wired in)
- Payments: Safaricom Daraja API; offline queue for MPesa;
- Quality: ESLint + Prettier configuration; path aliases; error boundaries

## Enterprise folder structure (planned in TS)
- src/
  - main/                (Electron main processes, TS)
  - renderer/            (React TSX app, TS config)
  - shared/              (types and utilities shared between main and renderer)
    - types/
  - ipc/                 (Typed IPC contracts and handlers)
  - db/                  (Typed DAOs or ORM-like wrappers for SQLite)
  - services/            (Business logic services)
  - hooks/               (React hooks)
  - components/          (Reusable UI components)
  - pages/               (Route-based screens)
  - utils/               (Helper utilities, formatters, etc.)
  - assets/              (Icons, images, design tokens)
- .env, tsconfig.json, eslint.config.js, prettier.config.js

## Prioritized, phased build plan (enterprise)
- Phase 1 — Foundations (2–3 weeks)
  - Introduce TS across the codebase: tsconfig, ESLint, Prettier, path aliases
  - Create enterprise skeleton folders and module boundaries (src/main, src/renderer, src/shared, src/ipc, src/db, src/services, src/hooks, src/components, src/pages, src/utils)
  - Convert MVP bootstrapping to TS (Electron main and renderer entry points)
  - Basic design tokens and a dark/light mode toggle
  - Add type definitions for DB rows, IPC messages, and errors
- Phase 2 — Core Infrastructure (4–6 weeks)
  - Complete actual TS IPC contracts (products, sales, settings, printer, mpesa, export)
  - Migrate DB layer to TS with type-safe DAOs
  - Implement authentication (PIN-based cashier login) and role management (admin vs cashier)
  - Inventory management: full CRUD and stock history
- Phase 3 — MVP Modernization (4–6 weeks)
  - End-of-day reports with charts; exportable dashboards
  - Customer-facing display mode; multi-currency display
  - Audit logs, user activity trails
  - Global design system with component library, data tables, modals, toasts
- Phase 4 — Quality & Readiness (ongoing)
  - E2E tests, unit tests, linting, type checking
  - Production build pipeline, CI, deployment notes
  - Documentation (ARCHITECTURE.md, ROADMAP.md, DECISIONS.md)

## How to run locally (pre-TS migration path)
- Install dependencies: npm install
- Run: npm run dev
- Electron app will boot and seed the local SQLite DB on first run

## Next steps (after this readme is merged)
- Begin Phase 1 TS migration and enterprise folder layout, aligning with the plan above
- Implement strict typing and path aliasing
- Build the enterprise UI with a robust design system and authentication

## Contributing
- Follow the enterprise folder guidelines, add ADRs for decisions, and keep TS typings strict
- Add tests and CI hooks as early as possible

"}