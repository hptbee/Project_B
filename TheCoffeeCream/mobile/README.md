# 📱 The Coffee Cream Mobile Monorepo

The mobile workspace for The Coffee Cream system, featuring shared logic and specialized applications.

## 📦 Structure
- **[apps/app-staff](file:///d:/Project/Project_B/TheCoffeeCream/mobile/apps/app-staff)**: Staff-facing application for order management.
- **[apps/app-admin](file:///d:/Project/Project_B/TheCoffeeCream/mobile/apps/app-admin)**: Administrative dashboard and analytics.
- **[apps/ui-shared](file:///d:/Project/Project_B/TheCoffeeCream/mobile/apps/ui-shared)**: The core library containing all shared UI modules, API clients, and business utilities.

## 🛠️ Shared Logic (Best Practice)
All core calculations, price formatting, and API services are centralized in `ui-shared`. This ensures:
- **Consistency**: The Admin and Staff apps always show the same prices and data.
- **Maintenance**: Business logic updates only need to be made in one place.

## 🚀 Development
```bash
npm install
npm run dev --workspaces
```

## 🏗️ Native Builds
Native Android projects are located in `android/` folders of each app.
1. `npm run build`
2. `npx cap sync`
3. `cd android; ./gradlew assembleDebug`

---
Proprietary © 2026 The Coffee Cream
