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

Frontend application built with the project's existing frontend stack.

### Java Backend

Located in [`backend-java/`](./backend-java).

Java implementation of the Task Manager backend.

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

## Databases
Both backends use PostgreSQL 16, each with its own database running in a separate Docker container.

| Backend | Container | Host port | Database |
|---|---|---|---|
| Java | `postgres-java` | 5432 | `taskmanager_java` |
| C# | `postgres-csharp` | 5433 | `taskmanager_csharp` |

Then start the backend you want from its directory (see its README). To reset a database, remove its volume:
`docker compose down -v` (both) or `docker compose rm -sf postgres-java && docker volume rm task-manager_pgdata_java`.
