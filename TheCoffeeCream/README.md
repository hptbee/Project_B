# ☕ The Coffee Cream Project

A premium, end-to-end coffee shop management system featuring a high-performance .NET backend and a modern React/Capacitor mobile suite.

## 📂 Project Structure

- **[api/](file:///d:/Project/Project_B/TheCoffeeCream/api)**: ASP.NET Core Web API using Clean Architecture and Google Sheets as a database.
- **[mobile/](file:///d:/Project/Project_B/TheCoffeeCream/mobile)**: A standard monorepo containing:
  - **[app-staff](file:///d:/Project/Project_B/TheCoffeeCream/mobile/apps/app-staff)**: Order taking and payment app for staff.
  - **[app-admin](file:///d:/Project/Project_B/TheCoffeeCream/mobile/apps/app-admin)**: Management dashboard and business insights.
  - **[ui-shared](file:///d:/Project/Project_B/TheCoffeeCream/mobile/apps/ui-shared)**: Shared UI kit, API services, and business logic.
- **publish/**: Build artifacts and deployment scripts.

## 🚀 Quickstart (Local Development)

### Prerequisites
- .NET 8 SDK
- Node.js 20+ and npm
- Android Studio (for native builds)

### 1. Root Setup
```bash
npm install
```

### 2. Run Backend
```bash
cd api/TheCoffeeCream
dotnet run
```

### 3. Run Mobile Apps
```bash
cd mobile
npm run dev --workspaces
```

## 🌐 Architecture Highlights
- **Backend**: Domain-Driven Design (DDD) with a Google Sheets repository implementation for lightweight but powerful data management.
- **Frontend Monorepo**: Shared business logic and UI components ensure 100% consistency across staff and admin apps.
- **Offline-First**: Reliable order processing even with intermittent connectivity.

## 🛠️ Build & Deploy
- **Docker**: Root-level `Dockerfile` for backend deployment.
- **Mobile**: Capacitor-based native Android builds with timestamped APK generation.

---
Proprietary © 2026 The Coffee Cream
