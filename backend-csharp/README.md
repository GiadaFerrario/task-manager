### Backend for the Task Manager App

A backend project developed with **ASP.NET Core** that exposes a REST API for managing **tasks** and **categories**.

It includes:
- ✅ CRUD functionality
- 🧠 Validation via model binding and Data Annotations
- ⚙️ Enum handling for task status and priority (serialized as strings)
- 🔗 Task ↔ Category relationship via EF Core

Currently, it uses **SQLite** for simplicity of development, but it can be swapped for **PostgreSQL** in a future version.

Built as a C# rewrite of an existing Java/Spring Boot backend, mirroring its API contract for frontend compatibility.

---

### 🛠️ Tech Stack
- **Language:** C# 12
- **Framework:** ASP.NET Core 8 (Minimal APIs)
- **Database:** SQLite → PostgreSQL (coming soon)
- **Build Tool:** .NET CLI / Rider
- **ORM:** Entity Framework Core
- **Other:** DTOs for API contracts, endpoint groups organized by feature

---