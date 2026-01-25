# 📦 @thecoffeecream/ui-shared

The core bridge of The Coffee Cream ecosystem. Provides a unified Design System, API layer, and Business Utils.

## 🚀 Shared Architecture
This package is the "Single Source of Truth" for:
- **UI Kit**: High-performance, consistent UI components (Vibrant glassmorphism theme).
- **API Services**: Centralized fetch logic (`ordersApi`, `productsApi`, `reportsApi`, `usersApi`, `dashboardApi`).
- **Offline Sync**: Global `OfflineQueue` for zero-latency order processing across all apps.
- **Design System**: Centralized SCSS modules for buttons, layouts, and animations.

## 📦 What's Inside
- **`/components`**: Reusable Atoms (Badge, Icon, Spinner) and Layouts (SideMenu, StatCard, Modals).
- **`/services`**: Unified API clients with built-in caching and offline support.
- **`/utils`**: Business logic standardizes (Calculations, Price/Date Formatters).
- **`/styles`**: Centralized design tokens and CSS variables.

## 🛠️ Usage
Everything is exported via a clean Barrel export:
```javascript
import { ordersApi, formatPrice, SideMenu, StatCard } from '@thecoffeecream/ui-shared';
```

---
Proprietary © 2026 The Coffee Cream
