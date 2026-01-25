# ☕ The Coffee Cream - Staff App

Modern point-of-sale and order management for staff.

## ✨ Features
- **Offline-First Ready**: Powered by `@thecoffeecream/ui-shared/OfflineQueue` for zero-latency order submission.
- **Table Management**: Real-time table status and order tracking.
- **Flexible Checkout**: Supports Cash, Transfer, and split payments.
- **Universal Sync**: One-tap synchronization of Menu, Orders, and Reports via centralized API services.

## 🔄 Core Architecture
- **API Connectivity**: Consumes `ordersApi`, `productsApi`, and `reportsApi` from the shared library.
- **Persistence**: Hybrid caching using `cacheService` for optimal offline performance.

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
```
*Output: `TheCoffeeCream-Staff-1.0-YYYYMMDDHHMMSS.apk`*

---
Proprietary © 2026 The Coffee Cream
