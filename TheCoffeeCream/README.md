# ☕ The Coffee Cream Project

A premium, end-to-end coffee shop management system featuring a high-performance .NET backend, a React/Capacitor mobile suite for staff and shop admins, and an Angular 18 Portal for Super Admins.

## 📂 Project Structure

- **[api/](file:///d:/Project/Project_B/TheCoffeeCream/api)**: ASP.NET Core Web API using Clean Architecture and SQL Server as the primary database.
- **[mobile/](file:///d:/Project/Project_B/TheCoffeeCream/mobile)**: A modern monorepo containing:
  - **[app-staff](file:///d:/Project/Project_B/TheCoffeeCream/mobile/apps/app-staff)**: Order taking and payment app for staff (React 18 & Capacitor).
  - **[app-admin](file:///d:/Project/Project_B/TheCoffeeCream/mobile/apps/app-admin)**: Management dashboard and business insights for shop admins (React 18 & Capacitor).
  - **[app-owner](file:///d:/Project/Project_B/TheCoffeeCream/mobile/apps/app-owner)**: Web portal for Super Admins to manage all shops and subscriptions (Angular 18).
  - **[ui-shared](file:///d:/Project/Project_B/TheCoffeeCream/mobile/apps/ui-shared)**: Single Source of Truth for UI, API services, and Offline logic for React apps.
- **publish/**: Build artifacts and deployment scripts.

## 🚀 Quickstart (Docker)

The easiest way to run the entire system is using Docker Compose.

### Prerequisites
- Docker Desktop installed and running.

### Option 1: Development Mode (Hot Reload) - Recommended
Run this if you want changes to files to automatically reflect in the browser.
```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Option 2: Production Mode
Run this to test the final built artifacts (static files served by Nginx).
```bash
docker-compose up --build
```

### Accessing the Apps
- **API**: http://localhost:8080
- **Admin App**: http://localhost:4000
- **Staff App**: http://localhost:4001
- **Owner App**: http://localhost:4002

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
- **Centralized API Layer**: All React mobile apps share a unified service layer in `ui-shared`, ensuring zero logic duplication.
- **Global Offline Sync**: Reliable order processing powered by a shared `OfflineQueue` for Staff devices.
- **Backend DDD**: Clean Architecture with a robust SQL Server and Dapper implementation for high-performance data management.

## 🛠️ Build & Deploy
- **Docker**: Root-level `Dockerfile` for backend deployment.
- **Mobile APKs**: Timestamped builds located in `android/app/build/outputs/apk/debug/` for each app.

---
Proprietary © 2026 The Coffee Cream
