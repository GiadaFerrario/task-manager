### Backend for the Task Manager App

A backend project developed with **ASP.NET Core** that exposes a REST API for managing **tasks** and **categories**.

It includes:
- ✅ CRUD functionality
- 🧠 Input validation in the endpoints: `400` for blank titles/names and invalid enum values, `404` for unknown resources, same JSON error body as the Java backend
- ⚙️ Enum handling for task status and priority (serialized as strings)
- 🔗 Task ↔ Category relationship via EF Core
- 🧪 Integration tests with **xUnit**, `WebApplicationFactory` and **Testcontainers**

Data is stored in **PostgreSQL** via Npgsql; the schema is managed with **EF Core migrations** (`Migrations/`), applied automatically on startup in Development.

#### Run

```bash
docker compose up -d --wait postgres-csharp   # from the repo root
dotnet run --project task-tracker.csproj
```

The connection string contains credentials, so it is **not** in `appsettings.json`. Store it once with .NET user secrets (kept outside the repo):

```bash
dotnet user-secrets set "ConnectionStrings:Default" \
  "Host=localhost;Port=5433;Database=taskmanager_csharp;Username=<POSTGRES_USER>;Password=<POSTGRES_PASSWORD>" \
  --project task-tracker.csproj
```

or set the `ConnectionStrings__Default` environment variable (e.g. in production). The app fails at startup if it is missing. CORS origins are configured in `appsettings.json` (`Cors:AllowedOrigins`).

Enums are serialized as `UPPER_SNAKE_CASE` (`TODO`, `IN_PROGRESS`, `DONE`) to match the Java backend and the frontend.

#### Test

```bash
dotnet test TaskTracker.sln
```

Docker must be running: `tests/TaskTracker.Tests` starts the real application (`ApiFactory`) on a throwaway PostgreSQL via **Testcontainers**, applies the EF Core migrations and empties the tables before every test.

| Tests | What they cover |
|---|---|
| `TaskApiTests`, `CategoryApiTests` | Create/read/update/delete, PATCH endpoints, validation (`400`), unknown resources (`404`), category deletion keeping its tasks |
| `EnumApiTests`, `WireEnumTests` | Enums exposed and parsed as `UPPER_SNAKE_CASE` |

The test project lives in `tests/` and is excluded from the web project (`task-tracker.csproj`).

#### Change the model

```bash
dotnet tool install -g dotnet-ef
dotnet ef migrations add <Name>
dotnet ef database update
```

Built as a C# rewrite of an existing Java/Spring Boot backend, mirroring its API contract for frontend compatibility.

---

### 🛠️ Tech Stack
- **Language:** C# 12
- **Framework:** ASP.NET Core 8 (Minimal APIs)
- **Database:** PostgreSQL (Npgsql), EF Core migrations
- **Build Tool:** .NET CLI / Rider
- **ORM:** Entity Framework Core
- **Testing:** xUnit, Microsoft.AspNetCore.Mvc.Testing, Testcontainers
- **Other:** DTOs for API contracts, endpoint groups organized by feature

---