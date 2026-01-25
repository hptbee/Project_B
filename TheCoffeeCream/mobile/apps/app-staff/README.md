# ☕ The Coffee Cream - Staff App

Modern point-of-sale and order management for staff.

## ✨ Features
- **Offline-First**: Instant feedback when creating orders; auto-syncs when online.
- **Table Management**: Real-time table status and order tracking.
- **Flexible Checkout**: Supports Cash, Transfer, and split payments.
- **Menu Sync**: One-tap synchronization with centralized product database.

## 🔄 Sync Engine
- Uses `localStorage` queue for zero-latency order submission.
- Background worker automatically resolves the queue once internet is restored.

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

cd mobile\apps\app-staff; npm run build; npx cap sync android; cd android; ./gradlew assembleDebug
```
*Output: `TheCoffeeCream-Staff-1.0-YYYYMMDDHHMMSS.apk`*

---
Proprietary © 2026 The Coffee Cream
