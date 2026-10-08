### Frontend for the Task Manager App

A simple frontend application developed with **React** that interacts with the Task Manager REST API to manage **tasks** and **categories**.

It allows users to:
- 📋 View, create, update, and delete tasks
- 🗂️ Organize tasks by category, and create, edit and delete categories
- ⚡ Quickly change task status and priority by clicking the chips on a card

Tasks and categories are created from the **Add Task** / **Add Category** buttons (a dialog form; priority and category are optional, categories get a color from a fixed palette). New tasks always start as *To do*. Clicking a task or a category card opens a dialog to edit it or delete it (deletions ask for confirmation).

---

### 🛠️ Tech Stack
- **Language:** TypeScript
- **Framework:** React + Vite
- **UI Library:** Material UI
- **State Management:** React Hooks / Context API
- **HTTP Client:** Axios
- **Backend Integration:** REST API (Spring Boot or ASP.NET Core)

---

### ▶️ Run

```bash
npm install
npm run dev        # http://localhost:5173
```

The API base URL is read from `VITE_API_URL` and defaults to the Java backend (`http://localhost:8080/api`).
To use the C# backend, copy `.env.example` to `.env.local` and set `VITE_API_URL=http://localhost:5213/api`.
Both backends must be started first (see the [root README](../README.md)).

---

### 🧱 UI Documentation

The project integrates **Storybook** to document and visualize UI components in isolation.  
Run it locally with:

```bash
npm run storybook