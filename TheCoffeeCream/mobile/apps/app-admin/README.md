# 👑 The Coffee Cream - Admin Portal

Business administration and analytics dashboard.

## ✨ Features
- **Sales Insights**: Real-time revenue tracking and trend analysis via `reportsApi`.
- **Order Management**: Comprehensive view and update of all store orders.
- **Dashboard Metrics**: Instant business health overview using the `dashboardApi`.
- **Premium UI**: Dark-mode glassmorphism powered by `@thecoffeecream/ui-shared` components.

## 🛠️ Shared Kit Utilization
This app consumes `@thecoffeecream/ui-shared` for:
- **API Services**: Unified fetching logic for reports, products, and users.
- **UI Components**: High-level modules like `StatCard`, `DateRangePicker`, and `LoadingSpinner`.
- **Business Utils**: Standardized price formatting and date handling.

## 🚀 Quick Start
```bash
npm install
npm run dev
```

## 🏗️ Android Build (Automated)
```bash
npm run build:apk
```
*Auto-builds, syncs, compiles, and exports timestamped APK to `mobile/publish/` folder.*
*Output: `TheCoffeeCream-Admin-1.0-YYYYMMDDHHMMSS.apk`*

---
Proprietary © 2026 The Coffee Cream
