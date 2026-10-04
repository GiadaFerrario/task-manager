# Task Manager

Monorepo containing the frontend and backend implementations of the Task Manager application.

## Structure

```text
task-manager/
├── frontend/          # Frontend application
├── backend-java/      # Java backend
└── backend-csharp/    # ASP.NET Core backend
```

## Projects

### Frontend

Located in [`frontend/`](./frontend).

React + TypeScript single-page app (Vite, Material UI, Storybook) to manage tasks and categories.

### Java Backend

Located in [`backend-java/`](./backend-java).

Spring Boot REST API with Spring Data JPA, Flyway migrations and PostgreSQL.

### C# Backend

Located in [`backend-csharp/`](./backend-csharp).

ASP.NET Core Web API using Entity Framework Core and PostgreSQL.

## Repository

This repository consolidates the history of the original frontend and backend repositories into a single monorepo.

## Quick start

The frontend works with either backend (same API contract). Prerequisites: Docker, Node 20+, and JDK 17 (Java backend) or .NET 8 SDK (C# backend).

**1. Database** (from the repo root)

```bash
cp .env.example .env      # set your own credentials; .env is git-ignored
docker compose up -d --wait
```

**2. Backend** (pick one)

```bash
# Java: http://localhost:8080
cd backend-java
set -a; source ../.env; set +a      # exports POSTGRES_USER / POSTGRES_PASSWORD
./mvnw spring-boot:run
```

```bash
# C#: http://localhost:5213 (Swagger UI at /swagger)
cd backend-csharp
dotnet user-secrets set "ConnectionStrings:Default" \
  "Host=localhost;Port=5433;Database=taskmanager_csharp;Username=<POSTGRES_USER>;Password=<POSTGRES_PASSWORD>" \
  --project task-tracker.csproj                      # first time only
ASPNETCORE_ENVIRONMENT=Development dotnet run --project task-tracker.csproj --urls http://localhost:5213
```

**3. Frontend** (http://localhost:5173)

```bash
cd frontend
npm install
npm run dev
```

It calls the Java backend by default. For the C# backend, create `frontend/.env.local` with `VITE_API_URL=http://localhost:5213/api`.

See each project's README for details (tests, migrations, configuration).

## API contract

Both backends expose the same REST API under `/api`, so the frontend works with either of them.

| Method | Path | Description |
|---|---|---|
| GET / POST | `/tasks` | List / create a task (always created as `TODO`) |
| GET / PUT / DELETE | `/tasks/{id}` | Read / replace / delete a task |
| PATCH | `/tasks/{id}/status?status=` | Change the status |
| PATCH | `/tasks/{id}/priority?priority=` | Change the priority |
| PATCH | `/tasks/{id}/category?categoryId=` | Change the category |
| GET / POST | `/categories` | List / create a category |
| PUT / DELETE | `/categories/{id}` | Update / delete a category (its tasks are kept, without category) |
| GET | `/statuses`, `/priorities` | Enum values as `{ "name", "label" }` |

Shared conventions:
- Enums are `UPPER_SNAKE_CASE` strings: status `TODO` / `IN_PROGRESS` / `DONE`, priority `LOW` / `MEDIUM` / `HIGH`. Priority and category are optional (`null`).
- A task includes its category as `categoryId`, `categoryName` and `categoryColor`.
- `PUT /tasks/{id}` replaces the task: a missing priority or category is cleared.
- Errors have the same body: `{ "status", "error", "message", "path" }`. Invalid input (blank title or name, unknown enum value) is a `400`; an unknown task or category is a `404`.

## Tests

Backend tests run the real application on a throwaway PostgreSQL started by **Testcontainers**, so Docker must be running (the databases of the Quick start are not touched).

```bash
cd backend-java && ./mvnw test                    # JUnit 5, Mockito, MockMvc
cd backend-csharp && dotnet test TaskTracker.sln  # xUnit, WebApplicationFactory
```

Both suites check the same contract (see above), which keeps the two backends interchangeable.

## Databases
Both backends use PostgreSQL 16, each with its own database running in a separate Docker container.

| Backend | Container | Host port | Database |
|---|---|---|---|
| Java | `postgres-java` | 5432 | `taskmanager_java` |
| C# | `postgres-csharp` | 5433 | `taskmanager_csharp` |

To reset a database, remove its volume:
`docker compose down -v` (both) or `docker compose rm -sf postgres-java && docker volume rm task-manager_pgdata_java`.
