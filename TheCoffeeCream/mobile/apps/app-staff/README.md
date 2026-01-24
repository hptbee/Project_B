# App Staff - Coffee Cream Mobile

Project Management Staff App built with React, Vite, and Feature-First Architecture.

## 🏗️ Architecture: Feature-First

This project uses a **Feature-First Architecture** to improve scalability and maintainability. Code is organized by **business domain** (features) rather than technical type (pages, components, styles).

### 📂 Directory Structure

```
src/
├── features/              # Domain-specific modules
│   ├── cart/              # Cart logic & UI
│   ├── checkout/          # Checkout flow
│   ├── menu/              # Menu management & settings
│   ├── orders/            # Order history & details
│   ├── products/          # Product list & details
│   ├── reports/           # EOD reports
│   └── tables/            # Table management
│       ├── components/    # Feature-specific components
│       ├── hooks/         # Feature-specific hooks
│       └── pages/         # Feature routes/pages
│
├── shared/                # Reusable code across features
│   ├── components/
│   │   ├── layout/        # Layout components (SideMenu, etc.)
│   │   └── ui/            # Atomic UI (Icon, Button, Loading...)
│   ├── contexts/          # Global state (Cart, User, UI...)
│   ├── hooks/             # Shared hooks (useDebounce, useAutoSave...)
│   ├── services/          # API & external services
│   └── utils/             # Helpers
│
├── styles/                # Global styles & mixins
├── App.jsx                # Root component
├── routes.jsx             # Centralized route definitions
└── main.jsx               # Entry point
```

### 📏 Development Guidelines

#### 1. Feature Isolation
- Place code related to a specific business feature inside `src/features/<feature-name>`.
- A feature should contain its own `pages`, `components`, and `hooks` if they are not used elsewhere.

#### 2. Shared Resources
- Only move code to `src/shared` if it is **truly generic** or used by **multiple features**.
- `shared/components/ui` for dumb UI components.
- `shared/services/api` for API calls.

#### 3. Imports
- Use absolute paths with `@/` alias.
- Examples:
  - `import { api } from '@/shared/services/api'`
  - `import Button from '@/shared/components/ui/Button'`

#### 4. State Management
- **Local State**: Use `useState` inside components.
- **Feature State**: Use custom hooks inside feature folders.
- **Global State**: Use Contexts in `src/shared/contexts`.

## 🚀 Getting Started

```bash
npm install
npm run dev
npm run build
```

## ✅ Verified Features
- **Orders**: Draft saving, auto-save, table management.
- **Checkout**: Cash/Transfer/Combined payments with validation.
- **UI**: Responsive SideMenu, Debounced Search, Optimized Lists.

## 📱 Android Build

To build the APK for Android, make sure you have **JDK 17** and **Android SDK** installed.

**Prerequisites Environment Variables:**
- `JAVA_HOME`: Path to JDK 17 (e.g., `C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot`)
- `ANDROID_HOME`: Path to Android SDK (e.g., `C:\Users\NCPC\Android\Sdk`)

**One-liner Build Command:**
Run this from the `mobile\apps\app-staff` directory:
```powershell
npm run build; npx cap sync android; cd android; .\gradlew assembleDebug; cd ..
```

**Step-by-Step Build:**

1. **Build web assets:**
```bash
npm run build
```

2. **Sync with Android project:**
```bash
npx cap sync android
```

3. **Build APK:**
```powershell
cd android
.\gradlew assembleDebug
```

**Output:**
The APK will be generated at: `mobile\apps\app-staff\android\app\build\outputs\apk\debug\`.

> [!TIP]
> The APK filename includes a timestamp to prevent file locking: 
> `TheCoffeeCream-Staff-1.0-YYYYMMDDHHMMSS.apk`
