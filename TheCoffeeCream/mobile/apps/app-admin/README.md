# 👑 The Coffee Cream - Admin Portal

Business administration and analytics dashboard.

## ✨ Features
- **sales Insights**: Real-time sales and revenue tracking.
- **Order Management**: Comprehensive view and update of all store orders.
- **Product Management**: (Roadmap) CRUD operations for the store menu.
- **Premium UI**: Dark-mode glassmorphism powered by `@thecoffeecream/ui-shared`.

## 🛠️ Shared Kit Utilization
This app consumes `@thecoffeecream/ui-shared` for:
- API Services (Unified fetching logic)
- Business Utils (Price formatting, date handling)
- UI Primitives (Modals, Toast, SideMenu)

## 🚀 Quick Start
```bash
npm install
npm run dev
```

## 🏗️ Android Build
```bash
npm run build
npx cap sync android
cd android; ./gradlew assembleDebug

cd mobile\apps\app-admin; npm run build; npx cap sync android; cd android; ./gradlew assembleDebug
```
*Output: `TheCoffeeCream-Admin-1.0-YYYYMMDDHHMMSS.apk`*

---
Proprietary © 2026 The Coffee Cream
