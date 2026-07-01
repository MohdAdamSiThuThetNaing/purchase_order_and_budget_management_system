# Purchase Order & Budget Management System

A full-stack business application for managing organizations, projects, budgets, purchase orders, and multi-level approval workflows, built as a technical assessment.

## Tech Stack

| Layer    | Technology                                              |
| -------- | ------------------------------------------------------- |
| Backend  | Kotlin, Spring Boot 3, Spring Data JPA / Hibernate, JWT |
| Database | PostgreSQL 16, Flyway (migrations)                      |
| Frontend | React + TypeScript + Vite                               |
| Build    | Gradle (backend), npm (frontend)                        |
| Infra    | Docker, Docker Compose                                  |

## Prerequisites

- Docker Desktop (with Docker Compose v2)
- That's it — Gradle, Node, and PostgreSQL all run inside containers; nothing else needs to be installed locally.

## How to Run the Project

1. Clone the repository and copy the environment file:

   ```bash
   cp .env.example .env   # or use the provided .env directly
   ```

2. Start the full stack:

   ```bash
   docker-compose up --build
   ```

   This single command will, in order:

   - Start PostgreSQL and wait for it to become healthy
   - Run Flyway, which applies all database migrations **and** seeds demo data automatically
   - Start the Spring Boot backend once migrations succeed
   - Start the React frontend once the backend is healthy

3. Once everything is up:

   | Service     | URL                          |
   | ----------- | ---------------------------- |
   | Frontend    | http://localhost:5173        |
   | Backend API | http://localhost:8080/api    |
   | Postgres    | localhost:55432 (see `.env`) |

4. To reset the database completely (wipes all data and re-applies every migration from scratch):

   ```bash
   docker-compose down -v
   docker-compose up --build
   ```

### Demo Accounts

Seeded automatically via Flyway migration `9_seed_sample_data.sql`. Replace the placeholder password hashes in that file with real bcrypt hashes (e.g. via Spring Security's `BCryptPasswordEncoder`) before relying on these for login:

| Role     | Email              |
| -------- | ------------------ |
| Admin    | admin@acme.test    |
| Manager  | manager@acme.test  |
| Finance  | finance@acme.test  |
| Employee | employee@acme.test |

## Architecture Overview

```
┌─────────────┐     REST/JSON      ┌──────────────────┐      JDBC      ┌────────────┐
│   React     │ ─────────────────▶ │  Spring Boot 3    │ ─────────────▶ │ PostgreSQL │
│  (Vite, TS) │ ◀───────────────── │  (Kotlin, JPA)    │ ◀───────────── │            │
└─────────────┘                    └──────────────────┘                 └────────────┘
                                            │
                                            ▼
                                     Flyway migrations
                                  (schema + seed data)
```

- **Multi-tenancy**: every domain table is scoped under `organization_id` (directly or transitively through `project_id`). All queries are filtered by the authenticated user's organization at the service layer to enforce data isolation between organizations.
- **RBAC**: roles and permissions are stored in the database (`roles`, `permissions`, `role_permissions`, `user_roles`) rather than hardcoded as enums, so organizations can define custom roles beyond the example set (Admin, Manager, Finance, Producer, Employee).
- **Configurable approval workflow**: `approval_workflows` and `approval_steps` define an ordered, role-gated chain of approval per organization (e.g. Manager → Finance → Producer). `purchase_orders.current_approval_step` tracks where a PO sits in that chain, and every action is recorded immutably in `approval_actions` for audit purposes.
- **Budget consistency**: `budget_lines.remaining_amount` and `purchase_order_items.total` are PostgreSQL **generated columns**, computed by the database rather than the application layer. This guarantees they can never drift out of sync with their source values, directly satisfying the "budget calculations should always remain consistent" business rule.
- **Optimistic locking**: `purchase_orders.version` is wired to JPA's `@Version` to prevent lost updates when two users attempt to modify the same PO concurrently.

## Database

- Schema: 18 normalized tables (see `database/migrations/`), covering organizations, RBAC, projects, vendors, budgets, purchase orders, approval workflow, and notifications.
- Migrations are managed by Flyway under `database/migrations/`, numbered `1` through `9` in dependency order. Migration `9` seeds demo data and is idempotent (safe to re-run without violating unique constraints).
- An ER diagram is available at `docs/er-diagram.png` _(add this before submission — see Known Limitations)_.

## API Documentation

Swagger UI is available at `http://localhost:8080/swagger-ui.html` once the backend is running _(confirm path matches your springdoc-openapi configuration)_.

## Design Decisions & Assumptions

- **Budget structure**: modeled as a flat two-level hierarchy (`budget_categories` → `budget_lines`), matching the assessment's example (Camera → Camera Rental, Lens Rental, Batteries) rather than an arbitrarily-nestable tree, since the spec doesn't call for deeper nesting and a flat model is simpler to reason about and query.
- **Vendors are normalized**, not free-text fields on the purchase order, since organizations realistically reuse the same vendors across many POs.
- **Seed data lives inside the Flyway migration chain** (as `9_seed_sample_data.sql`) rather than as a separately-run script, so the entire environment — schema and demo data — is reproducible with a single `docker-compose up --build` and no manual steps. The tradeoff is that seed data becomes part of permanent migration history; an alternative would be a dedicated one-shot Docker service gated on Flyway's completion, which keeps schema and demo data structurally separate at the cost of an extra manual or scripted step.
- **UUIDs over auto-increment IDs** for all primary keys, to avoid leaking row counts/sequence information and to make IDs safely generatable client-side or across distributed services in future.

## Known Limitations

- Password hashes in the seed data are placeholders and must be replaced with real bcrypt hashes before login will work against seeded users.
- _(Update this section honestly before submission — list anything not yet implemented, e.g. real-time notifications, full test coverage, CI/CD, etc.)_

## Bonus Items Implemented

- [x] Docker / Docker Compose (full stack, single-command startup)
- [x] Optimistic locking (`purchase_orders.version`)
- [ ] Unit / integration tests
- [ ] CI/CD pipeline
- [ ] Audit logging beyond approval actions
- [ ] Real-time notifications
