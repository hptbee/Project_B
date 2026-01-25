# ☕ The Coffee Cream Project

A premium, end-to-end coffee shop management system featuring a high-performance .NET backend and a modern React/Capacitor mobile suite.

## 📂 Project Structure

- **[api/](file:///d:/Project/Project_B/TheCoffeeCream/api)**: ASP.NET Core Web API using Clean Architecture and Google Sheets as a database.
- **[mobile/](file:///d:/Project/Project_B/TheCoffeeCream/mobile)**: A modern monorepo containing:
  - **[app-staff](file:///d:/Project/Project_B/TheCoffeeCream/mobile/apps/app-staff)**: Order taking and payment app for staff.
  - **[app-admin](file:///d:/Project/Project_B/TheCoffeeCream/mobile/apps/app-admin)**: Management dashboard and business insights.
  - **[ui-shared](file:///d:/Project/Project_B/TheCoffeeCream/mobile/apps/ui-shared)**: Single Source of Truth for UI, API services, and Offline logic.
- **publish/**: Build artifacts and deployment scripts.

## 🚀 Quickstart (Local Development)

### Prerequisites
- .NET 8 SDK
- Node.js 20+ and npm
- Android Studio (for native APK builds)

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
- **Centralized API Layer**: All mobile apps share a unified service layer in `ui-shared`, ensuring zero logic duplication.
- **Global Offline Sync**: Reliable order processing powered by a shared `OfflineQueue`.
- **Backend DDD**: Clean Architecture with a Google Sheets repository for lightweight data management.

## 🛠️ Build & Deploy
- **Docker**: Root-level `Dockerfile` for backend deployment.
- **Mobile APKs**: Timestamped builds located in `android/app/build/outputs/apk/debug/` for each app.

---
Proprietary © 2026 The Coffee Cream
