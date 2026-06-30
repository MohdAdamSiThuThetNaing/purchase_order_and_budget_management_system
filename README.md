# Purchase Order & Budget Management System

An enterprise-grade full-stack web application for managing organizations, projects, budgets, purchase orders, configurable approval workflows, and notifications.

This project is developed as a technical assessment using modern backend and frontend development practices, with a Docker-first development environment.

---

# Technology Stack

## Backend

- Kotlin
- Spring Boot 3
- Spring Security
- Spring Data JPA (Hibernate)
- PostgreSQL
- Flyway Migration
- JWT Authentication
- Gradle

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## Infrastructure

- Docker
- Docker Compose
- PostgreSQL 16
- Flyway
- Git

---

# Project Structure

```text
purchase-order-budget-management-system
│
├── backend
│   ├── src
│   ├── gradle
│   ├── Dockerfile
│   ├── build.gradle
│   └── settings.gradle
│
├── frontend
│   ├── src
│   ├── public
│   ├── Dockerfile
│   └── package.json
│
├── database
│   ├── migrations
│   └── seed
│
├── docs
│   ├── api
│   ├── architecture
│   └── database
│
├── docker
│   ├── nginx
│   ├── postgres
│   └── scripts
│
├── .env
├── docker-compose.yml
└── README.md
```

---

# System Architecture

```text
React + TypeScript
        │
        ▼
 Spring Boot REST API
        │
 Spring Security + JWT
        │
 Service Layer
        │
 Repository Layer
        │
 PostgreSQL
```

---

# Planned Features

## Authentication

- JWT Login
- Refresh Token
- Logout
- BCrypt Password Encryption

## Organization Management

- Create Organization
- Update Organization
- Delete Organization
- Multi-Tenant Isolation

## Project Management

- Project CRUD
- Organization Relationship

## Budget Management

- Budget Categories
- Budget Lines
- Budget Summary
- Budget Tracking
- Remaining Budget Calculation

## Purchase Orders

- Draft Purchase Orders
- Submit Purchase Orders
- Cancel Purchase Orders
- Approval Status
- Purchase Order Items

## Approval Workflow

- Dynamic Multi-Level Approval
- Manager Approval
- Finance Approval
- Producer Approval
- Reject
- Resubmit
- Approval History

## RBAC

Roles

- Admin
- Manager
- Finance
- Producer
- Employee

Permissions

- Manage Users
- Create Purchase Orders
- Submit Purchase Orders
- Approve Purchase Orders
- Reject Purchase Orders
- View Budgets
- Edit Budgets

## Notifications

- Purchase Order Submitted
- Purchase Order Approved
- Purchase Order Rejected
- Budget Exceeded

---

# Backend Architecture

The backend follows a feature-based modular architecture.

Each feature contains:

- Controller
- Service
- Repository
- Entity
- DTO
- Mapper
- Exception

Example:

```text
auth/
organization/
project/
budget/
purchaseorder/
approval/
notification/
user/
role/
permission/
common/
config/
security/
```

---

# Prerequisites

- Docker Desktop
- Docker Compose

No local installation of Java, Gradle, PostgreSQL, or Node.js is required.

---

# Environment Configuration

Create a `.env` file in the project root.

Example:

```dotenv
POSTGRES_HOST=
POSTGRES_PORT=

POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=

SPRING_PORT=
SPRING_PROFILES_ACTIVE=

FRONTEND_PORT=
```

---

# Running the Application

Clone the repository.

```bash
git clone <repository-url>

cd purchase-order-budget-management-system
```

Build the containers.

```bash
docker compose build
```

Start the application.

```bash
docker compose up
```

Or run in detached mode.

```bash
docker compose up -d
```

---

# Application URLs

Backend

```
http://localhost:8080
```

Frontend

```
http://localhost:5173
```

PostgreSQL

```
Host: localhost
Port: 55432

Database: purchase_order_db

Username: postgres

Password: postgres
```

---

# Flyway Migration

SQL migration files are located in:

```text
database/migrations
```

Run migrations:

```bash
docker compose up flyway
```

---

# API Documentation

Swagger UI

```
http://localhost:8080/swagger-ui/index.html
```

OpenAPI

```
http://localhost:8080/v3/api-docs
```

---

# Development Workflow

Start Backend

```bash
docker compose up backend
```

Start Frontend

```bash
docker compose up frontend
```

Start PostgreSQL

```bash
docker compose up postgres
```

Rebuild Images

```bash
docker compose build --no-cache
```

Stop Containers

```bash
docker compose down
```

---

# Business Rules

- Users can only access data within their own organization.
- Purchase Orders cannot be edited after approval.
- Cancelled Purchase Orders cannot be edited.
- Purchase Orders cannot be approved twice.
- Rejected Purchase Orders must be resubmitted before approval.
- Budget calculations remain consistent throughout the workflow.
- Approval workflow is configurable and stored in the database.

---

# Future Enhancements

- Unit Tests
- Integration Tests
- Audit Logging
- Optimistic Locking
- CI/CD Pipeline
- Redis Cache
- Real-Time Notifications (WebSocket)
- Email Notifications
- Dark Mode
- Kubernetes Deployment
- Monitoring (Prometheus & Grafana)

---

# Author

**Adam Si Thu Thet Naing**

Senior Full Stack Developer

- Email: [mohd.adamsw@gmail.com](mailto:mohd.adamsw@gmail.com)
- GitHub: https://github.com/MohdAdamSiThuThetNaing
- LinkedIn: https://www.linkedin.com/in/adamsithu/
