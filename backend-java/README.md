### Backend for the Task Manager App

A backend project developed with **Spring Boot** that exposes a REST API for managing **tasks** and **category**.

It includes:
- ✅ CRUD functionality
- 🧠 Validation with `@Valid`
- ⚙️ Custom exception handling
- 🧪 Unit testing with **JUnit 5** and **Mockito**

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

`TaskManagerBeApplicationTests` uses **Testcontainers** to start a throwaway PostgreSQL container, so Docker must be running.

---

### 🛠️ Tech Stack
- **Language:** Java 21
- **Framework:** Spring Boot 3
- **Database:** PostgreSQL, Flyway migrations
- **Build Tool:** Maven
- **Testing:** JUnit 5, Mockito, Testcontainers
- **Other:** Spring Data JPA, Lombok, Jakarta Validation

---