# 📦 @thecoffeecream/ui-shared

The core bridge of The Coffee Cream ecosystem. Provides a unified Design System, API layer, and Business Utils.

## 🚀 Shared Architecture
This package is the "Single Source of Truth" for:
- **UI Kit**: High-performance, consistent UI components (Glassmorphism theme).
- **API Services**: Centralized fetch logic with built-in synchronization.
- **Business Logic**: Price calculations, currency formatting, and state management hooks.

## 📦 What's Inside
- **`/components`**: Reusable Atoms and Layouts (SideMenu, Buttons, Modals).
- **`/services`**: Unified API clients and Logging.
- **`/utils`**: Business logic standardizes (Calculations, Formatters).
- **`/styles`**: Centralized design tokens and CSS variables.

## 🛠️ Usage
Everything is exported via a clean Barrel export:ss                                      ê
```javascript
import { apiFetch, formatPrice, SideMenu } from '@thecoffeecream/ui-shared';
```

---
Proprietary © 2026 The Coffee Cream
