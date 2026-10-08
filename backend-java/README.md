### Backend for the Task Manager App

A backend project developed with **Spring Boot** that exposes a REST API for managing **tasks** and **category**.

It includes:
- ✅ CRUD functionality
- 🧠 Validation with `@Valid`
- ⚙️ Centralized exception handling (`GlobalExceptionHandler`): `404` for unknown resources, `400` for invalid input and invalid enum values, one JSON error body
- 🧪 Unit, web-layer and integration tests (**JUnit 5**, **Mockito**, **MockMvc**, **Testcontainers**)

Data is stored in **PostgreSQL**; the schema is versioned with **Flyway** (`src/main/resources/db/migration`) and Hibernate only validates it (`ddl-auto=validate`).

#### Run

```bash
docker compose up -d --wait postgres-java   # from the repo root
set -a; source ../.env; set +a              # exports POSTGRES_USER / POSTGRES_PASSWORD
./mvnw spring-boot:run
```

Credentials are read from the `POSTGRES_USER` and `POSTGRES_PASSWORD` environment variables (the same ones used by Docker Compose), so no secret lives in the repo. The URL defaults to `localhost:5432/taskmanager_java` and can be overridden with `DB_URL`.

The API is public (no user accounts yet): `SecurityConfig` permits all requests, disables CSRF (stateless API) and enables CORS for `http://localhost:5173` (override with `CORS_ALLOWED_ORIGINS`).

#### Test

```bash
./mvnw test
```

Docker must be running: the integration tests use **Testcontainers** to start a throwaway PostgreSQL (one container shared by the whole run, see `AbstractIntegrationTest`).

| Level | Tests | What they cover |
|---|---|---|
| Unit | `TaskServiceTest`, `CategoryServiceTest`, `EnumServiceTest` | Business rules with mocked repositories |
| Web layer | `TaskControllerTest`, `CategoryControllerTest`, `SecurityConfigTest` | Status codes, validation, error body, CORS/CSRF (no database) |
| Integration | `TaskApiIntegrationTest`, `TaskManagerBeApplicationTests` | Full flows on PostgreSQL with the real Flyway schema; each test is rolled back |

---

### 🛠️ Tech Stack
- **Language:** Java 21
- **Framework:** Spring Boot 3
- **Database:** PostgreSQL, Flyway migrations
- **Build Tool:** Maven
- **Testing:** JUnit 5, Mockito, MockMvc, Testcontainers
- **Other:** Spring Data JPA, Lombok, Jakarta Validation

---